import { baseApi } from "./baseApi";

export const batchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBatchesAdmin: builder.query<any, { courseId?: string; instructorId?: string; status?: string; search?: string } | void>({
      query: (params) => ({
        url: "/batches/admin/all",
        params: params || {},
      }),
      providesTags: ["Batch"],
    }),

    createBatchAdmin: builder.mutation<any, any>({
      query: (body) => ({
        url: "/batches/admin/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Batch"],
    }),

    updateBatchAdmin: builder.mutation<any, { id: string; [key: string]: any }>({
      query: ({ id, ...body }) => ({
        url: `/batches/admin/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Batch"],
    }),

    assignStudentAdmin: builder.mutation<any, { id: string; studentId: string }>({
      query: ({ id, studentId }) => ({
        url: `/batches/admin/${id}/assign-student`,
        method: "POST",
        body: { studentId },
      }),
      invalidatesTags: ["Batch"],
    }),

    removeStudentAdmin: builder.mutation<any, { id: string; studentId: string }>({
      query: ({ id, studentId }) => ({
        url: `/batches/admin/${id}/remove-student/${studentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Batch"],
    }),

    deleteBatchAdmin: builder.mutation<any, string>({
      query: (id) => ({
        url: `/batches/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Batch"],
    }),

    syncBatchesAdmin: builder.mutation<any, void>({
      query: () => ({
        url: "/batches/admin/sync",
        method: "POST",
      }),
      invalidatesTags: ["Batch"],
    }),

    getInstructorBatches: builder.query<any, void>({
      query: () => ({
        url: "/batches/instructor/my-batches",
      }),
      providesTags: ["Batch"],
    }),

    updateInstructorBatch: builder.mutation<any, { id: string; schedule?: string; zoomLink?: string; whatsappGroupUrl?: string; notes?: string }>({
      query: ({ id, ...body }) => ({
        url: `/batches/instructor/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Batch"],
    }),

    getStudentBatch: builder.query<any, string>({
      query: (courseId) => ({
        url: `/batches/student/my-batch/${courseId}`,
      }),
      providesTags: ["Batch"],
    }),
  }),
});

export const {
  useGetAllBatchesAdminQuery,
  useCreateBatchAdminMutation,
  useUpdateBatchAdminMutation,
  useAssignStudentAdminMutation,
  useRemoveStudentAdminMutation,
  useDeleteBatchAdminMutation,
  useSyncBatchesAdminMutation,
  useGetInstructorBatchesQuery,
  useUpdateInstructorBatchMutation,
  useGetStudentBatchQuery,
} = batchApi;
