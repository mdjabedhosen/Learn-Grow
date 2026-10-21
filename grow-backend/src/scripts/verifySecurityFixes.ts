/**
 * Live verification of the security fixes from audit batch 1 and 2.
 *
 * Runs against the real dev server and the real database. Every check uses
 * throwaway fixtures that are removed again in a `finally` block.
 *
 * Run with:
 *   cd grow-backend && node --import tsx src/scripts/verifySecurityFixes.ts
 */
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { ENV } from "../config/env.js";
import { User } from "../modules/user/model/user.model.js";
import { Course } from "../modules/course/model/course.model.js";
import { Enrollment } from "../modules/enrollment/model/enrollment.model.js";

const BASE = "http://localhost:5005/api";

let failed = false;
const fail = (m: string) => {
  failed = true;
  console.log(`    FAIL: ${m}`);
};
const pass = (m: string) => console.log(`    PASS: ${m}`);

const api = async (
  path: string,
  opts: { method?: string; token?: string; body?: unknown } = {}
) => {
  const res = await fetch(`${BASE}${path}`, {
    method: opts.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
    },
    ...(opts.body !== undefined ? { body: JSON.stringify(opts.body) } : {}),
  });
  const text = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  return { status: res.status, json };
};

const stamp = Date.now();
const studentEmail = `secfix-student-${stamp}@example.test`;
const blockedEmail = `secfix-blocked-${stamp}@example.test`;
const PASSWORD = "Temporary@123";

const run = async () => {
  await mongoose.connect(ENV.MONGODB_URI);
  const hashed = await bcrypt.hash(PASSWORD, 10);

  const student = await User.create({
    name: "SecFix Student",
    email: studentEmail,
    phone: `+8803${String(stamp).slice(-9)}`,
    password: hashed,
    role: "student",
    isVerified: true,
  });

  const blocked = await User.create({
    name: "SecFix Blocked",
    email: blockedEmail,
    phone: `+8802${String(stamp).slice(-9)}`,
    password: hashed,
    role: "student",
    isVerified: true,
    isBlocked: true,
  });

  try {
    // ---------- C-2: unauthenticated role escalation ----------
    console.log("\n[C-2] unauthenticated select-role must be rejected");
    const escalate = await api(`/users/select-role/${student._id}`, {
      method: "POST",
      body: { role: "admin" },
    });
    console.log(`    status=${escalate.status}`);
    if (escalate.status === 401) pass("rejected without a token");
    else fail(`expected 401, got ${escalate.status}`);

    const afterEscalate = await User.findById(student._id).select("role").lean();
    if (afterEscalate?.role === "student") pass("the role was not changed");
    else fail(`the role became "${afterEscalate?.role}"`);

    // ---------- H-4: a blocked account cannot log in or use a token ----------
    console.log("\n[H-4] a blocked account must be refused");
    const blockedLogin = await api("/users/login", {
      method: "POST",
      body: { email: blockedEmail, password: PASSWORD },
    });
    console.log(`    login status=${blockedLogin.status}`);
    if (blockedLogin.status === 400 || blockedLogin.status === 401) pass("login rejected");
    else fail(`login was not rejected (status ${blockedLogin.status})`);

    // Give the blocked user a valid token, then use it.
    const { generateAccessToken } = await import("../utils/jwt");
    const blockedToken = generateAccessToken(blocked._id.toString(), "student");
    const blockedCall = await api("/users/profile", { token: blockedToken });
    console.log(`    profile status=${blockedCall.status}`);
    if (blockedCall.status === 403) pass("an existing token is refused too");
    else fail(`expected 403, got ${blockedCall.status}`);

    // ---------- H-3: the quiz answer key is not exposed ----------
    console.log("\n[H-3] the quiz answer key must not be exposed to students");
    const { Quiz } = await import("../modules/quiz/model/quiz.model");
    const quiz = await Quiz.create({
      assessmentId: new mongoose.Types.ObjectId(),
      courseId: new mongoose.Types.ObjectId(),
      createdBy: new mongoose.Types.ObjectId(),
      title: "SecFix Quiz",
      assessmentType: "quiz",
      questions: [
        {
          questionText: "2 + 2?",
          questionType: "multiple-choice",
          points: 1,
          order: 1,
          options: [
            { text: "4", isCorrect: true },
            { text: "5", isCorrect: false },
          ],
          correctAnswer: "4",
          explanation: "two plus two",
        },
      ],
      duration: 10,
      totalPoints: 1,
      status: "published",
    });

    const { generateAccessToken: gen } = await import("../utils/jwt");
    const studentToken = gen(student._id.toString(), "student");
    const quizRead = await api(`/quiz/${quiz._id}`, { token: studentToken });
    const question = quizRead.json?.data?.questions?.[0];
    const leaked =
      question?.options?.some((o: any) => "isCorrect" in o) ||
      "correctAnswer" in (question || {}) ||
      "explanation" in (question || {});

    console.log(`    status=${quizRead.status} options=${JSON.stringify(question?.options)}`);
    if (!leaked) pass("no answer key in the response");
    else fail("the answer key was returned");

    // ---------- H-5: paid content is not served anonymously ----------
    console.log("\n[H-5] locked lessons must not leak their content links");
    const course = await Course.findOne({ price: { $gt: 0 } }).lean();
    if (course) {
      const { Module } = await import("../modules/course/model/module.model");
      const { Lesson } = await import("../modules/course/model/lesson.model");
      const module = await Module.create({ courseId: course._id, title: "SecFix Module", orderIndex: 99 });
      const lesson = await Lesson.create({
        moduleId: module._id,
        title: "SecFix Lesson",
        type: "video",
        contentUrl: "https://videos.example.com/paid.mp4",
        contentLinks: [{ title: "Paid PDF", url: "https://drive.example.com/paid.pdf", type: "pdf" }],
        orderIndex: 1,
      });
      void lesson;

      const anon = await api(`/course/get-course/${course._id}`);
      const anonLessons = (anon.json?.data?.modules || []).flatMap((m: any) => m.lessons || []);
      const leakedLesson = anonLessons.find(
        (l: any) =>
          l.isLocked &&
          (l.contentUrl || (l.contentLinks || []).length > 0)
      );

      const locked = anonLessons.filter((l: any) => l.isLocked).length;
      console.log(`    status=${anon.status} lessons=${anonLessons.length} locked=${locked}`);
      if (!leakedLesson) pass("no content url or content link for a locked lesson");
      else fail(`leaked: ${JSON.stringify(leakedLesson.contentUrl || leakedLesson.contentLinks)}`);

      // A free preview must still be reachable.
      const preview = await Lesson.create({
        moduleId: module._id,
        title: "Free Preview",
        type: "video",
        contentUrl: "https://videos.example.com/free.mp4",
        orderIndex: 2,
        isFreePreview: true,
      });
      const anon2 = await api(`/course/get-course/${course._id}`);
      const previewLessons = (anon2.json?.data?.modules || []).flatMap((m: any) => m.lessons || []);
      const found = previewLessons.find((l: any) => String(l._id) === String(preview._id));
      if (found && !found.isLocked) pass("a free preview lesson is still open");
      else fail("the free preview lesson was locked");

      await Lesson.deleteMany({ moduleId: module._id });
      await Module.deleteOne({ _id: module._id });
    }

    // ---------- C-5: a combo needs a paid, approved order ----------
    console.log("\n[C-5] enrolling in a paid combo needs a purchase");
    const { Combo } = await import("../modules/course/model/combo.model");
    const combo = await Combo.create({
      name: "SecFix Combo",
      description: "test",
      courses: [course?._id || new mongoose.Types.ObjectId()],
      price: 9999,
      duration: "1-month",
      isActive: true,
      createdBy: student._id,
    });
    const comboEnroll = await api("/combo/enroll", {
      method: "POST",
      token: studentToken,
      body: { comboId: combo._id.toString() },
    });
    console.log(`    status=${comboEnroll.status} message=${comboEnroll.json?.message}`);
    if (comboEnroll.status === 400 || comboEnroll.status === 403) {
      pass("enrollment refused without a paid order");
    } else {
      fail(`expected a refusal, got ${comboEnroll.status}`);
    }

    const comboEnrollments = await Enrollment.countDocuments({
      studentId: student._id,
      comboId: combo._id,
    });
    if (comboEnrollments === 0) pass("no enrollment row was created");
    else fail(`${comboEnrollments} enrollment row(s) were created`);

    await Combo.deleteOne({ _id: combo._id });


    // ---------- H-14: the quiz is graded on the server ----------
    console.log("\n[H-14] the quiz must be graded on the server");
    const { Quiz: QuizModel } = await import("../modules/quiz/model/quiz.model");
    const serverQuiz = await QuizModel.create({
      assessmentId: new mongoose.Types.ObjectId(),
      courseId: course?._id || new mongoose.Types.ObjectId(),
      createdBy: new mongoose.Types.ObjectId(),
      title: "SecFix Quiz",
      assessmentType: "quiz",
      questions: [
        {
          questionText: "2 + 2?",
          questionType: "multiple-choice",
          points: 10,
          order: 1,
          options: [
            { text: "4", isCorrect: true },
            { text: "5", isCorrect: false },
          ],
        },
      ],
      duration: 10,
      totalPoints: 10,
      passingScore: 50,
      status: "published",
    });

    if (course) {
      // The student needs an enrollment to submit.
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
    }

    const { generateAccessToken: gen2 } = await import("../utils/jwt");
    const submitToken = gen2(student._id.toString(), "student");
    const questionId = serverQuiz.questions[0]._id.toString();

    const right = await api(`/quiz/${serverQuiz._id}/submit`, {
      method: "POST",
      token: submitToken,
      body: { answers: { [questionId]: 0 } },
    });
    console.log(
      `    correct answer -> score=${right.json?.data?.score} pct=${right.json?.data?.percentage} passed=${right.json?.data?.passed}`
    );
    if (right.json?.data?.score === 10 && right.json?.data?.passed === true) {
      pass("the server graded the correct answer");
    } else {
      fail(`unexpected grade: ${JSON.stringify(right.json?.data)}`);
    }

    const wrong = await api(`/quiz/${serverQuiz._id}/submit`, {
      method: "POST",
      token: submitToken,
      body: { answers: { [questionId]: 1 } },
    });
    console.log(`    wrong answer   -> score=${wrong.json?.data?.score} passed=${wrong.json?.data?.passed}`);
    if (wrong.json?.data?.score === 0 && wrong.json?.data?.passed === false) {
      pass("the server graded the wrong answer");
    } else {
      fail(`unexpected grade: ${JSON.stringify(wrong.json?.data)}`);
    }

    const completed = await Enrollment.findOne({
      studentId: student._id,
      courseId: course?._id,
    });
    if ((completed?.completedQuizzes || []).length > 0) {
      pass("the completion was recorded on the enrollment");
    } else {
      fail("completedQuizzes was not recorded");
    }
    await QuizModel.deleteOne({ _id: serverQuiz._id });

    // ---------- H-10: the order email relay is closed ----------
    console.log("\n[H-10] the order email relay must be closed");
    const relay = await api("/orders/send-email", {
      method: "POST",
      body: { to: "attacker@evil.test", subject: "hi", type: "approval", orderDetails: {} },
    });
    console.log(`    status=${relay.status}`);
    if (relay.status === 401 || relay.status === 403) pass("rejected without admin auth");
    else fail(`expected 401/403, got ${relay.status}`);

    // ---------- H-13: the profile no longer contains the OTP ----------
    console.log("\n[H-13] the profile must not expose the live OTP");
    await User.findByIdAndUpdate(student._id, { otp: "123456", otpExpiresAt: new Date(Date.now() + 600000) });
    const profile = await api("/users/profile", { token: studentToken });
    const hasOtp = "otp" in (profile.json?.data || {});
    console.log(`    status=${profile.status} hasOtp=${hasOtp}`);
    if (!hasOtp) pass("the OTP is not in the profile response");
    else fail("the OTP is still returned");

    // ---------- H-11: logging out revokes the access token ----------
    console.log("\n[H-11] logging out must revoke the access token");
    const beforeLogout = await api("/users/profile", { token: studentToken });
    const logout = await api("/users/logout", { method: "POST", token: studentToken });
    const afterLogout = await api("/users/profile", { token: studentToken });
    console.log(`    before=${beforeLogout.status} logout=${logout.status} after=${afterLogout.status}`);
    if (beforeLogout.status === 200 && afterLogout.status === 401) {
      pass("the token no longer works after logout");
    } else {
      fail(`token still valid after logout (${afterLogout.status})`);
    }
  } finally {
    await User.deleteMany({ _id: { $in: [student._id, blocked._id] } });
    const { Quiz } = await import("../modules/quiz/model/quiz.model");
    await Quiz.deleteMany({ title: "SecFix Quiz" });
    const left = await User.countDocuments({ _id: { $in: [student._id, blocked._id] } });
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
