"use client";

// Client-side tracking utility for Meta Pixel & CAPI, TikTok Events API, and Google Ads / GA4

export const getCookie = (name: string): string => {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
  return match ? decodeURIComponent(match[3]) : "";
};

export const setCookie = (name: string, value: string, days = 90) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

// Capture and persist URL click IDs (fbclid, ttclid, gclid) into first-party cookies
export const captureClickIds = () => {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);

    const fbclid = params.get("fbclid");
    if (fbclid) {
      // Format fbc: fb.1.{creation_time}.{fbclid}
      const fbc = `fb.1.${Date.now()}.${fbclid}`;
      setCookie("_fbc", fbc);
    }

    const ttclid = params.get("ttclid");
    if (ttclid) {
      setCookie("ttclid", ttclid);
    }

    const gclid = params.get("gclid");
    if (gclid) {
      setCookie("_gclid", gclid);
    }

    const li_fat_id = params.get("li_fat_id");
    if (li_fat_id) {
      setCookie("li_fat_id", li_fat_id);
    }
  } catch {}
};

// Generate a unique event_id for client + server event deduplication
export const generateEventId = (prefix = "evt"): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
};

interface UserTrackingInfo {
  email?: string;
  phone?: string;
  name?: string;
  userId?: string;
}

interface CustomTrackingInfo {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  [key: string]: any;
}

/**
 * Universal Event Tracker: Fires Client-Side Pixel + Server-Side CAPI with matching event_id
 */
export const trackEvent = async (
  eventName: "Lead" | "Purchase" | "InitiateCheckout" | "CompleteRegistration" | "ViewContent" | "Contact" | string,
  customData?: CustomTrackingInfo,
  userData?: UserTrackingInfo,
  explicitEventId?: string
) => {
  if (typeof window === "undefined") return;

  const eventId = explicitEventId || generateEventId(eventName.toLowerCase());
  const fbp = getCookie("_fbp");
  const fbc = getCookie("_fbc");
  const ttp = getCookie("_ttp");
  const ttclid = getCookie("ttclid");
  const li_fat_id = getCookie("li_fat_id");

  // 1. Client-Side: Meta Pixel (with eventID for deduplication)
  try {
    if ((window as any).fbq) {
      (window as any).fbq("track", eventName, customData || {}, { eventID: eventId });
    }
  } catch {}

  // 2. Client-Side: TikTok Pixel (with event_id for deduplication)
  try {
    if ((window as any).ttq) {
      let ttEvent = eventName;
      if (eventName === "Lead") ttEvent = "SubmitApplication";
      if (eventName === "Purchase") ttEvent = "CompletePayment";
      (window as any).ttq.track(ttEvent, customData || {}, { event_id: eventId });
    }
  } catch {}

  // 3. Client-Side: Google Analytics / Ads (gtag)
  try {
    if ((window as any).gtag) {
      let gaEvent = eventName.toLowerCase();
      if (eventName === "Lead") gaEvent = "generate_lead";
      if (eventName === "Purchase") gaEvent = "purchase";
      if (eventName === "InitiateCheckout") gaEvent = "begin_checkout";
      (window as any).gtag("event", gaEvent, {
        ...(customData || {}),
        transaction_id: eventId,
      });
    }
  } catch {}

  // 4. Client-Side: LinkedIn Insight Tag
  try {
    if ((window as any).lintrk) {
      (window as any).lintrk("track", { conversion_id: customData?.conversion_id });
    }
  } catch {}

  // 5. Server-Side: Dispatch directly to Next.js API route (/api/tracking)
  try {
    fetch("/api/tracking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        eventId,
        eventSourceUrl: window.location.href,
        userData: {
          email: userData?.email,
          phone: userData?.phone,
          firstName: userData?.name?.split(" ")?.[0] || userData?.name,
          lastName: userData?.name?.split(" ")?.slice(1).join(" ") || "",
          userId: userData?.userId,
          fbp,
          fbc,
          ttp,
          ttclid,
          li_fat_id,
        },
        customData,
      }),
    }).catch(() => {});
  } catch {}

  return eventId;
};

// Convenience helpers
export const trackLeadEvent = (lead: {
  name: string;
  email: string;
  phone: string;
  program: string;
  source?: string;
  eventId?: string;
}) => {
  return trackEvent(
    "Lead",
    {
      content_name: lead.program,
      content_category: "Event / Trial Registration",
      source: lead.source || "website",
    },
    {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
    },
    lead.eventId
  );
};

export const trackViewContentEvent = (content: {
  title: string;
  category?: string;
  id?: string;
  price?: number;
}) => {
  return trackEvent("ViewContent", {
    content_name: content.title,
    content_category: content.category || "Course",
    content_ids: content.id ? [content.id] : undefined,
    value: content.price,
    currency: "BDT",
  });
};

export const trackPurchaseEvent = (purchase: {
  orderId: string;
  value: number;
  currency?: string;
  content_name: string;
  content_ids?: string[];
  email?: string;
  phone?: string;
  name?: string;
}) => {
  return trackEvent(
    "Purchase",
    {
      value: purchase.value,
      currency: purchase.currency || "BDT",
      content_name: purchase.content_name,
      content_ids: purchase.content_ids,
      order_id: purchase.orderId,
    },
    {
      email: purchase.email,
      phone: purchase.phone,
      name: purchase.name,
    },
    `order_${purchase.orderId}`
  );
};

export const trackInitiateCheckoutEvent = (course: {
  title: string;
  courseId?: string;
  price?: number;
  currency?: string;
}) => {
  return trackEvent("InitiateCheckout", {
    content_name: course.title,
    content_ids: course.courseId ? [course.courseId] : undefined,
    value: course.price,
    currency: course.currency || "BDT",
  });
};
