/**
 * Remove the answer key from a quiz before sending it to a student.
 *
 * The quiz model stores `questions[].options[].isCorrect`,
 * `questions[].correctAnswer` and `questions[].explanation`. The quiz read
 * endpoints used to return the whole document, so any authenticated user
 * could read the answers before attempting the exam.
 */

export interface QuizOptionLike {
  text?: string;
  imageUrl?: string;
  isCorrect?: boolean;
  [key: string]: any;
}

export interface QuizQuestionLike {
  questionText?: string;
  questionImage?: string;
  questionType?: string;
  options?: QuizOptionLike[];
  correctAnswer?: string;
  points?: number;
  explanation?: string;
  order?: number;
  [key: string]: any;
}

export interface QuizLike {
  questions?: QuizQuestionLike[];
  [key: string]: any;
}

/**
 * Return a copy of the quiz with the answer key stripped.
 *
 * `explanation` is removed as well: it usually spells out the correct
 * answer. `points` is kept - students need to know what a question is worth.
 */
export const sanitizeQuizForStudent = <T extends QuizLike>(quiz: T): T => {
  if (!quiz || !Array.isArray(quiz.questions)) return quiz;

  return {
    ...quiz,
    questions: quiz.questions.map((question) => {
      const { correctAnswer, explanation, options, ...rest } = question;

      return {
        ...rest,
        ...(options
          ? {
              options: options.map(({ isCorrect, ...option }) => option),
            }
          : {}),
      };
    }),
  };
};
