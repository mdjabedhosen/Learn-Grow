import { baseApi } from "./baseApi";

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
  isActive: boolean;
  source?: string;
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCommission: build.query<{ success: boolean; data?: { platformCommissionPercent: number; instructorPayoutPercent: number; kitPrice?: number } }, void>({
      query: () => ({ url: "/settings/commission", method: "GET" }),
      providesTags: ["SiteContent"],
    }),
    updateCommission: build.mutation<{ success: boolean; data?: { platformCommissionPercent: number; instructorPayoutPercent: number; kitPrice?: number } }, { platformCommissionPercent: number; kitPrice?: number }>({
      query: (body) => ({ url: "/settings/commission", method: "PATCH", body }),
      invalidatesTags: ["SiteContent"],
    }),

    // SMTP settings
    getSMTPConfig: build.query<{ success: boolean; data?: SMTPConfig; message?: string }, void>({
      query: () => ({ url: "/settings/smtp", method: "GET" }),
      providesTags: ["Settings"],
    }),
    updateSMTPConfig: build.mutation<
      { success: boolean; data?: SMTPConfig; message?: string },
      { host: string; port: number; secure: boolean; user: string; password?: string; fromName: string; fromEmail: string; replyTo?: string }
    >({
      query: (body) => ({ url: "/settings/smtp", method: "PUT", body }),
      invalidatesTags: ["Settings"],
    }),
    testSMTPConnection: build.mutation<{ success: boolean; message: string }, { testEmail?: string }>({
      query: (body) => ({ url: "/settings/smtp/test", method: "POST", body }),
    }),

    // Database backup - returns void, handles download directly
    backupDatabase: build.mutation<{ success: boolean }, void>({
      query: () => ({ 
        url: "/settings/backup/database", 
        method: "POST",
      }),
    }),

    // Server-Side Tracking & Conversions API (Meta, TikTok, Google Ads)
    getTrackingConfig: build.query<{ success: boolean; data?: any; message?: string }, void>({
      query: () => ({ url: "/tracking/admin/config", method: "GET" }),
      providesTags: ["Settings"],
    }),
    updateTrackingConfig: build.mutation<{ success: boolean; message?: string; data?: any }, any>({
      query: (body) => ({ url: "/tracking/admin/config", method: "PUT", body }),
      invalidatesTags: ["Settings"],
    }),
    testTrackingEvent: build.mutation<{ success: boolean; message: string; results?: any }, { platform?: string; testCode?: string }>({
      query: (body) => ({ url: "/tracking/test", method: "POST", body }),
    }),
  }),
});

export const {
  useGetCommissionQuery,
  useUpdateCommissionMutation,
  useGetSMTPConfigQuery,
  useUpdateSMTPConfigMutation,
  useTestSMTPConnectionMutation,
  useBackupDatabaseMutation,
  useGetTrackingConfigQuery,
  useUpdateTrackingConfigMutation,
  useTestTrackingEventMutation,
} = settingsApi;
