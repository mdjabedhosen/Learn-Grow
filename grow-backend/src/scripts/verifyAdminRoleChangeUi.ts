/**
 * End-to-end UI verification of the admin role change.
 *
 * Drives a real headless Chrome (with --no-proxy-server, because the sandbox
 * proxy breaks RTK Query) through the exact flow the user reported:
 *
 *   login as admin -> Admin / Users -> Edit User -> pick a role -> Save
 *
 * and asserts that the role shown in the list matches what was persisted in
 * the database. Temporary admin + student fixtures are deleted afterwards.
 *
 * Run with:
 *   cd grow-backend && node --import tsx src/scripts/verifyAdminRoleChangeUi.ts
 */
import { spawn, type ChildProcess } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import WebSocket from "../../../learn-grow/node_modules/ws/index.js";

import { ENV } from "../config/env.js";
import { User } from "../modules/user/model/user.model.js";

const BASE = "http://localhost:5005/api/users";
const FRONTEND = "http://localhost:3000";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9222;

const stamp = Date.now();
const adminEmail = `ui-admin-${stamp}@example.test`;
const studentEmail = `ui-student-${stamp}@example.test`;
const PASSWORD = "Temporary@123";
const STUDENT_MARKER = `UISmoke${stamp}`;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ */
/* minimal Chrome DevTools Protocol client                             */
/* ------------------------------------------------------------------ */
class Cdp {
  private ws!: WebSocket;
  private nextId = 1;
  private pending = new Map<number, (v: any) => void>();

  async connect(url: string) {
    this.ws = new WebSocket(url, { perMessageDeflate: false, maxPayload: 256 * 1024 * 1024 });
    await new Promise<void>((resolve, reject) => {
      this.ws.once("open", () => resolve());
      this.ws.once("error", reject);
    });
    this.ws.on("message", (raw: Buffer) => {
      const msg = JSON.parse(raw.toString());
      const resolve = this.pending.get(msg.id);
      if (resolve) {
        this.pending.delete(msg.id);
        resolve(msg);
      }
    });
  }

  send(method: string, params: any = {}): Promise<any> {
    const id = this.nextId++;
    return new Promise((resolve) => {
      this.pending.set(id, resolve);
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate<T = any>(expression: string): Promise<T> {
    const res = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
      userGesture: true,
    });
    if (res.result?.exceptionDetails) {
      throw new Error(
        "page error: " +
          (res.result.exceptionDetails.exception?.description ||
            res.result.exceptionDetails.text)
      );
    }
    return res.result?.result?.value as T;
  }

  async goto(url: string) {
    await this.send("Page.navigate", { url });
    await sleep(2500);
  }

  close() {
    this.ws?.close();
  }
}

/* ------------------------------------------------------------------ */
const run = async () => {
  let chrome: ChildProcess | undefined;
  let profile = "";
  let failed = false;
  const fail = (m: string) => {
    failed = true;
    console.log(`    FAIL: ${m}`);
  };

  await mongoose.connect(ENV.MONGODB_URI);
  const hashed = await bcrypt.hash(PASSWORD, 10);
  const admin = await User.create({
    name: "UI Admin Fixture",
    email: adminEmail,
    phone: `+8806${String(stamp).slice(-9)}`,
    password: hashed,
    role: "admin",
    isVerified: true,
    isApproved: true,
  });
  const student = await User.create({
    name: STUDENT_MARKER,
    email: studentEmail,
    phone: `+8805${String(stamp).slice(-9)}`,
    password: hashed,
    role: "student",
    isVerified: true,
  });

  try {
    // ---------- launch chrome ----------
    profile = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-role-"));
    chrome = spawn(
      CHROME,
      [
        "--headless=new",
        `--remote-debugging-port=${PORT}`,
        `--user-data-dir=${profile}`,
        "--no-proxy-server",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--window-size=1440,1000",
        "about:blank",
      ],
      { stdio: "ignore" }
    );

    let target: any = null;
    for (let i = 0; i < 40 && !target; i++) {
      await sleep(500);
      try {
        const res = await fetch(`http://localhost:${PORT}/json/list`);
        const list = (await res.json()) as any[];
        target = list.find((t) => t.type === "page");
      } catch {
        /* not up yet */
      }
    }
    if (!target) throw new Error("Chrome DevTools endpoint never came up");

    const cdp = new Cdp();
    await cdp.connect(target.webSocketDebuggerUrl);
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");

    // ---------- 1. log in through the real form ----------
    console.log("\n[1] log in through the real login form");
    await cdp.goto(`${FRONTEND}/login`);
    await cdp.evaluate(`(() => {
      const email = document.querySelector('input[type="email"]');
      const pass = document.querySelector('input[type="password"]');
      if (!email || !pass) return 'no inputs';
      const set = (el, v) => {
        const setter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype, 'value'
        ).set;
        setter.call(el, v);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      set(email, ${JSON.stringify(adminEmail)});
      set(pass, ${JSON.stringify(PASSWORD)});
      return 'filled';
    })()`);
    await sleep(600);
    await cdp.evaluate(`(() => {
      const form = document.querySelector('form');
      const btn = form && form.querySelector('button[type="submit"]');
      if (btn) { btn.click(); return 'clicked'; }
      return 'no submit button';
    })()`);
    await sleep(4000);

    const afterLogin = await cdp.evaluate<string>(
      `location.pathname + ' | ' + (document.body.innerText||'').slice(0,80).replace(/\\s+/g,' ')`
    );
    console.log(`    after login: ${afterLogin}`);
    if (afterLogin.includes("/login")) {
      fail(`still on the login page: ${afterLogin}`);
    }

    // ---------- 2. open the admin users list ----------
    console.log("\n[2] open /admin/users");
    await cdp.goto(`${FRONTEND}/admin/users`);
    await sleep(4000);
    const listState = await cdp.evaluate<any>(`(() => {
      const txt = document.body.innerText || '';
      return {
        path: location.pathname,
        hasStudent: txt.includes(${JSON.stringify(STUDENT_MARKER)}),
        textLen: txt.length,
        snippet: txt.replace(/\\s+/g,' ').slice(0,160)
      };
    })()`);
    console.log(`    path=${listState.path} rowsRendered=${listState.hasStudent}`);
    console.log(`    snippet: ${listState.snippet}`);
    if (!listState.hasStudent) {
      fail("the fixture student is not in the rendered users list");
    }

    // ---------- 3. open the edit modal ----------
    console.log("\n[3] open the 'Edit User' modal for the fixture");
    await cdp.evaluate(`(() => {
      const rows = Array.from(document.querySelectorAll('tr'));
      for (const row of rows) {
        if (!(row.innerText || '').includes(${JSON.stringify(STUDENT_MARKER)})) continue;
        const btn = row.querySelector('button[aria-haspopup]');
        if (btn) { btn.click(); return 'menu opened'; }
      }
      return 'no menu button';
    })()`);
    await sleep(1200);
    await cdp.evaluate(`(() => {
      const items = Array.from(document.querySelectorAll('[role="menuitem"]'));
      const target = items.find(el => (el.innerText||'').trim() === 'Edit User');
      if (target) { target.click(); return 'edit clicked'; }
      return 'no Edit User item: ' + items.map(i=>i.innerText.trim()).join('|');
    })()`);
    await sleep(2000);

    const modalState = await cdp.evaluate<any>(`(() => {
      const txt = document.body.innerText || '';
      return {
        open: /Platform Role Assignment/i.test(txt),
        current: (txt.match(/Current:\\s*(\\w+)/i)||[])[1] || null,
        hasInstructorCard: txt.includes('Instructor')
      };
    })()`);
    console.log(`    modal open=${modalState.open} currentRole=${modalState.current}`);
    if (!modalState.open) fail("the edit modal did not open");

    // ---------- 4. pick the Instructor role ----------
    console.log("\n[4] click the 'Instructor' role card");
    const clicked = await cdp.evaluate<string>(`(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const target = buttons.find(b => {
        const t = (b.innerText||'');
        return t.includes('Instructor') && t.includes('Teach classes');
      });
      if (target) { target.click(); return 'instructor clicked'; }
      return 'instructor card not found';
    })()`);
    console.log(`    ${clicked}`);
    if (clicked !== "instructor clicked") fail("could not click the Instructor role card");
    await sleep(800);

    const selected = await cdp.evaluate<string>(`(() => {
      const txt = document.body.innerText || '';
      return (txt.match(/Current:\\s*(\\w+)/i)||[])[1] || 'n/a';
    })()`);
    console.log(`    selected role in the modal: ${selected}`);

    // ---------- 5. save ----------
    console.log("\n[5] click Save");
    await cdp.evaluate(`(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const save = buttons.find(b => /save changes/i.test((b.innerText||'')));
      if (save) { save.click(); return 'saved'; }
      return 'save button not found: ' + buttons.map(b=>b.innerText.trim()).filter(Boolean).slice(0,25).join('|');
    })()`);
    await sleep(4000);

    // ---------- 6. assert the list + the database ----------
    console.log("\n[6] verify the list and the database");
    const dbRow = await User.findById(student._id).select("role name").lean();
    console.log(`    DB role          : ${dbRow?.role}`);
    console.log(`    DB name          : ${dbRow?.name}`);

    const listAfter = await cdp.evaluate<any>(`(() => {
      const rows = Array.from(document.querySelectorAll('tr'));
      for (const row of rows) {
        if (!(row.innerText||'').includes(${JSON.stringify(STUDENT_MARKER)})) continue;
        return { rowText: (row.innerText||'').replace(/\\s+/g,' ').slice(0,200) };
      }
      return { rowText: null };
    })()`);
    console.log(`    list row         : ${listAfter.rowText}`);

    // capture the resulting dashboard as visual evidence
    try {
      const shot = await cdp.send("Page.captureScreenshot", { format: "png" });
      const out = path.join(os.tmpdir(), "admin-role-change-proof.png");
      fs.writeFileSync(out, Buffer.from(shot.result.data, "base64"));
      console.log(`    screenshot       : ${out}`);
    } catch {
      /* screenshot is best-effort */
    }

    if (dbRow?.role !== "instructor") {
      fail(`the database role is '${dbRow?.role}', expected 'instructor'`);
    } else {
      console.log("    PASS: the database role was persisted");
    }
    if (!listAfter.rowText || !/instructor/i.test(listAfter.rowText)) {
      fail(`the users list does not show the new role: ${listAfter.rowText}`);
    } else {
      console.log("    PASS: the users list shows the new role");
    }

    cdp.close();
  } finally {
    chrome?.kill("SIGKILL");
    if (profile) {
      try {
        fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5 });
      } catch {
        /* the browser may still be releasing its profile; harmless */
      }
    }
    await User.deleteMany({ _id: { $in: [admin._id, student._id] } });
    const left = await User.countDocuments({
      _id: { $in: [admin._id, student._id] },
    });
    console.log(`\ncleanup: fixtures remaining = ${left}`);
    await mongoose.disconnect();
  }

  console.log(failed ? "\nRESULT: FAILED" : "\nRESULT: ALL CHECKS PASSED");
  process.exit(failed ? 1 : 0);
};

run().catch((error) => {
  console.error("script error:", error);
  process.exit(1);
});
