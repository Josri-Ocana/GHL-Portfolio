import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JsonLd } from "../src/components/seo/JsonLd";
import { safeExternalUrl, videoEmbedUrl, videoFileUrl } from "../src/lib/media";
import { siteOrigin } from "../src/lib/siteOrigin";
import { securityHeaders } from "../src/lib/securityHeaders";

test("external URLs reject plaintext transport, credentials and executable schemes", () => {
  for (const url of [
    "http://example.com",
    "https://user:password@example.com",
    "javascript:alert(1)",
    "data:text/html,test",
    "//example.com",
  ]) {
    assert.equal(safeExternalUrl(url), undefined);
  }
  assert.equal(safeExternalUrl("https://example.com/project"), "https://example.com/project");
  for (const url of [
    "https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ",
    "https://user@youtube.com/watch?v=dQw4w9WgXcQ",
  ]) {
    assert.equal(videoEmbedUrl({ provider: "youtube", url, title: "Test" }), undefined);
  }
});

test("local videos cannot escape the media directory or use ambiguous path separators", () => {
  assert.equal(videoFileUrl("/media/demo.mp4"), "/media/demo.mp4");
  assert.equal(videoFileUrl("https://example.com/demo.mp4"), "https://example.com/demo.mp4");
  for (const path of [
    "/media/../private.mp4",
    "/media/%2e%2e/private.mp4",
    "/media/%2fprivate.mp4",
    "/media/\\private.mp4",
    "//example.com/demo.mp4",
    "/media/script.html",
  ]) {
    assert.equal(videoFileUrl(path), undefined);
  }
});

test("public site metadata rejects credential-bearing and non-HTTPS production origins", () => {
  assert.equal(siteOrigin(undefined), "http://localhost:3000");
  assert.equal(siteOrigin("https://example.com/path"), "https://example.com");
  assert.equal(siteOrigin("http://localhost:3000"), "http://localhost:3000");
  for (const url of [
    "http://example.com",
    "https://user:password@example.com",
    "javascript:alert(1)",
  ])
    assert.throws(() => siteOrigin(url));
});

test("JSON-LD escapes script termination instead of executing supplied markup", () => {
  const html = renderToStaticMarkup(
    createElement(JsonLd, { data: { name: '</script><script>alert("test")</script>' } }),
  );
  assert.equal((html.match(/<script/g) || []).length, 1);
  assert.ok(html.includes("\\u003c/script>"));
  assert.ok(!html.includes("<script>alert"));
});

test("headers enforce structural protection while resource CSP remains production report-only", () => {
  const headers = Object.fromEntries(securityHeaders(true).map(({ key, value }) => [key, value]));
  assert.equal(headers["X-Content-Type-Options"], "nosniff");
  assert.match(headers["Content-Security-Policy"], /frame-ancestors 'self'/);
  assert.match(headers["Content-Security-Policy"], /object-src 'none'/);
  assert.match(headers["Content-Security-Policy-Report-Only"], /script-src 'self';/);
  assert.ok(!headers["Content-Security-Policy-Report-Only"].includes("unsafe-eval"));
  assert.ok(
    !securityHeaders(false).some(({ key }) => key === "Content-Security-Policy-Report-Only"),
  );
});
