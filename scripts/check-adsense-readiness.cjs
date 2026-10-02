/**
 * Internal AdSense-readiness checklist for ToolMyra.
 * Does not claim AdSense approval. Validates honest public-site readiness signals.
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
check("Blog index exists", exists("app/blog/page.tsx"));
check("Blog article route exists", exists("app/blog/[slug]/page.tsx"));
check("404 page exists", exists("app/not-found.tsx"));
check("Contact page absent", !exists("app/contact/page.tsx"));
check("Contact form absent", !exists("components/feedback/ContactForm.tsx"));

const footer = read("components/layout/Footer.tsx");
check("Footer has no Contact link", !/\/contact|label:\s*"Contact"/.test(footer));
check("Footer has Content column", /title="Content"/.test(footer));
check("Footer has Privacy Policy", /Privacy Policy/.test(footer));
check("Footer has Terms of Service", /Terms of Service/.test(footer));

const navbar = read("components/layout/Navbar.tsx");
check("Navbar has Blog", /href:\s*"\/blog"/.test(navbar));
check("Navbar has About", /href:\s*"\/about"/.test(navbar));
check("Navbar has no Contact", !/\/contact|Contact/.test(navbar));

const sitemap = read("app/sitemap.ts");
check("Sitemap excludes /contact", !/\/contact/.test(sitemap));
check("Sitemap includes /about", /\/about/.test(sitemap));
check("Sitemap includes /blog", /\/blog/.test(sitemap));

const robots = read("app/robots.ts");
check("robots.txt source excludes /contact", !/contact/.test(robots));
check("robots.txt disallows /admin", /\/admin/.test(robots));

const privacy = read("app/privacy/page.tsx");
check("Privacy mentions advertising readiness honestly", /Advertising/.test(privacy));
check("Privacy does not invent AdSense approval", !/AdSense Approved|guaranteed AdSense/i.test(privacy));
check(
  "Privacy has no contact email",
  !/support@|mailto:|Contact Us|contact us|Get in Touch/i.test(privacy),
);

const about = read("app/about/page.tsx");
check("About has no contact channel", !/\/contact|Contact Us|support@|Get in Touch/i.test(about));

const terms = read("app/terms/page.tsx");
check("Terms title is Terms of Service", /Terms of Service/.test(terms));
check("Terms has no Contact section", !/heading:\s*"Contact"/.test(terms));

const adsConfig = read("lib/ads/config.ts");
check("Ads config requires real ca-pub ID", /ca-pub-/.test(adsConfig));
check("No hardcoded fake publisher ID", !/ca-pub-\d{10,}/.test(adsConfig));

const consent = read("lib/consent/index.ts");
check("Consent UI gated by env", /NEXT_PUBLIC_CONSENT_UI_ENABLED/.test(consent));

const posts = read("lib/blog/posts.ts");
const slugCount = (posts.match(/slug:\s*"/g) || []).length;
check("Blog has multiple original guides", slugCount >= 6, `found ${slugCount}`);

const failed = checks.filter((item) => !item.ok);
assert.strictEqual(failed.length, 0, `${failed.length} readiness checks failed`);
console.log(`\ncheck-adsense-readiness: ${checks.length} checks passed`);
