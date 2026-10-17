import { Request, Response } from "express";
import { TrackingSettings } from "../model/trackingSettings.model.js";
import { TrackingService } from "../service/tracking.service.js";

// Public: Get public pixel IDs for browser SDK initialization
export const getPublicConfig = async (_req: Request, res: Response) => {
  try {
    const config = await TrackingService.getConfig();
    return res.status(200).json({
      success: true,
      data: {
        isEnabled: config.isEnabled,
        metaPixelId: config.meta.enabled ? config.meta.pixelId : "",
        tiktokPixelId: config.tiktok.enabled ? config.tiktok.pixelId : "",
        ga4MeasurementId: config.google.enabled ? config.google.ga4MeasurementId : "",
        googleAdsConversionId: config.google.enabled ? config.google.adsConversionId : "",
        linkedinPartnerId: config.linkedin.enabled ? config.linkedin.partnerId : "",
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Get all tracking credentials and settings
export const getAdminConfig = async (_req: Request, res: Response) => {
  try {
    const config = await TrackingService.getConfig();
    return res.status(200).json({
      success: true,
      data: config,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Save or update tracking credentials
export const updateAdminConfig = async (req: Request, res: Response) => {
  try {
    const {
      isEnabled,
      metaEnabled,
      metaPixelId,
      metaAccessToken,
      metaTestEventCode,
      tiktokEnabled,
      tiktokPixelId,
      tiktokAccessToken,
      tiktokTestEventCode,
      googleEnabled,
      ga4MeasurementId,
      ga4ApiSecret,
      googleAdsConversionId,
      googleAdsConversionLabel,
      linkedinEnabled,
      linkedinPartnerId,
      linkedinAccessToken,
      linkedinConversionId,
    } = req.body;

    const settings = await TrackingSettings.findOneAndUpdate(
      { key: "global_tracking" },
      {
        isEnabled: isEnabled !== undefined ? isEnabled : true,
        metaEnabled: metaEnabled !== undefined ? metaEnabled : true,
        metaPixelId: metaPixelId || "",
        metaAccessToken: metaAccessToken || "",
        metaTestEventCode: metaTestEventCode || "",
        tiktokEnabled: tiktokEnabled !== undefined ? tiktokEnabled : true,
        tiktokPixelId: tiktokPixelId || "",
        tiktokAccessToken: tiktokAccessToken || "",
        tiktokTestEventCode: tiktokTestEventCode || "",
        googleEnabled: googleEnabled !== undefined ? googleEnabled : true,
        ga4MeasurementId: ga4MeasurementId || "",
        ga4ApiSecret: ga4ApiSecret || "",
        googleAdsConversionId: googleAdsConversionId || "",
        googleAdsConversionLabel: googleAdsConversionLabel || "",
        linkedinEnabled: linkedinEnabled !== undefined ? linkedinEnabled : true,
        linkedinPartnerId: linkedinPartnerId || "",
        linkedinAccessToken: linkedinAccessToken || "",
        linkedinConversionId: linkedinConversionId || "",
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: "ট্র্যাকিং কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে! | Tracking configuration saved successfully!",
      data: settings,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Public: Receive tracking event from browser for server-side dispatch
export const trackEvent = async (req: Request, res: Response) => {
  try {
    const { eventName, eventId, eventSourceUrl, userData, customData } = req.body || {};

    if (!eventName) {
      return res.status(400).json({ success: false, message: "eventName is required" });
    }

    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const cookies = req.cookies || {};

    const enrichedUserData = {
      ...(userData || {}),
      clientIp: typeof clientIp === "string" ? clientIp.split(",")[0].trim() : undefined,
      userAgent,
      fbp: userData?.fbp || cookies["_fbp"],
      fbc: userData?.fbc || cookies["_fbc"],
      ttp: userData?.ttp || cookies["_ttp"],
    };

    // Dispatch asynchronously
    TrackingService.track({
      eventName,
      eventId,
      eventSourceUrl,
      userData: enrichedUserData,
      customData,
    }).catch(() => {});

    return res.status(200).json({
      success: true,
      message: "Event accepted for server dispatch",
      eventId,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Send test event to verify live connection in Meta & TikTok Events Manager
export const sendTestEvent = async (req: Request, res: Response) => {
  try {
    const { platform = "all", testCode } = req.body || {};
    const config = await TrackingService.getConfig();

    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    const testParams = {
      eventName: "Lead",
      eventId: `test_${Date.now()}`,
      eventSourceUrl: "https://learnandgrow.io/admin/settings",
      userData: {
        email: "test_lead@learnandgrow.io",
        phone: "+8801700000000",
        firstName: "Test",
        lastName: "Lead",
        clientIp: typeof clientIp === "string" ? clientIp.split(",")[0].trim() : "127.0.0.1",
        userAgent,
      },
      customData: {
        content_name: "Test Verification Event",
        value: 100,
        currency: "BDT",
      },
    };

    const results: any = {};

    if (platform === "all" || platform === "meta") {
      const metaConfig = {
        pixelId: config.meta.pixelId,
        accessToken: config.meta.accessToken,
        testEventCode: testCode || config.meta.testEventCode,
      };
      results.meta = await TrackingService.sendMetaCAPI(metaConfig, testParams);
    }

    if (platform === "all" || platform === "tiktok") {
      const tiktokConfig = {
        pixelId: config.tiktok.pixelId,
        accessToken: config.tiktok.accessToken,
        testEventCode: testCode || config.tiktok.testEventCode,
      };
      results.tiktok = await TrackingService.sendTikTokEventsApi(tiktokConfig, testParams);
    }

    if (platform === "all" || platform === "google") {
      results.google = await TrackingService.sendGA4MeasurementProtocol(config.google, testParams);
    }

    if (platform === "all" || platform === "linkedin") {
      results.linkedin = await TrackingService.sendLinkedInCAPI(config.linkedin, testParams);
    }

    return res.status(200).json({
      success: true,
      message: "Test event dispatched",
      results,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
