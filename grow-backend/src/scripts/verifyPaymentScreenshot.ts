/**
 * End-to-end check for the payment screenshot and the bank details.
 *
 * Creates a real order as a student with a bank transfer and a payment
 * screenshot, then verifies that:
 *   - the screenshot is stored on the order,
 *   - it comes back in the admin order list,
 *   - the bank details are populated on the payment method,
 *   - a screenshot on a non-bank method is rejected.
 */
import mongoose from "mongoose";
import { ENV } from "../config/env.js";
import { Order } from "../modules/order/model/order.model.js";
import { PaymentMethod } from "../modules/payment/model/payment-method.model.js";
import { User } from "../modules/user/model/user.model.js";
import { Course } from "../modules/course/model/course.model.js";

const BASE = "http://localhost:5005/api";
const SCREENSHOT =
  "https://res.cloudinary.com/demo/image/upload/v1/payment-proof.png";

const login = async (email: string, password: string) => {
  const res = await fetch(`${BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json: any = await res.json();
  return json?.data?.accessToken || json?.data?.token || "";
};

(async () => {
  await mongoose.connect(ENV.MONGODB_URI);
  let pass = 0;
  let fail = 0;
  const check = (label: string, ok: boolean, detail = "") => {
    console.log(`  ${ok ? "PASS" : "FAIL"}: ${label}${detail ? "  " + detail : ""}`);
    ok ? pass++ : fail++;
  };

  // ---- the bank details are on the payment method ----
  const bank = await PaymentMethod.findOne({ name: /bank|transfer/i }).lean();
  check(
    "the bank transfer method carries the structured details",
    !!bank?.accountName &&
      !!bank?.bankName &&
      !!bank?.branchName &&
      !!bank?.routingNumber,
    bank
      ? `accountName="${bank.accountName}" bank="${bank.bankName}" branch="${bank.branchName}" routing="${bank.routingNumber}"`
      : "no bank method found"
  );
  check(
    "the account number is still there",
    !!bank?.accountNumber,
    bank?.accountNumber
  );

  // ---- a student places a bank transfer order with a screenshot ----
  const student = await User.findOne({ role: "student" }).lean();
  if (!student) {
    console.log("  no student account to test with");
    process.exit(1);
  }

  // create a throwaway student with a known password
  const bcrypt = (await import("bcryptjs")).default;
  const email = `shot-test-${Date.now()}@example.test`;
  const password = "ScreenshotTest!123";
  const user = await User.create({
    name: "Screenshot Test Student",
    email,
    phone: "+8801700000099",
    password: await bcrypt.hash(password, 10),
    role: "student",
  });

  const token = await login(email, password);
  check("the test student could log in", !!token);

  const course = await Course.findOne().lean();
  const courseId = course?._id?.toString();

  const created = await fetch(`${BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      planType: "single",
      courseId,
      paymentMethodId: bank!._id.toString(),
      transactionId: "SHOTTXN12345",
      // A bank transfer is paid from a bank account, so there is no mobile
      // sender number - the account fields identify the payer.
      senderNumber: "",
      senderBankDetails: {
        accountName: "MD. JABED HOSEN",
        accountNumber: "1070448410001",
        bankName: "BRAC Bank PLC",
        branchName: "Ashulia Branch",
      },
      price: 1799,
      paymentScreenshot: SCREENSHOT,
    }),
  });
  const createdJson: any = await created.json();
  check(
    "the order was created",
    createdJson?.success === true,
    `status=${created.status} ${createdJson?.message || ""}`
  );
  check(
    "the payment screenshot came back on the created order",
    createdJson?.data?.paymentScreenshot === SCREENSHOT,
    String(createdJson?.data?.paymentScreenshot)
  );

  check(
    "the sender bank details came back on the created order",
    createdJson?.data?.senderBankDetails?.accountName === "MD. JABED HOSEN" &&
      createdJson?.data?.senderBankDetails?.accountNumber === "1070448410001" &&
      createdJson?.data?.senderBankDetails?.bankName === "BRAC Bank PLC" &&
      createdJson?.data?.senderBankDetails?.branchName === "Ashulia Branch",
    JSON.stringify(createdJson?.data?.senderBankDetails)
  );
  check(
    "the account number became the sender number",
    createdJson?.data?.senderNumber === "1070448410001",
    String(createdJson?.data?.senderNumber)
  );

  const stored = await Order.findById(createdJson?.data?._id).lean();
  check(
    "the payment screenshot is actually stored in the database",
    stored?.paymentScreenshot === SCREENSHOT,
    String(stored?.paymentScreenshot)
  );
  check(
    "the sender bank details are actually stored in the database",
    stored?.senderBankDetails?.accountNumber === "1070448410001" &&
      stored?.senderBankDetails?.bankName === "BRAC Bank PLC" &&
      stored?.senderBankDetails?.branchName === "Ashulia Branch",
    JSON.stringify(stored?.senderBankDetails)
  );

  // ---- the admin order list returns it ----
  // A throwaway admin with a known password - the real admin passwords are
  // not something this script should know.
  const adminEmail = `admin-shot-test-${Date.now()}@example.test`;
  const adminPassword = "AdminShotTest!123";
  const adminUser = await User.create({
    name: "Screenshot Test Admin",
    email: adminEmail,
    phone: `+88017000000${Math.floor(Math.random() * 90 + 10)}`,
    password: await bcrypt.hash(adminPassword, 10),
    role: "admin",
  });
  const adminToken = await login(adminEmail, adminPassword);
  if (adminToken) {
    const listRes = await fetch(`${BASE}/orders?page=1&limit=100`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const listJson: any = await listRes.json();
    const rows: any[] = listJson?.data?.orders || listJson?.data || [];
    const found = rows.find((o: any) => String(o._id) === String(createdJson?.data?._id));
    check(
      "the admin order list returns the screenshot",
      found?.paymentScreenshot === SCREENSHOT,
      String(found?.paymentScreenshot)
    );
    check(
      "the admin order list returns the bank details",
      !!found?.paymentMethodId?.accountName &&
        !!found?.paymentMethodId?.bankName &&
        !!found?.paymentMethodId?.routingNumber,
      `accountName="${found?.paymentMethodId?.accountName}" routing="${found?.paymentMethodId?.routingNumber}"`
    );
    check(
      "the admin order list returns the account the student paid from",
      found?.senderBankDetails?.accountNumber === "1070448410001" &&
        found?.senderBankDetails?.bankName === "BRAC Bank PLC",
      JSON.stringify(found?.senderBankDetails)
    );
  } else {
    console.log("  (skipped the admin list check - could not log in as admin)");
  }

  // ---- a screenshot on a mobile wallet must be ignored ----
  const bkash = await PaymentMethod.findOne({ name: /bkash/i }).lean();
  if (bkash) {
    const walletOrder = await fetch(`${BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        planType: "single",
        courseId,
        paymentMethodId: bkash._id.toString(),
        transactionId: "SHOTTXN99999",
        senderNumber: "01700000000",
        price: 1799,
        paymentScreenshot: SCREENSHOT,
      }),
    });
    const walletJson: any = await walletOrder.json();
    check(
      "a screenshot on a mobile wallet is not stored",
      walletJson?.data?.paymentScreenshot === undefined,
      String(walletJson?.data?.paymentScreenshot)
    );
  }

  // ---- a bank transfer without the account details is rejected ----
  const noBankDetails = await fetch(`${BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      planType: "single",
      courseId,
      paymentMethodId: bank!._id.toString(),
      transactionId: "SHOTTXNNOBANK",
      senderNumber: "01700000000",
      price: 1799,
    }),
  });
  const noBankJson: any = await noBankDetails.json();
  check(
    "a bank transfer without the account details is rejected",
    noBankDetails.status === 400,
    `status=${noBankDetails.status} ${noBankJson?.message || ""}`
  );

  // ---- a non-URL screenshot is rejected ----
  const badOrder = await fetch(`${BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      planType: "single",
      courseId,
      paymentMethodId: bank!._id.toString(),
      transactionId: "SHOTTXNBAD",
      senderNumber: "01700000000",
      price: 1799,
      paymentScreenshot: "javascript:alert(1)",
    }),
  });
  check(
    "a non-URL screenshot is rejected",
    badOrder.status === 400,
    `status=${badOrder.status}`
  );

  // ---- cleanup ----
  await Order.deleteMany({ transactionId: /^SHOTTXN/ });
  await User.deleteOne({ _id: user._id });
  await User.deleteOne({ _id: adminUser._id });

  console.log(`\n  ${pass} passed, ${fail} failed`);
  await mongoose.disconnect();
  process.exit(fail ? 1 : 0);
})();
