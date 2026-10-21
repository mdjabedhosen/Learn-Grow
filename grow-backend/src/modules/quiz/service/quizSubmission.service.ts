/**
 * Server-side quiz submission and grading.
 *
 * The quiz was scored ENTIRELY in the browser - there was no server
 * submission endpoint at all. Two problems followed:
 *
 * 1. `Enrollment.completedQuizzes` was never populated (nothing ever pushed
 *    a quiz id into it), so `isCompleted` stayed false forever and every
 *    completion-gated feature reported 0.
 * 2. The student decided their own score, so the answer key was exposed and
 *    a score of 100% was always achievable.
 *
 * Grading now happens on the server against the stored answer key.
 */
import { Types } from "mongoose";

import { Quiz, QuizSubmission } from "../model/quiz.model";
import { User } from "@/modules/user/model/user.model";

export interface QuizSubmissionInput {
  quizId: string;
  studentId: string;
  answers: Record<string, string | number>;
}

const normalise = (value: unknown): string =>
  String(value ?? "")
    .trim()
    .toLowerCase();

/** Grade one question against the stored answer key. */
const gradeQuestion = (
  question: any,
  answer: string | number | undefined
): { earned: number; correct: boolean } => {
  const points = Number(question?.points) || 0;

  if (answer === undefined || answer === null || answer === "") {
    return { earned: 0, correct: false };
  }

  // Multiple choice: the selected option index, or the option text.
  if (Array.isArray(question?.options) && question.options.length > 0) {
    const selectedIndex = typeof answer === "number" ? answer : -1;

    if (selectedIndex >= 0 && question.options[selectedIndex]) {
      return {
        earned: question.options[selectedIndex].isCorrect ? points : 0,
        correct: !!question.options[selectedIndex].isCorrect,
      };
    }

    // The client may have sent the option text instead of its index.
    const byText = question.options.find(
      (option: any) => normalise(option?.text) === normalise(answer)
    );
    if (byText) {
      return { earned: byText.isCorrect ? points : 0, correct: !!byText.isCorrect };
    }

    return { earned: 0, correct: false };
  }

  // Short answer / true-false: compare with `correctAnswer`.
  if (question?.correctAnswer !== undefined && question?.correctAnswer !== null) {
    const correct =
      normalise(question.correctAnswer) === normalise(answer);
    return { earned: correct ? points : 0, correct };
  }

  return { earned: 0, correct: false };
};

export const submitQuiz = async (input: QuizSubmissionInput) => {
  try {
    const quiz = await Quiz.findById(input.quizId);
    if (!quiz) {
      return { success: false, message: "Quiz not found" };
    }

    if (quiz.status === "draft") {
      return { success: false, message: "This quiz is not open for submission" };
    }

    // The student must be enrolled in the course the quiz belongs to.
    const { Enrollment } = await import(
      "@/modules/enrollment/model/enrollment.model"
    );
    const enrollment = await Enrollment.findOne({
      studentId: new Types.ObjectId(input.studentId),
      courseId: quiz.courseId,
    });

    if (!enrollment) {
      return {
        success: false,
        message: "You are not enrolled in this course.",
      };
    }

    const answers = input.answers || {};
    let earned = 0;
    let total = 0;
    const results: Array<{
      questionId: string;
      correct: boolean;
      earned: number;
      points: number;
    }> = [];

    for (const question of quiz.questions || []) {
      const points = Number(question?.points) || 0;
      total += points;

      const answer = answers[question._id?.toString() ?? String(question.order)];
      const graded = gradeQuestion(question, answer);

      earned += graded.earned;
      results.push({
        questionId: question._id?.toString() ?? String(question.order),
        correct: graded.correct,
        earned: graded.earned,
        points,
      });
    }

    const percentage = total > 0 ? Math.round((earned / total) * 100) : 0;
    const passed = percentage >= (quiz.passingScore ?? 0);

    const submission = await QuizSubmission.create({
      quizId: quiz._id,
      studentId: input.studentId,
      answers,
      score: earned,
      totalPoints: total,
      percentage,
      passed,
      submittedAt: new Date(),
    });

    // COMPLETION: this is what finally populates `completedQuizzes`.
    await Enrollment.updateOne(
      { studentId: new Types.ObjectId(input.studentId), courseId: quiz.courseId },
      { $addToSet: { completedQuizzes: quiz._id } }
    );

    await Quiz.updateOne({ _id: quiz._id }, { $inc: { attemptCount: 1 } });

    const student = await User.findById(input.studentId)
      .select("name email")
      .lean();

    return {
      success: true,
      message: passed
        ? "Quiz submitted. You passed."
        : "Quiz submitted. You did not pass this time.",
      data: {
        submissionId: submission._id,
        score: earned,
        totalPoints: total,
        percentage,
        passed,
        passingScore: quiz.passingScore ?? 0,
        results,
        studentName: (student as any)?.name,
        // The explanation is only revealed after the attempt, when the quiz
        // explicitly allows it.
        explanations: quiz.showCorrectAnswers
          ? (quiz.questions || []).map((question: any) => ({
              questionId: question._id?.toString(),
              explanation: question.explanation,
              correctAnswer: question.correctAnswer,
            }))
          : [],
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to submit quiz",
    };
  }
};

/** The student's own attempts for a quiz. */
export const getMyQuizSubmissions = async (
  quizId: string,
  studentId: string
) => {
  try {
    const submissions = await QuizSubmission.find({ quizId, studentId })
      .select("score totalPoints percentage passed submittedAt")
      .sort({ submittedAt: -1 })
      .lean();

    return {
      success: true,
      message: "Submissions retrieved",
      data: submissions,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch submissions",
    };
  }
};
