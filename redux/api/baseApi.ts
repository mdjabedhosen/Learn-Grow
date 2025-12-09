import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://learnandgrow-five.vercel.app/api/v1",
        prepareHeaders: (headers) => {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("token");
                if (token) {
                    // Add Bearer prefix for proper JWT format
                    headers.set("authorization", `Bearer ${token}`);
                }
            }
            return headers;
        },
    }),
    tagTypes: ["User", "Course", "Category"],
    endpoints: () => ({}),
});
