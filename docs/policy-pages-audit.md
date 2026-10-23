# Tool Base — Policy Pages Audit

**Date:** 2026-10-23  
**Routes updated:** `/terms`, `/privacy`, `/disclaimer`  
**Not for sitemap or public indexing.**

## Verified implementation details

| Topic | Evidence | Policy treatment |
|---|---|---|
| Domain | `www.toolbaseworld.com` / curated sitemap host | Used consistently |
| Support email | `lib/config/support.ts` → `support@toolbaseworld.com` | Used consistently |
| Contact workflow | `ContactForm` opens Gmail compose; no auto-send | Privacy §4 explains visitor must send |
| Free / no account | Public tools require no login/payment | Terms §4 |
| Tool processing | Registry `processingMode: "browser"` for declared tools | Privacy §3: browser-oriented, with network caveats |
| AdSense | `app/layout.tsx` loads `adsbygoogle.js?client=ca-pub-4195370214127581` | Privacy §6: script is loaded; ads may be served |
| Ad units component | `AdSlot` exists; not mounted widely | Described as script loaded / ads when Google serves |
| Consent UI | Shown only if `NEXT_PUBLIC_CONSENT_UI_ENABLED=true` | Privacy notes CMP not claimed as deployed |
| Analytics provider | Abstraction + `console.debug`; no GA hardwired | Privacy §7 |
| Browser storage | localStorage for notepad, font favorites, optional consent | Privacy §5 |
| Governing law / entity | Not verified in repo | No invented jurisdiction; Terms use qualified liability wording |

## Changes by page

### Terms of Service (`/terms`)
- Full structured Terms with introduction, acceptable use, services, free access, uploads, limitations, IP, third parties (including AdSense), availability, privacy link, warranties/liability (qualified), suspension/changes, contact.
- Effective date: October 23, 2026.
- Cross-links to Privacy and Disclaimer.

### Privacy Policy (`/privacy`)
- Replaced readiness-only advertising language with verified AdSense script disclosure.
- Documented contact Gmail-compose behavior accurately.
- Separated analytics abstraction from AdSense measurement.
- Added Google partner-sites and publisher-policy links.
- Noted EEA/UK/CH CMP requirement as separate work if personalized ads are served there.
- Avoided invented retention periods and “never uploaded” absolutes.

### Disclaimer (`/disclaimer`)
- Expanded tool-family limitations: calculators/finance/academic, conversions, availability, generated docs, security/encoding, ML-assisted features, third parties, responsibility.
- Cross-links to Terms and Privacy.
- Effective date aligned.

## Shared component
- `LegalPage` now supports effective date, multi-paragraph sections, bullets, and rich links via `LegalRichText`.

## Unresolved / owner follow-up
1. Confirm legal entity name and governing law with counsel if jurisdiction-specific Terms are required.
2. If serving personalized ads in EEA/UK/Switzerland, implement a Google-certified CMP; Privacy Policy alone is not sufficient.
3. Hosting-provider log retention cannot be fully verified from front-end source; policy uses qualified wording.
4. Updating these pages does not guarantee AdSense approval.

## Placeholder scan
No visible placeholders such as `[EFFECTIVE DATE]`, `[GOVERNING LAW]`, `TODO`, or similar remain on the three public pages.
