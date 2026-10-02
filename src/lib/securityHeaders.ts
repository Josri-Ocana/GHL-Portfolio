/** Enforce safe structural restrictions; observe resource rules before enforcement. */
export function securityHeaders(production: boolean) {
  return [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    {
      key: "Content-Security-Policy",
      value: "base-uri 'self'; object-src 'none'; frame-ancestors 'self'",
    },
    ...(production
      ? [
          {
            key: "Content-Security-Policy-Report-Only",
            value: [
              "default-src 'self'",
              "script-src 'self'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "connect-src 'self'",
              "media-src 'self'",
              "frame-src https://www.loom.com https://www.youtube-nocookie.com https://player.vimeo.com",
              "form-action 'self'",
            ].join("; "),
          },
        ]
      : []),
  ];
}
