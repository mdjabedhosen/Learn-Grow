import { baseApi } from "./baseApi";

export const courseApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllCourses: build.query({
            query: () => "/courses",
            providesTags: ["Course"],
        }),
        getCourseById: build.query({
            query: (id) => `/courses/${id}`,
            providesTags: (result, error, id) => [{ type: "Course", id }],
        }),
        createCourse: build.mutation({
            query: (data) => ({
                url: "/courses",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Course"],
        }),
        updateCourse: build.mutation({
            query: ({ id, ...data }) => ({
                url: `/courses/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Course"],
        }),
        deleteCourse: build.mutation({
            query: (id) => ({
                url: `/courses/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Course"],
        }),
    }),
});

export const {
    useGetAllCoursesQuery,
    useGetCourseByIdQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
    useUpdateCourseStatusMutation,
} = courseApi;
