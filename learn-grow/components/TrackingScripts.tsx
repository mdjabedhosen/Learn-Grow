"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import { captureClickIds, getCookie } from "@/utils/tracking";

interface TrackingConfig {
  isEnabled: boolean;
  metaPixelId?: string;
  tiktokPixelId?: string;
  ga4MeasurementId?: string;
  googleAdsConversionId?: string;
  linkedinPartnerId?: string;
}

export default function TrackingScripts() {
  const [config, setConfig] = useState<TrackingConfig | null>(null);

  useEffect(() => {
    // 1. Capture and save click IDs from URL parameters (fbclid, ttclid, gclid, li_fat_id)
    captureClickIds();

    // 2. Fetch active tracking pixel IDs from backend with env fallback
    const fetchConfig = async () => {
      const envMeta = process.env.NEXT_PUBLIC_META_PIXEL_ID;
      const envTikTok = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
      const envGA4 = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
      const envLinkedIn = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;

      try {
        const baseRaw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";
        const apiUrl = baseRaw.endsWith("/api") ? baseRaw : `${baseRaw.replace(/\/+$/, "")}/api`;

        const res = await fetch(`${apiUrl}/tracking/config`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setConfig({
              ...json.data,
              metaPixelId: json.data.metaPixelId || envMeta,
              tiktokPixelId: json.data.tiktokPixelId || envTikTok,
              ga4MeasurementId: json.data.ga4MeasurementId || envGA4,
              linkedinPartnerId: json.data.linkedinPartnerId || envLinkedIn,
            });
            return;
          }
        }
      } catch {
        // Fallback to public env variables if backend is cold
      }

      setConfig({
        isEnabled: true,
        metaPixelId: envMeta,
        tiktokPixelId: envTikTok,
        ga4MeasurementId: envGA4,
        linkedinPartnerId: envLinkedIn,
      });
    };

    fetchConfig();
  }, []);

  if (!config || !config.isEnabled) return null;

  return (
    <>
      {/* ======================================================== */}
      {/* 1. META / FACEBOOK PIXEL INITIALIZATION                 */}
      {/* ======================================================== */}
      {config.metaPixelId && (
        <>
          <Script
            id="meta-pixel-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${config.metaPixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${config.metaPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* ======================================================== */}
      {/* 2. TIKTOK PIXEL INITIALIZATION                          */}
      {/* ======================================================== */}
      {config.tiktokPixelId && (
        <Script
          id="tiktok-pixel-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(a,c)};
                ttq.load('${config.tiktokPixelId}');
                ttq.page();
              }(window, document, 'ttq');
            `,
          }}
        />
      )}

      {/* ======================================================== */}
      {/* 3. GOOGLE ANALYTICS 4 / ADS (gtag.js)                   */}
      {/* ======================================================== */}
      {config.ga4MeasurementId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${config.ga4MeasurementId}`}
            strategy="afterInteractive"
          />
          <Script
            id="google-analytics-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${config.ga4MeasurementId}', {
                  page_path: window.location.pathname,
                });
                ${
                  config.googleAdsConversionId
                    ? `gtag('config', '${config.googleAdsConversionId}');`
                    : ""
                }
              `,
            }}
          />
        </>
      )}

      {/* ======================================================== */}
      {/* 4. LINKEDIN INSIGHT TAG INITIALIZATION                  */}
      {/* ======================================================== */}
      {config.linkedinPartnerId && (
        <>
          <Script
            id="linkedin-insight-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                _linkedin_partner_id = "${config.linkedinPartnerId}";
                window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
                window._linkedin_data_partner_ids.push(_linkedin_partner_id);
                (function(l) {
                  if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                  window.lintrk.q=[]}
                  var s = document.getElementsByTagName("script")[0];
                  var b = document.createElement("script");
                  b.type = "text/javascript";b.async = true;
                  b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                  s.parentNode.insertBefore(b, s);
                })(window.lintrk);
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt=""
              src={`https://px.ads.linkedin.com/collect/?pid=${config.linkedinPartnerId}&fmt=gif`}
            />
          </noscript>
        </>
      )}
    </>
  );
}
