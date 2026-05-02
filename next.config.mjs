/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * HTTP Security Headers
   * 
   * Implements industry-standard security headers to protect against
   * common web vulnerabilities (XSS, clickjacking, MIME sniffing, etc.).
   * These headers are applied to all routes.
   */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://translate.google.com https://translate.googleapis.com https://*.firebaseio.com https://*.googleapis.com https://apis.google.com",
              "style-src 'self' 'unsafe-inline' https://translate.googleapis.com https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com https://www.transparenttextures.com https://translate.google.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://*.firebase.google.com https://*.firebaseio.com https://*.googleapis.com https://generativelanguage.googleapis.com https://translate.google.com wss://*.firebaseio.com https://firebase.googleapis.com https://www.google-analytics.com",
              "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com https://translate.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
