/* eslint-disable no-console */
/**
 * Production readiness smoke checks (static + optional live server).
 * Run: node scripts/validate-production.cjs
 * Optional: BASE_URL=http://127.0.0.1:3000 node scripts/validate-production.cjs
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");

const ROOT = path.join(__dirname, "..");

function mustExist(rel) {
  const full = path.join(ROOT, rel);
  assert.ok(fs.existsSync(full), `missing required file: ${rel}`);
}

mustExist("app/icon.tsx");
mustExist("app/apple-icon.tsx");
mustExist("app/manifest.ts");
mustExist("app/opengraph-image.tsx");
mustExist("app/robots.ts");
mustExist("app/sitemap.ts");
mustExist("app/not-found.tsx");
mustExist("app/error.tsx");
mustExist("middleware.ts");
mustExist(".env.example");
mustExist("lib/content/homepage-faq.ts");

const site = fs.readFileSync(path.join(ROOT, "lib/config/site.ts"), "utf8");
assert.ok(site.includes('ogImage: "/opengraph-image"'), "ogImage must point to generated opengraph-image");
assert.ok(!site.includes("og-default.png"), "og-default.png reference should be removed");

const privacy = fs.readFileSync(path.join(ROOT, "app/privacy/page.tsx"), "utf8");
assert.ok(!/foundation|draft structure/i.test(privacy), "privacy still looks like draft copy");

const terms = fs.readFileSync(path.join(ROOT, "app/terms/page.tsx"), "utf8");
assert.ok(!/No warranty draft|terms foundation/i.test(terms), "terms still looks like draft copy");

const suggest = fs.readFileSync(path.join(ROOT, "components/feedback/SuggestTool.tsx"), "utf8");
assert.ok(!/Suggestion saved locally/i.test(suggest), "SuggestTool must not claim local save");
assert.ok(suggest.includes("analytics event"), "SuggestTool should describe analytics-only behavior");

const report = fs.readFileSync(path.join(ROOT, "components/feedback/ReportTool.tsx"), "utf8");
assert.ok(!/>Report received</i.test(report), "ReportTool must not claim report received");

const notice = fs.readFileSync(path.join(ROOT, "components/ui/FilePrivacyNotice.tsx"), "utf8");
assert.ok(!/are not uploaded to complete the conversion/i.test(notice), "overstated privacy notice remains");
assert.ok(/On-device processing/i.test(notice), "accurate on-device notice missing");

const page = fs.readFileSync(path.join(ROOT, "app/page.tsx"), "utf8");
assert.ok(page.includes('from "@/lib/content/homepage-faq"'), "homepage FAQ source not shared");
const homeFaq = fs.readFileSync(path.join(ROOT, "components/home/HomeFaqSection.tsx"), "utf8");
assert.ok(homeFaq.includes('from "@/lib/content/homepage-faq"'), "HomeFaqSection FAQ source not shared");

const nextConfig = fs.readFileSync(path.join(ROOT, "next.config.ts"), "utf8");
assert.ok(nextConfig.includes("X-Content-Type-Options"), "security headers missing");

const dangerous = [];
for (const dir of ["app", "components", "lib"]) {
  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(ts|tsx)$/.test(entry.name)) {
        const src = fs.readFileSync(full, "utf8");
        if (/\beval\s*\(/.test(src) || /\bnew\s+Function\s*\(/.test(src)) {
          dangerous.push(full);
        }
      }
    }
  };
  walk(path.join(ROOT, dir));
}
assert.strictEqual(dangerous.length, 0, `eval/Function found: ${dangerous.join(", ")}`);

console.log("validate-production static checks: OK");

const base = process.env.BASE_URL;
if (!base) {
  console.log("validate-production live checks: skipped (set BASE_URL to enable)");
  process.exit(0);
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    lib
      .get(url, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve({ status: res.statusCode || 0, body: data, headers: res.headers }));
      })
      .on("error", reject);
  });
}

(async () => {
  const routes = [
    "/",
    "/tools",
    "/categories",
    "/popular",
    "/new",
    "/blog",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/robots.txt",
    "/sitemap.xml",
    "/manifest.webmanifest",
    "/tools/jpg-to-png",
    "/tools/percentage-calculator",
    "/tools/sha256-hash-generator",
    "/tools/json-formatter",
    "/tools/word-counter",
    "/tools/time-zone-converter",
  ];

  for (const route of routes) {
    const { status, body } = await fetchText(`${base.replace(/\/$/, "")}${route}`);
    assert.ok(status >= 200 && status < 400, `${route} returned ${status}`);
    if (route === "/sitemap.xml") {
      assert.ok(body.includes("<urlset"), "sitemap missing urlset");
      assert.ok(!body.includes("localhost"), "sitemap contains localhost");
      const toolUrls = (body.match(/\/tools\/[a-z0-9-]+/g) || []).length;
      assert.ok(toolUrls >= 200, `sitemap tool urls expected >=200, got ${toolUrls}`);
    }
    if (route === "/robots.txt") {
      assert.ok(/sitemap:/i.test(body), "robots missing sitemap");
      assert.ok(/disallow:\s*\/admin/i.test(body), "robots missing admin disallow");
    }
    if (route.startsWith("/tools/") && route !== "/tools") {
      const h1 = body.match(/<h1[^>]*>([^<]+)/i);
      assert.ok(h1, `${route} missing H1`);
      const h1Count = (body.match(/<h1\b/gi) || []).length;
      assert.strictEqual(h1Count, 1, `${route} should have exactly one H1, got ${h1Count}`);
    }
  }

  const missing = await fetchText(`${base.replace(/\/$/, "")}/this-route-should-404-toolmyra`);
  assert.ok(missing.status === 404, `expected 404, got ${missing.status}`);
  assert.ok(/Page Not Found/i.test(missing.body), "404 page missing H1 copy");

  console.log(`validate-production live checks: OK (${routes.length} routes + 404)`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
