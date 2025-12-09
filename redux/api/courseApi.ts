import { baseApi } from "./baseApi";

export const courseApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllCourses: build.query({
            query: () => "/course/get-all-courses", // Fixed: matches Postman
            providesTags: ["Course"],
        }),
        getCourseById: build.query({
            query: (id) => `/course/get-single-course/${id}`, // Fixed: matches Postman
            providesTags: (result, error, id) => [{ type: "Course", id }],
        }),
        createCourse: build.mutation({
            query: (data) => ({
                url: "/course/create-course",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Course"],
        }),
        updateCourse: build.mutation({
            query: ({ id, ...data }) => ({
                url: `/course/update-course/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Course"],
        }),
        deleteCourse: build.mutation({
            query: (id) => ({
                url: `/course/delete-course/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Course"],
        }),
        updateCourseStatus: build.mutation({
            query: ({ id, status }) => ({
                url: `/course/update-status/${id}`,
                method: "PATCH",
                body: { status },
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
