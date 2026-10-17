import { baseApi } from "./baseApi";

export const trialBookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrialBookings: builder.query<
      { success: boolean; count: number; data: any[] },
      { status?: string; search?: string; instructorId?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.status && params.status !== "all") {
          queryParams.set("status", params.status);
        }
        if (params?.search) {
          queryParams.set("search", params.search);
        }
        if (params?.instructorId) {
          queryParams.set("instructorId", params.instructorId);
        }
        const qs = queryParams.toString();
        return {
          url: `/trial-booking${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["TrialBooking"],
    }),

    createTrialBooking: builder.mutation<
      { success: boolean; message: string; data: any },
      {
        parentName: string;
        parentPhone: string;
        parentEmail: string;
        studentAge: string;
        trackInterest: string;
        source?: string;
      }
    >({
      query: (body) => ({
        url: "/trial-booking",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TrialBooking"],
    }),

    updateTrialBooking: builder.mutation<
      { success: boolean; message: string; data: any },
      {
        id: string;
        status?: "pending" | "contacted" | "scheduled" | "completed" | "cancelled";
        notes?: string;
        isRead?: boolean;
        assignedInstructorId?: string | null;
        scheduledDate?: string;
        scheduledTime?: string;
        meetingLink?: string;
        assignedBatchId?: string | null;
        assignedBatchName?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/trial-booking/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["TrialBooking"],
    }),

    deleteTrialBooking: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/trial-booking/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TrialBooking"],
    }),
  }),
});

export const {
  useGetTrialBookingsQuery,
  useCreateTrialBookingMutation,
  useUpdateTrialBookingMutation,
  useDeleteTrialBookingMutation,
} = trialBookingApi;
