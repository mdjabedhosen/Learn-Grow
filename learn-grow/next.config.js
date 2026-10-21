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
