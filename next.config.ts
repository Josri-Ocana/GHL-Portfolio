import type { NextConfig } from "next";
import { securityHeaders } from "./src/lib/securityHeaders";
const config: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders(process.env.NODE_ENV === "production"),
      },
    ];
  },
};
export default config;
