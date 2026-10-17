import crypto from "crypto";
import { TrackingSettings } from "../model/trackingSettings.model.js";

export interface UserTrackingData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string; // Meta browser ID cookie
  fbc?: string; // Meta click ID cookie / fbclid
  ttp?: string; // TikTok browser cookie
  ttclid?: string; // TikTok click ID
  gclid?: string; // Google click ID
  li_fat_id?: string; // LinkedIn first party click/browser ID
  userId?: string;
}

export interface CustomTrackingData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  contents?: Array<{ id: string; quantity: number; item_price?: number; title?: string }>;
  num_items?: number;
  order_id?: string;
  status?: string;
  source?: string;
  [key: string]: any;
}

export interface TrackEventParams {
  eventName: "Lead" | "Purchase" | "InitiateCheckout" | "CompleteRegistration" | "ViewContent" | "Contact" | string;
  eventId?: string; // Shared deduplication ID between browser and server
  eventSourceUrl?: string;
  userData: UserTrackingData;
  customData?: CustomTrackingData;
}

// SHA-256 helper for Meta and TikTok match quality
export const hashSha256 = (value?: string): string | undefined => {
  if (!value) return undefined;
  const clean = value.trim().toLowerCase();
  if (!clean) return undefined;
  return crypto.createHash("sha256").update(clean).digest("hex");
};

// Normalize and hash phone numbers (+880 standard or general digits)
export const hashPhone = (phone?: string): string | undefined => {
  if (!phone) return undefined;
  // Strip spaces, dashes, parentheses
  let digits = phone.replace(/[^0-9]/g, "");
  // Bangladesh standard: 01XXXXXXXXX -> 8801XXXXXXXXX
  if (digits.startsWith("01") && digits.length === 11) {
    digits = "88" + digits;
  }
  return crypto.createHash("sha256").update(digits).digest("hex");
};

export class TrackingService {
  /**
   * Fetch active tracking configuration from DB with fallback to process.env
   */
  public static async getConfig() {
    try {
      const dbSettings = await TrackingSettings.findOne({ key: "global_tracking" }).lean();
      return {
        isEnabled: dbSettings?.isEnabled ?? true,
        meta: {
          enabled: dbSettings?.metaEnabled ?? true,
          pixelId: dbSettings?.metaPixelId || process.env.META_PIXEL_ID || "",
          accessToken: dbSettings?.metaAccessToken || process.env.META_CAPI_ACCESS_TOKEN || "",
          testEventCode: dbSettings?.metaTestEventCode || process.env.META_TEST_EVENT_CODE || "",
        },
        tiktok: {
          enabled: dbSettings?.tiktokEnabled ?? true,
          pixelId: dbSettings?.tiktokPixelId || process.env.TIKTOK_PIXEL_ID || "",
          accessToken: dbSettings?.tiktokAccessToken || process.env.TIKTOK_ACCESS_TOKEN || "",
          testEventCode: dbSettings?.tiktokTestEventCode || process.env.TIKTOK_TEST_EVENT_CODE || "",
        },
        google: {
          enabled: dbSettings?.googleEnabled ?? true,
          ga4MeasurementId: dbSettings?.ga4MeasurementId || process.env.GA4_MEASUREMENT_ID || "",
          ga4ApiSecret: dbSettings?.ga4ApiSecret || process.env.GA4_API_SECRET || "",
          adsConversionId: dbSettings?.googleAdsConversionId || process.env.GOOGLE_ADS_CONVERSION_ID || "",
          adsConversionLabel: dbSettings?.googleAdsConversionLabel || process.env.GOOGLE_ADS_CONVERSION_LABEL || "",
        },
        linkedin: {
          enabled: dbSettings?.linkedinEnabled ?? true,
          partnerId: dbSettings?.linkedinPartnerId || process.env.LINKEDIN_PARTNER_ID || "",
          accessToken: dbSettings?.linkedinAccessToken || process.env.LINKEDIN_ACCESS_TOKEN || "",
          conversionId: dbSettings?.linkedinConversionId || process.env.LINKEDIN_CONVERSION_ID || "",
        },
      };
    } catch {
      return {
        isEnabled: true,
        meta: {
          enabled: true,
          pixelId: process.env.META_PIXEL_ID || "",
          accessToken: process.env.META_CAPI_ACCESS_TOKEN || "",
          testEventCode: process.env.META_TEST_EVENT_CODE || "",
        },
        tiktok: {
          enabled: true,
          pixelId: process.env.TIKTOK_PIXEL_ID || "",
          accessToken: process.env.TIKTOK_ACCESS_TOKEN || "",
          testEventCode: process.env.TIKTOK_TEST_EVENT_CODE || "",
        },
        google: {
          enabled: true,
          ga4MeasurementId: process.env.GA4_MEASUREMENT_ID || "",
          ga4ApiSecret: process.env.GA4_API_SECRET || "",
          adsConversionId: process.env.GOOGLE_ADS_CONVERSION_ID || "",
          adsConversionLabel: process.env.GOOGLE_ADS_CONVERSION_LABEL || "",
        },
        linkedin: {
          enabled: true,
          partnerId: process.env.LINKEDIN_PARTNER_ID || "",
          accessToken: process.env.LINKEDIN_ACCESS_TOKEN || "",
          conversionId: process.env.LINKEDIN_CONVERSION_ID || "",
        },
      };
    }
  }

  /**
   * Dispatch an event to Meta Conversions API (CAPI)
   */
  public static async sendMetaCAPI(
    config: { pixelId: string; accessToken: string; testEventCode?: string },
    params: TrackEventParams
  ) {
    if (!config.pixelId || !config.accessToken) return null;

    const { eventName, eventId, eventSourceUrl, userData, customData } = params;

    const hashedEmail = hashSha256(userData.email);
    const hashedPhone = hashPhone(userData.phone);
    const hashedFn = hashSha256(userData.firstName);
    const hashedLn = hashSha256(userData.lastName);

    const payload: any = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId || `srv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          event_source_url: eventSourceUrl || "https://learnandgrow.io",
          action_source: "website",
          user_data: {
            ...(hashedEmail ? { em: [hashedEmail] } : {}),
            ...(hashedPhone ? { ph: [hashedPhone] } : {}),
            ...(hashedFn ? { fn: [hashedFn] } : {}),
            ...(hashedLn ? { ln: [hashedLn] } : {}),
            ...(userData.clientIp ? { client_ip_address: userData.clientIp } : {}),
            ...(userData.userAgent ? { client_user_agent: userData.userAgent } : {}),
            ...(userData.fbp ? { fbp: userData.fbp } : {}),
            ...(userData.fbc ? { fbc: userData.fbc } : {}),
          },
          ...(customData && Object.keys(customData).length > 0 ? { custom_data: customData } : {}),
        },
      ],
    };

    if (config.testEventCode) {
      payload.test_event_code = config.testEventCode;
    }

    const endpoint = `https://graph.facebook.com/v20.0/${config.pixelId}/events?access_token=${encodeURIComponent(
      config.accessToken
    )}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      return { success: response.ok, result };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Dispatch an event to TikTok Events API
   */
  public static async sendTikTokEventsApi(
    config: { pixelId: string; accessToken: string; testEventCode?: string },
    params: TrackEventParams
  ) {
    if (!config.pixelId || !config.accessToken) return null;

    const { eventName, eventId, eventSourceUrl, userData, customData } = params;

    // Map common event names to TikTok standardized event names
    let tiktokEventName = eventName;
    if (eventName === "Lead") tiktokEventName = "SubmitApplication";
    if (eventName === "Purchase") tiktokEventName = "CompletePayment";
    if (eventName === "InitiateCheckout") tiktokEventName = "InitiateCheckout";
    if (eventName === "CompleteRegistration") tiktokEventName = "CompleteRegistration";
    if (eventName === "ViewContent") tiktokEventName = "ViewContent";

    const hashedEmail = hashSha256(userData.email);
    const hashedPhone = hashPhone(userData.phone);

    const payload: any = {
      event_source: "web",
      event_source_id: config.pixelId,
      data: [
        {
          event: tiktokEventName,
          event_id: eventId || `tt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          event_time: Math.floor(Date.now() / 1000),
          user: {
            ...(hashedEmail ? { email: hashedEmail } : {}),
            ...(hashedPhone ? { phone_number: hashedPhone } : {}),
            ...(userData.ttp ? { ttp: userData.ttp } : {}),
            ...(userData.clientIp ? { ip: userData.clientIp } : {}),
            ...(userData.userAgent ? { user_agent: userData.userAgent } : {}),
          },
          page: {
            url: eventSourceUrl || "https://learnandgrow.io",
          },
          ...(customData && {
            properties: {
              ...(customData.value !== undefined ? { value: customData.value } : {}),
              ...(customData.currency ? { currency: customData.currency } : { currency: "BDT" }),
              ...(customData.content_name ? { content_name: customData.content_name } : {}),
              ...(customData.content_category ? { content_category: customData.content_category } : {}),
              ...(customData.contents ? { contents: customData.contents } : {}),
            },
          }),
        },
      ],
    };

    if (config.testEventCode) {
      payload.test_event_code = config.testEventCode;
    }

    try {
      const response = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Token": config.accessToken,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      return { success: response.ok, result };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Dispatch an event to Google Analytics 4 via Measurement Protocol
   */
  public static async sendGA4MeasurementProtocol(
    config: { ga4MeasurementId: string; ga4ApiSecret: string },
    params: TrackEventParams
  ) {
    if (!config.ga4MeasurementId || !config.ga4ApiSecret) return null;

    const { eventName, userData, customData } = params;

    // Convert event name to GA4 convention (snake_case)
    let ga4EventName = eventName.toLowerCase();
    if (eventName === "Lead") ga4EventName = "generate_lead";
    if (eventName === "Purchase") ga4EventName = "purchase";
    if (eventName === "InitiateCheckout") ga4EventName = "begin_checkout";
    if (eventName === "CompleteRegistration") ga4EventName = "sign_up";

    const hashedEmail = hashSha256(userData.email);
    const hashedPhone = hashPhone(userData.phone);

    const payload: any = {
      client_id: userData.fbp || `ga_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      ...(userData.userId ? { user_id: userData.userId } : {}),
      user_data: {
        ...(hashedEmail ? { sha256_email_address: hashedEmail } : {}),
        ...(hashedPhone ? { sha256_phone_number: hashedPhone } : {}),
      },
      events: [
        {
          name: ga4EventName,
          params: {
            ...(customData || {}),
            engagement_time_msec: 100,
          },
        },
      ],
    };

    const endpoint = `https://www.google-analytics.com/mp/collect?measurement_id=${config.ga4MeasurementId}&api_secret=${config.ga4ApiSecret}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      return { success: response.ok, status: response.status };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Dispatch an event to LinkedIn Conversions API
   */
  public static async sendLinkedInCAPI(
    config: { partnerId: string; accessToken: string; conversionId?: string },
    params: TrackEventParams
  ) {
    if (!config.accessToken || !config.conversionId) return null;

    const { eventName, eventId, eventSourceUrl, userData, customData } = params;
    const hashedEmail = hashSha256(userData.email);

    const conversionUrn = config.conversionId.startsWith("urn:lla:llaPartnerConversion:")
      ? config.conversionId
      : `urn:lla:llaPartnerConversion:${config.conversionId}`;

    const userIds: any[] = [];
    if (hashedEmail) {
      userIds.push({
        idType: "SHA256_EMAIL",
        idValue: hashedEmail,
      });
    }
    if (userData.li_fat_id) {
      userIds.push({
        idType: "LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID",
        idValue: userData.li_fat_id,
      });
    }

    const payload: any = {
      conversion: conversionUrn,
      conversionHappenedAt: Date.now(),
      user: {
        userIds,
        userInfo: {
          ...(userData.firstName ? { firstName: userData.firstName } : {}),
          ...(userData.lastName ? { lastName: userData.lastName } : {}),
        },
      },
      eventId: eventId || `li_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };

    if (customData?.value !== undefined) {
      payload.conversionValue = {
        currencyCode: customData.currency || "BDT",
        amount: String(customData.value),
      };
    }

    try {
      const response = await fetch("https://api.linkedin.com/rest/conversionEvents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.accessToken}`,
          "LinkedIn-Version": "202401",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.text();
      return { success: response.ok, status: response.status, result };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Universal Track Method: Dispatches to all enabled platforms in parallel
   */
  public static async track(params: TrackEventParams) {
    const config = await this.getConfig();
    if (!config.isEnabled) return;

    const promises: Promise<any>[] = [];

    // Meta CAPI (Facebook, Instagram & WhatsApp)
    if (config.meta.enabled && config.meta.pixelId && config.meta.accessToken) {
      promises.push(this.sendMetaCAPI(config.meta, params));
    }

    // TikTok Events API
    if (config.tiktok.enabled && config.tiktok.pixelId && config.tiktok.accessToken) {
      promises.push(this.sendTikTokEventsApi(config.tiktok, params));
    }

    // Google GA4 / Ads
    if (config.google.enabled && config.google.ga4MeasurementId && config.google.ga4ApiSecret) {
      promises.push(this.sendGA4MeasurementProtocol(config.google, params));
    }

    // LinkedIn CAPI
    if (config.linkedin.enabled && config.linkedin.accessToken && config.linkedin.conversionId) {
      promises.push(this.sendLinkedInCAPI(config.linkedin, params));
    }

    // Run all tracking asynchronously without ever blocking the HTTP response
    Promise.allSettled(promises).catch(() => {});
  }

  /**
   * Dedicated helper for Free Trial Booking (Lead)
   */
  public static async trackLead(booking: {
    name: string;
    email: string;
    phone: string;
    trackInterest: string;
    source?: string;
    eventId?: string;
    req?: any;
  }) {
    const clientIp = booking.req?.headers?.["x-forwarded-for"] || booking.req?.socket?.remoteAddress;
    const userAgent = booking.req?.headers?.["user-agent"];
    const cookies = booking.req?.cookies || {};

    return this.track({
      eventName: "Lead",
      eventId: booking.eventId || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      eventSourceUrl: "https://learnandgrow.io/free-trial",
      userData: {
        email: booking.email,
        phone: booking.phone,
        firstName: booking.name?.split(" ")?.[0] || booking.name,
        lastName: booking.name?.split(" ")?.slice(1).join(" ") || "",
        clientIp: typeof clientIp === "string" ? clientIp.split(",")[0].trim() : undefined,
        userAgent,
        fbp: cookies["_fbp"] || booking.req?.body?.fbp,
        fbc: cookies["_fbc"] || booking.req?.body?.fbc,
        ttp: cookies["_ttp"] || booking.req?.body?.ttp,
        ttclid: booking.req?.body?.ttclid,
        li_fat_id: cookies["li_fat_id"] || booking.req?.body?.li_fat_id,
      },
      customData: {
        content_name: booking.trackInterest,
        content_category: "Free Trial Class",
        status: "pending",
        source: booking.source || "website",
      },
    });
  }

  /**
   * Dedicated helper for Course / Batch Purchase
   */
  public static async trackPurchase(order: {
    orderId: string;
    totalAmount: number;
    currency?: string;
    courseName?: string;
    courseId?: string;
    userEmail?: string;
    userPhone?: string;
    userName?: string;
    userId?: string;
    eventId?: string;
    req?: any;
  }) {
    const clientIp = order.req?.headers?.["x-forwarded-for"] || order.req?.socket?.remoteAddress;
    const userAgent = order.req?.headers?.["user-agent"];
    const cookies = order.req?.cookies || {};

    return this.track({
      eventName: "Purchase",
      eventId: order.eventId || `order_${order.orderId}`,
      eventSourceUrl: "https://learnandgrow.io/checkout/success",
      userData: {
        email: order.userEmail,
        phone: order.userPhone,
        firstName: order.userName?.split(" ")?.[0] || order.userName,
        lastName: order.userName?.split(" ")?.slice(1).join(" ") || "",
        userId: order.userId,
        clientIp: typeof clientIp === "string" ? clientIp.split(",")[0].trim() : undefined,
        userAgent,
        fbp: cookies["_fbp"] || order.req?.body?.fbp,
        fbc: cookies["_fbc"] || order.req?.body?.fbc,
        ttp: cookies["_ttp"] || order.req?.body?.ttp,
        li_fat_id: cookies["li_fat_id"] || order.req?.body?.li_fat_id,
      },
      customData: {
        value: order.totalAmount,
        currency: order.currency || "BDT",
        order_id: order.orderId,
        content_name: order.courseName,
        content_ids: order.courseId ? [order.courseId] : undefined,
      },
    });
  }
}
