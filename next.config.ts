import withBundleAnalyzer from "@next/bundle-analyzer"

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

const ContentSecurityPolicy = `
    default-src 'self' vercel.live;
    script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.vercel-insights.com vercel.live va.vercel-scripts.com upload-widget.cloudinary.com firestore.googleapis.com;
    script-src-elem 'self' 'unsafe-inline' cdn.vercel-insights.com vercel.live va.vercel-scripts.com;
    worker-src 'self' blob: data:;
    child-src 'self' blob: data:;
    style-src 'self' 'unsafe-inline';
    img-src * blob: data:;
    media-src 'none';
    connect-src 'self' blob: data: firestore.googleapis.com firebasestorage.googleapis.com;
    font-src 'self' data: https://fonts.gstatic.com;
    frame-src 'self' blob: data: *.codesandbox.io vercel.live upload-widget.cloudinary.com;
    base-uri 'self';
    form-action 'self';
    object-src 'self' blob: data:;
    frame-ancestors 'none'
`
  .replace(/\s{2,}/g, " ")
  .trim()

const allowedOrigins = [
  process.env.NEXT_PUBLIC_BASE_URL,
  "http://localhost:5328",
  "http://localhost:8000",
].filter(Boolean)

export const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy,
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
]

/** @type {import('next').NextConfig} */
const nextConfig: import("next").NextConfig = {
  bundlePagesRouterDependencies: true,
  reactStrictMode: true,
  experimental: {
    reactCompiler: true,
    staleTimes: {
      dynamic: 0,
      static: 180,
    },
  },
  serverExternalPackages: [ '@react-pdf/renderer' ],
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    }

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        canvas: false,
      }
    }

    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    })

    return config
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [ "@svgr/webpack" ],
        as: "*.js",
      },
    },
    resolveAlias: {
      underscore: "lodash",
      mocha: { browser: "mocha/browser-entry.js" },
    },
    resolveExtensions: [
      ".mdx",
      ".tsx",
      ".ts",
      ".jsx",
      ".js",
      ".mjs",
      ".json",
      ".jsonc",
    ],
  },
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        ...securityHeaders,
        {
          key: "Access-Control-Allow-Origin",
          value: allowedOrigins.join(", "),
        },
        {
          key: "Access-Control-Allow-Methods",
          value: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
        },
        {
          key: "Access-Control-Allow-Headers",
          value: "Content-Type, Authorization",
        },
        {
          key: "Access-Control-Allow-Headers",
          value: "Content-Type, Authorization, X-App-API-Key",
        },
      ],
    },
  ],
  images: {
    formats: [ "image/avif", "image/webp" ],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "ik.imagekit.io" },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default withBundleAnalyzerConfig(nextConfig)
