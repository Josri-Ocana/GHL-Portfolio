import { ImageResponse } from "next/og";
export const alt = "Josri Ocaña — GoHighLevel Automation Specialist & CRM Systems Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#f5f5f2",
        color: "#0a0a0a",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 64,
        justifyContent: "space-between",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22 }}>
        <span>JOSRI OCAÑA</span>
        <span>CRM / AUTOMATION / INTEGRATION</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontWeight: 800,
          fontSize: 90,
          lineHeight: 1,
        }}
      >
        <span>GOOD LEADS.</span>
        <span>BETTER SYSTEMS.</span>
      </div>
      <div style={{ display: "flex", borderTop: "1px solid #aaa", paddingTop: 26, fontSize: 26 }}>
        GoHighLevel Automation Specialist & CRM Systems Builder
      </div>
    </div>,
    size,
  );
}
