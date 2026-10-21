/**
 * End-to-end verification of the quiz flow in a real browser.
 *
 * Creates a course + quiz + enrolled student, drives headless Chrome
 * through the student quiz page, submits an attempt, and checks that the
 * server graded it and recorded the completion.
 *
 * Run with:
 *   cd grow-backend && node --import tsx src/scripts/verifyQuizFlowUi.ts
 */
import bcrypt from "bcryptjs";
import { spawn, type ChildProcess } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

import mongoose from "mongoose";
import WebSocket from "../../../learn-grow/node_modules/ws/index.js";

import { ENV } from "../config/env.js";
import { User } from "../modules/user/model/user.model.js";
import { Course } from "../modules/course/model/course.model.js";
import { Enrollment } from "../modules/enrollment/model/enrollment.model.js";
import { Quiz, QuizSubmission } from "../modules/quiz/model/quiz.model.js";
import { generateAccessToken } from "../utils/jwt.js";

const FRONTEND = "http://localhost:3000";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9444;
const PASSWORD = "Temporary@123";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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
    await sleep(3000);
  }

  close() {
    this.ws?.close();
  }
}

const run = async () => {
  await mongoose.connect(ENV.MONGODB_URI);

  const stamp = Date.now();
  const email = `quizui-${stamp}@example.test`;
  const student = await User.create({
    name: "Quiz UI Student",
    email,
    phone: `+8809${String(stamp).slice(-9)}`,
    password: await bcrypt.hash(PASSWORD, 10),
    role: "student",
    isVerified: true,
  });

  // Reuse an existing course so the fixture does not have to satisfy the
  // whole Course schema.
  const course = await Course.findOne();
  if (!course) throw new Error("No course available for the fixture");

  await Enrollment.create({
    studentId: student._id,
    courseId: course._id,
    progress: 0,
    completionPercentage: 0,
    isCompleted: false,
    completedLessons: [],
    completedModules: [],
    completedAssignments: [],
    completedQuizzes: [],
    completedProjects: [],
  });

  const quiz = await Quiz.create({
    assessmentId: new mongoose.Types.ObjectId(),
    courseId: course._id,
    createdBy: new mongoose.Types.ObjectId(),
    title: `Quiz UI Quiz ${stamp}`,
    assessmentType: "quiz",
    questions: [
      {
        questionText: "What is 2 + 2?",
        questionType: "multiple-choice",
        points: 10,
        order: 1,
        options: [
          { text: "4", isCorrect: true },
          { text: "5", isCorrect: false },
        ],
      },
    ],
    duration: 30,
    totalPoints: 10,
    passingScore: 50,
    status: "published",
  });

  let chrome: ChildProcess | undefined;
  let profile = "";
  let failed = false;
  const fail = (m: string) => {
    failed = true;
    console.log(`    FAIL: ${m}`);
  };
  const pass = (m: string) => console.log(`    PASS: ${m}`);

  try {
    profile = fs.mkdtempSync(path.join(os.tmpdir(), "quiz-ui-"));
    chrome = spawn(
      CHROME,
      [
        "--headless=new",
        `--remote-debugging-port=${PORT}`,
        `--user-data-dir=${profile}`,
        "--no-proxy-server",
        "--no-first-run",
        "--disable-gpu",
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
    if (!target) throw new Error("Chrome never came up");

    const cdp = new Cdp();
    await cdp.connect(target.webSocketDebuggerUrl);
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");

    // Log the student in by seeding the token the app reads.
    const token = generateAccessToken(student._id.toString(), "student");
    await cdp.goto(`${FRONTEND}/login`);
    await cdp.evaluate(`(() => {
      document.cookie = "accessToken=${token}; path=/; max-age=604800; SameSite=Lax";
      localStorage.setItem("token", "${token}");
      localStorage.setItem("accessToken", "${token}");
      localStorage.setItem("userRole", "student");
      return "seeded";
    })()`);

    console.log("\n[1] open the quiz page");
    await cdp.goto(`${FRONTEND}/quiz/${quiz._id}`);
    await sleep(4000);

    const pageState = await cdp.evaluate<any>(`(() => {
      const txt = document.body.innerText || '';
      return {
        path: location.pathname,
        hasQuiz: txt.includes(${JSON.stringify(quiz.title)}),
        // The answer key must NOT be in the page.
        leakedKey: /"isCorrect":\\s*true/.test(txt),
        text: txt.replace(/\\s+/g, ' ').slice(0, 200)
      };
    })()`);
    console.log(`    path=${pageState.path} quizVisible=${pageState.hasQuiz}`);
    if (pageState.hasQuiz) pass("the quiz page rendered");
    else fail(`the quiz page did not render: ${pageState.text}`);
    if (pageState.leakedKey) fail("the answer key is present in the page");
    else pass("no answer key in the page");

    console.log("\n[2] answer the question and submit");
    const picked = await cdp.evaluate<any>(`(() => {
      // NextUI renders a radio as <input type="radio" value="0"> inside a label.
      const radio = document.querySelector('input[type="radio"][value="0"]');
      if (radio) {
        radio.click();
        return 'picked option 0 (value 4)';
      }
      const labels = Array.from(document.querySelectorAll('label'));
      const target = labels.find(el => (el.textContent || '').trim() === '4');
      if (target) { target.click(); return 'picked 4 by label'; }
      return 'option not found';
    })()`);
    console.log(`    ${picked}`);
    await sleep(700);

    const submitted = await cdp.evaluate<any>(`(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const submit = buttons.find(b => /submit quiz/i.test(b.innerText || ''));
      if (submit) { submit.click(); return 'submitted'; }
      return 'submit button not found';
    })()`);
    console.log(`    ${submitted}`);
    await sleep(5000);

    console.log("\n[3] the server must have graded it");
    const submission = await QuizSubmission.findOne({
      quizId: quiz._id,
      studentId: student._id,
    }).lean();

    if (submission) {
      console.log(
        `    score=${submission.score}/${submission.totalPoints} pct=${submission.percentage} passed=${submission.passed}`
      );
      if (submission.score === 10 && submission.passed === true) {
        pass("the server graded the attempt correctly");
      } else {
        fail(`unexpected grade: ${JSON.stringify(submission)}`);
      }
    } else {
      fail("no QuizSubmission was recorded");
    }

    const enrollment = await Enrollment.findOne({
      studentId: student._id,
      courseId: course._id,
    }).lean();
    if ((enrollment?.completedQuizzes || []).length > 0) {
      pass("the completion was recorded on the enrollment");
    } else {
      fail("completedQuizzes was not recorded");
    }

    const resultScreen = await cdp.evaluate<any>(`(() => {
      const txt = document.body.innerText || '';
      return {
        showsScore: /10/.test(txt) && /%/.test(txt),
        text: txt.replace(/\\s+/g, ' ').slice(0, 220)
      };
    })()`);
    console.log(`    result screen: ${resultScreen.text}`);
    if (resultScreen.showsScore) pass("the result screen shows the server's grade");
    else fail("the result screen does not show the grade");

    cdp.close();
  } finally {
    chrome?.kill("SIGKILL");
    if (profile) {
      try {
        fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5 });
      } catch {
        /* best effort */
      }
    }
    await QuizSubmission.deleteMany({ quizId: quiz._id });
    await Quiz.deleteOne({ _id: quiz._id });
    await Enrollment.deleteMany({ studentId: student._id });
    await User.deleteOne({ _id: student._id });
    await mongoose.disconnect();
  }

  console.log(failed ? "\nRESULT: FAILED" : "\nRESULT: ALL CHECKS PASSED");
  process.exit(failed ? 1 : 0);
};

run().catch((error) => {
  console.error("script error:", error);
  process.exit(1);
});
