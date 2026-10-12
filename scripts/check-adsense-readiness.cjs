/**
 * Internal readiness checklist for Tool Base public pages.
 * Does not claim AdSense approval.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

const checks = [];

function check(label, ok, detail = "") {
  checks.push({ label, ok, detail });
  if (!ok) console.error(`FAIL: ${label}${detail ? ` — ${detail}` : ""}`);
  else console.log(`OK: ${label}`);
}

check("About page exists", exists("app/about/page.tsx"));
check("Privacy page exists", exists("app/privacy/page.tsx"));
check("Terms page exists", exists("app/terms/page.tsx"));
check("Disclaimer page exists", exists("app/disclaimer/page.tsx"));
check("Contact page exists", exists("app/contact/page.tsx"));
check("Blogs hub exists", exists("app/blogs/page.tsx"));
check("Blog article route exists", exists("app/blogs/[slug]/page.tsx"));
check("404 page exists", exists("app/not-found.tsx"));
check("Official Tool Base logo present", exists("public/tb-logo.png"));

const footer = read("components/layout/Footer.tsx");
check("Footer has Contact Us", /\/contact/.test(footer) && /Contact Us/.test(footer));
check("Footer has Blogs", /\/blogs/.test(footer));
check("Footer has Privacy Policy", /Privacy Policy/.test(footer));

const navbar = read("components/layout/Navbar.tsx");
check("Navbar has Blogs", /href:\s*"\/blogs"/.test(navbar));
check("Navbar has Contact Us", /href:\s*"\/contact"/.test(navbar) && /Contact Us/.test(navbar));
check("Navbar has no theme toggle", !/ThemeToggle/.test(navbar));

const curatedSitemap = read("lib/seo/curated-sitemap.ts");
const publicSitemap = read("public/sitemap.xml");
check("Sitemap includes /contact", /\/contact/.test(curatedSitemap));
check("Sitemap includes /blogs", /\/blogs/.test(curatedSitemap));
check("Sitemap is curated (not full registry)", !/getAllTools/.test(curatedSitemap));
check("Sitemap uses production host", /www\.toolbaseworld\.com/.test(curatedSitemap));
check("Public sitemap includes /contact", /\/contact/.test(publicSitemap));
check("Public sitemap uses production host", /www\.toolbaseworld\.com/.test(publicSitemap));

const about = read("app/about/page.tsx");
check("About uses Tool Base", /Tool Base/.test(about));
check("About has no ToolMyra", !/ToolMyra/.test(about));

const terms = read("app/terms/page.tsx");
check("Terms title is Terms of Service", /Terms of Service/.test(terms));

const support = read("lib/config/support.ts");
check("Support email configured", /support@toolbaseworld\.com/.test(support));

const site = read("lib/config/site.ts");
check(
  "Default site URL is toolbaseworld.com",
  /www\.toolbaseworld\.com/.test(site),
);

const slugs = [
  "image-conversion-and-optimization-guide",
  "pdf-tools-guide",
  "video-audio-conversion-guide",
  "developer-and-text-tools-guide",
  "calculators-and-converters-guide",
  "online-file-and-data-tools-guide",
];
for (const slug of slugs) {
  const found = fs
    .readdirSync(path.join(root, "lib/blog/articles"))
    .some((file) => read(`lib/blog/articles/${file}`).includes(`slug: "${slug}"`));
  check(`Article slug ${slug}`, found);
}

const failed = checks.filter((item) => !item.ok);
assert.strictEqual(failed.length, 0, `${failed.length} readiness checks failed`);
console.log(`\ncheck-adsense-readiness: ${checks.length} checks passed`);
