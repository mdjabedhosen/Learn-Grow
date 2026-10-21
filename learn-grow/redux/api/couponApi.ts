import { baseApi } from "./baseApi";

export const couponApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    validateCoupon: build.mutation({
      query: (data: { code: string; orderAmount: number; courseId?: string }) => ({
        url: "/coupon/validate",
        method: "POST",
        body: data,
      }),
    }),
    getAllCoupons: build.query({
      query: (params?: { search?: string; isActive?: boolean }) => ({
        url: "/coupon",
        method: "GET",
        params,
      }),
      providesTags: ["Coupon" as any],
    }),
    getCouponById: build.query({
      query: (id: string) => ({
        url: `/coupon/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Coupon" as any, id }],
    }),
    createCoupon: build.mutation({
      query: (data: any) => ({
        url: "/coupon",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coupon" as any],
    }),
    updateCoupon: build.mutation({
      query: ({ id, ...data }: { id: string; [key: string]: any }) => ({
        url: `/coupon/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Coupon" as any],
    }),
    deleteCoupon: build.mutation({
      query: (id: string) => ({
        url: `/coupon/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupon" as any],
    }),
  }),
});

export const {
  useValidateCouponMutation,
  useGetAllCouponsQuery,
  useGetCouponByIdQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
