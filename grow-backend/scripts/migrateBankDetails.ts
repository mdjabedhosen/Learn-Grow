/**
 * Moves the bank transfer details out of the free-text `paymentNote` field
 * and into the structured fields on the payment method.
 *
 * The Bank Transfer method stored everything in one multi-line string:
 *
 *   Account Name : MD. JABED HOSEN
 *   Bank Name : BRAC Bank PLC
 *   Branch Name : ASHULIA  BRANCH
 *   Routing Number : 060260222
 *   SWIFT Code : BRAKBDDH
 *   NPSB/Bank Transfer
 *
 * The checkout page now presents them as labelled fields, and the admin
 * panel can edit them one by one.
 *
 * Usage: node --import tsx scripts/migrateBankDetails.ts [--apply]
 */
import mongoose from "mongoose";
import { ENV } from "../src/config/env.js";
import { PaymentMethod } from "../src/modules/payment/model/payment-method.model.js";

const APPLY = process.argv.includes("--apply");

/**
 * "Account Name : MD. JABED HOSEN" -> "MD. JABED HOSEN"
 *
 * The prefix groups must be NON-capturing, otherwise the value ends up in
 * group 2 and the first group returns the prefix word instead.
 */
const FIELD_PATTERNS: Record<string, RegExp> = {
  accountName: /^account\s*(?:holder\s*)?name\s*[:\-]\s*(.+)$/im,
  bankName: /^bank\s*name\s*[:\-]\s*(.+)$/im,
  branchName: /^branch\s*name\s*[:\-]\s*(.+)$/im,
  routingNumber: /^routing\s*(?:number|no\.?)\s*[:\-]\s*(.+)$/im,
  swiftCode: /^swift(?:\s*code)?\s*[:\-]\s*(.+)$/im,
};

(async () => {
  await mongoose.connect(ENV.MONGODB_URI);
  const methods = await PaymentMethod.find({}).lean();

  let changed = 0;
  for (const m of methods as any[]) {
    const note: string = m.paymentNote || "";
    const isBank = /bank|transfer|npsb/i.test(m.name || "");
    if (!isBank) continue;

    const parsed: Record<string, string> = {};
    for (const [field, pattern] of Object.entries(FIELD_PATTERNS)) {
      const match = note.match(pattern);
      if (match) parsed[field] = match[1].trim();
    }

    if (!Object.keys(parsed).length) {
      console.log(`  ${m.name}: no structured fields found in the note`);
      continue;
    }

    const changedFields = Object.entries(parsed).filter(
      ([k, v]) => String(m[k] || "") !== v
    );
    if (!changedFields.length) {
      console.log(`  ${m.name}: already up to date`);
      continue;
    }

    console.log(
      `  ${m.name}: ${changedFields
        .map(([k, v]) => `${k}="${v}"`)
        .join(", ")}`
    );
    if (APPLY) {
      // The structured fields now hold the details, so the note keeps only
      // the instructions that are not a field (e.g. "NPSB/Bank Transfer").
      const leftovers = note
        .split("\n")
        .filter(
          (line) =>
            line.trim() &&
            !Object.values(FIELD_PATTERNS).some((p) => p.test(line))
        )
        .map((l) => l.trim())
        .join("\n");

      await PaymentMethod.updateOne(
        { _id: m._id },
        { $set: { ...parsed, paymentNote: leftovers || note } }
      );
      changed++;
    }
  }

  // What is left in the note after the structured fields were pulled out?
  const bank = await PaymentMethod.findOne({ name: /bank|transfer/i }).lean();
  if (bank) {
    const leftovers = (bank.paymentNote || "")
      .split("\n")
      .filter((line) => line.trim() && !Object.values(FIELD_PATTERNS).some((p) => p.test(line)))
      .map((l) => l.trim());
    console.log(
      `\n  instructions left in the note: ${
        leftovers.length ? leftovers.join(" | ") : "(none)"
      }`
    );
  }

  console.log(
    `\n  ${APPLY ? `APPLIED (${changed} method(s))` : "DRY RUN - re-run with --apply"}`
  );
  await mongoose.disconnect();
})();
