import { Schema, model, Document } from "mongoose";

export interface ITrackingSettings extends Document {
  key: string; // Singleton key e.g. "global_tracking"
  isEnabled: boolean;

  // Meta (Facebook & Instagram)
  metaEnabled: boolean;
  metaPixelId?: string;
  metaAccessToken?: string;
  metaTestEventCode?: string;

  // TikTok
  tiktokEnabled: boolean;
  tiktokPixelId?: string;
  tiktokAccessToken?: string;
  tiktokTestEventCode?: string;

  // Google Analytics 4 & Google Ads
  googleEnabled: boolean;
  ga4MeasurementId?: string;
  ga4ApiSecret?: string;
  googleAdsConversionId?: string;
  googleAdsConversionLabel?: string;

  // LinkedIn Conversions API & Insight Tag
  linkedinEnabled: boolean;
  linkedinPartnerId?: string;
  linkedinAccessToken?: string;
  linkedinConversionId?: string;

  createdAt: Date;
  updatedAt: Date;
}

const trackingSettingsSchema = new Schema<ITrackingSettings>(
  {
    key: { type: String, required: true, unique: true, default: "global_tracking" },
    isEnabled: { type: Boolean, default: true },

    // Meta (Facebook, Instagram & WhatsApp)
    metaEnabled: { type: Boolean, default: true },
    metaPixelId: { type: String, default: "" },
    metaAccessToken: { type: String, default: "" },
    metaTestEventCode: { type: String, default: "" },

    // TikTok
    tiktokEnabled: { type: Boolean, default: true },
    tiktokPixelId: { type: String, default: "" },
    tiktokAccessToken: { type: String, default: "" },
    tiktokTestEventCode: { type: String, default: "" },

    // Google
    googleEnabled: { type: Boolean, default: true },
    ga4MeasurementId: { type: String, default: "" },
    ga4ApiSecret: { type: String, default: "" },
    googleAdsConversionId: { type: String, default: "" },
    googleAdsConversionLabel: { type: String, default: "" },

    // LinkedIn
    linkedinEnabled: { type: Boolean, default: true },
    linkedinPartnerId: { type: String, default: "" },
    linkedinAccessToken: { type: String, default: "" },
    linkedinConversionId: { type: String, default: "" },
  },
  { timestamps: true }
);

export const TrackingSettings = model<ITrackingSettings>(
  "TrackingSettings",
  trackingSettingsSchema
);
