/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "standalone",
  trailingSlash: true,

  typescript: {
    // SECURITY/CI: type errors must FAIL the build. With this set to true the
    // build shipped every type error silently - which is how 140 type errors
    // (including the Next 16 `params` Promise breakage) reached production.
    ignoreBuildErrors: false,
  },
  
  // Turbopack is enabled by default in Next.js 16
  turbopack: {
    root: __dirname,
  },

  serverExternalPackages: ["jsdom", "isomorphic-dompurify"],

  // SECURITY: the backend (Express) sets its own security headers, but the
  // frontend HTML was served with none - no HSTS, no CSP, no clickjacking
  // protection - and leaked "X-Powered-By: Next.js".
  // nginx proxies / to this Next.js server, so headers() here are what the
  // browser actually receives in production.
  async headers() {
    const csp = [
      "default-src 'self'",
      // Next.js injects inline bootstrap scripts; 'unsafe-inline' is required
      // for those unless every script is given a nonce.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net https://analytics.google.com https://www.googletagmanager.com https://business-api.tiktok.com https://snap.licdn.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' blob: https:",
      "connect-src 'self' https: http://localhost:5005 wss:",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");

    const securityHeaders = [
      { key: "Content-Security-Policy", value: csp },
      { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "geolocation=(), microphone=(), camera=(), payment=()",
      },
      { key: "X-DNS-Prefetch-Control", value: "on" },
    ];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  poweredByHeader: false,

  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "i.postimg.cc",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "learn-grow-bd.vercel.app",
        port: "",
        pathname: "**",
      },
      // drive images
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "**",
      },
      // aws s3
      {
        protocol: "https",
        hostname: "learn-grow-bd.s3.ap-southeast-1.amazonaws.com",
        port: "",
        pathname: "**",
      },
      // most popular image cdn and host faceboom insta linked and all
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "**",
      },

    ],
  },
};

module.exports = nextConfig;
