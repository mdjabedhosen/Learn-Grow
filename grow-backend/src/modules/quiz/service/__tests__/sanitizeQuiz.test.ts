/**
 * Tests for the quiz answer-key sanitizer (audit H-3).
 *
 * The quiz read endpoints returned the whole document, so any authenticated
 * user could read `questions[].options[].isCorrect`,
 * `questions[].correctAnswer` and `questions[].explanation` before an exam.
 *
 * Run with:
 *   cd grow-backend && node --import tsx --test src/modules/quiz/service/__tests__/sanitizeQuiz.test.ts
 */
import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { sanitizeQuizForStudent } from "../sanitizeQuiz";

const quiz = {
  _id: "quiz-1",
  title: "Module 1 Quiz",
  passingScore: 60,
  showCorrectAnswers: true,
  questions: [
    {
      _id: "q1",
      questionText: "What is 2 + 2?",
      questionType: "multiple-choice",
      points: 5,
      order: 1,
      options: [
        { text: "4", isCorrect: true, _id: "o1" },
        { text: "5", isCorrect: false, _id: "o2" },
      ],
      correctAnswer: "4",
      explanation: "Because 2 plus 2 equals 4",
    },
    {
      _id: "q2",
      questionText: "The sky is blue.",
      questionType: "true-false",
      points: 5,
      order: 2,
      options: [],
      correctAnswer: "true",
      explanation: "Short wavelength light scatters more",
    },
  ],
};

describe("sanitizeQuizForStudent", () => {
  test("removes isCorrect from every option", () => {
    const sanitized = sanitizeQuizForStudent(quiz);
    const option = sanitized.questions[0].options![0];

    assert.equal("isCorrect" in option, false);
    assert.equal(option.text, "4");
  });

  test("removes correctAnswer from every question", () => {
    const sanitized = sanitizeQuizForStudent(quiz);

    for (const question of sanitized.questions) {
      assert.equal("correctAnswer" in question, false);
    }
  });

  test("removes the explanation", () => {
    const sanitized = sanitizeQuizForStudent(quiz);

    for (const question of sanitized.questions) {
      assert.equal("explanation" in question, false);
    }
  });

  test("keeps the question text, points and order", () => {
    const sanitized = sanitizeQuizForStudent(quiz);
    const question = sanitized.questions[0];

    assert.equal(question.questionText, "What is 2 + 2?");
    assert.equal(question.points, 5);
    assert.equal(question.order, 1);
  });

  test("keeps the quiz-level metadata", () => {
    const sanitized = sanitizeQuizForStudent(quiz);

    assert.equal(sanitized.title, "Module 1 Quiz");
    assert.equal(sanitized.passingScore, 60);
  });

  test("does not mutate the original quiz", () => {
    sanitizeQuizForStudent(quiz);

    assert.equal(quiz.questions[0].options![0].isCorrect, true);
    assert.equal(quiz.questions[0].correctAnswer, "4");
    assert.equal(quiz.questions[0].explanation, "Because 2 plus 2 equals 4");
  });

  test("handles a quiz without questions", () => {
    const sanitized = sanitizeQuizForStudent({ title: "Empty" } as any);

    assert.equal(sanitized.title, "Empty");
  });
});
