import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { API_CONFIG } from "@/config/apiConfig";

export const quizApi = createApi({
    reducerPath: "quizApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_CONFIG.ORIGIN}/api/quiz`,
        prepareHeaders: (headers) => {
            const tokenFromCookie = Cookies.get("accessToken");
            const tokenFromStorage = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const token = tokenFromCookie || tokenFromStorage;

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Quizzes"],
    endpoints: (builder) => ({
        // Create quiz
        createQuiz: builder.mutation({
            query: (quizData) => ({
                url: "/create",
                method: "POST",
                body: quizData,
            }),
            invalidatesTags: ["Quizzes"],
        }),

        // Get quizzes by course
        getQuizzesByCourse: builder.query({
            query: (courseId: string) => ({
                url: `/course/${courseId}`,
                method: "GET",
            }),
            providesTags: ["Quizzes"],
        }),

        // Get quiz by ID
        getQuizById: builder.query({
            query: (id: string) => ({
                url: `/${id}`,
                method: "GET",
            }),
            providesTags: ["Quizzes"],
        }),

        // Update quiz
        updateQuiz: builder.mutation({
            query: ({ id, ...quizData }) => ({
                url: `/${id}`,
                method: "PATCH",
                body: quizData,
            }),
            invalidatesTags: ["Quizzes"],
        }),

        // Publish quiz
        publishQuiz: builder.mutation({
            query: ({ id, status }) => ({
                url: `/${id}/publish`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Quizzes"],
        }),

        // Delete quiz
        deleteQuiz: builder.mutation({
            query: (id: string) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Quizzes"],
        }),

        /**
         * Submit a quiz attempt.
         *
         * The quiz used to be scored entirely in the browser, so the student
         * chose their own score and the server never learned that the quiz
         * was completed. Grading now happens on the server against the stored
         * answer key.
         */
        submitQuiz: builder.mutation({
            query: ({ id, answers }: { id: string; answers: Record<string, string | number> }) => ({
                url: `/${id}/submit`,
                method: "POST",
                body: { answers },
            }),
            // NOTE: deliberately no tag invalidation. Submitting an attempt
            // does not change the quiz definition, and refetching it made the
            // "you have already taken this quiz" effect re-run and announce a
            // previous attempt for the attempt the student had just made.
        }),

        // The student's own attempts for a quiz
        getMyQuizSubmissions: builder.query({
            query: (id: string) => `/${id}/my-submissions`,
            transformResponse: (response: any) => response?.data ?? response,
        }),
    }),
});

export const {
    useCreateQuizMutation,
    useGetQuizzesByCourseQuery,
    useGetQuizByIdQuery,
    useUpdateQuizMutation,
    usePublishQuizMutation,
    useDeleteQuizMutation,
    useSubmitQuizMutation,
    useGetMyQuizSubmissionsQuery,
} = quizApi;
