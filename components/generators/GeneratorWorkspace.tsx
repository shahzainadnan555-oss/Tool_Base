"use client";

import { useId, useMemo, useState } from "react";
import {
  buildUtmUrl,
  generateBlogTitles,
  generateBorderRadius,
  generateBoxShadow,
  generateBusinessNames,
  generateClamp,
  generateCron,
  generateCssGradient,
  generateCsvTest,
  generateGitignore,
  generateHashtags,
  generateHtmlBoilerplate,
  generateJsonMock,
  generateMetaTags,
  generateOpenGraph,
  generatePalette,
  generateRobotsTxt,
  generateSitemapXml,
  generateUrlSlug,
  generateUsernames,
  type GeneratorResult,
  type GeneratorToolConfig,
} from "@/lib/generators";
import { copyText, downloadTextFile } from "@/lib/security/utils";

interface Props {
  config: GeneratorToolConfig;
  convertHeading?: string;
}

type FieldRow = { name: string; type: string };

const GITIGNORE_OPTIONS = [
  ["node", "Node.js"],
  ["react", "React"],
  ["nextjs", "Next.js"],
  ["python", "Python"],
  ["java", "Java"],
  ["php", "PHP"],
  ["go", "Go"],
  ["rust", "Rust"],
  ["android", "Android"],
  ["macos", "macOS"],
  ["windows", "Windows"],
] as const;

function Field({
  id,
  label,
  children,
}: {
  id?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-tm-text">
        {label}
      </label>
      {children}
    </div>
  );
}

export function GeneratorWorkspace({ config, convertHeading }: Props) {
  const id = useId();
  const [result, setResult] = useState<GeneratorResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [usernameStyle, setUsernameStyle] = useState("adj-noun");
  const [usernameLen, setUsernameLen] = useState("10");
  const [usernameNumbers, setUsernameNumbers] = useState(true);
  const [usernameUnderscore, setUsernameUnderscore] = useState(false);
  const [usernameSep, setUsernameSep] = useState("none");
  const [usernameQty, setUsernameQty] = useState("10");

  const [bizIndustry, setBizIndustry] = useState("software");
  const [bizKeyword, setBizKeyword] = useState("nova");
  const [bizStyle, setBizStyle] = useState("modern");
  const [bizLen, setBizLen] = useState("18");
  const [bizPrefix, setBizPrefix] = useState("");
  const [bizSuffix, setBizSuffix] = useState("");
  const [bizQty, setBizQty] = useState("10");

  const [blogTopic, setBlogTopic] = useState("improve focus");
  const [blogKeyword, setBlogKeyword] = useState("productivity");
  const [blogAudience, setBlogAudience] = useState("remote workers");
  const [blogTone, setBlogTone] = useState("practical");
  const [blogQty, setBlogQty] = useState("8");

  const [hashTopic, setHashTopic] = useState("gardening");
  const [hashPlatform, setHashPlatform] = useState("general");
  const [hashQty, setHashQty] = useState("12");
  const [hashMode, setHashMode] = useState("broad");

  const [slugText, setSlugText] = useState("The Best Online Image Tools in 2026!");
  const [slugSep, setSlugSep] = useState("dash");
  const [slugStop, setSlugStop] = useState(false);
  const [slugMax, setSlugMax] = useState("80");

  const [utmBase, setUtmBase] = useState("https://example.com/landing");
  const [utmSource, setUtmSource] = useState("google");
  const [utmMedium, setUtmMedium] = useState("cpc");
  const [utmCampaign, setUtmCampaign] = useState("spring");
  const [utmTerm, setUtmTerm] = useState("");
  const [utmContent, setUtmContent] = useState("");

  const [paletteSize, setPaletteSize] = useState("5");
  const [paletteColors, setPaletteColors] = useState<string[]>([]);
  const [locked, setLocked] = useState<boolean[]>([]);

  const [gradType, setGradType] = useState("linear");
  const [gradAngle, setGradAngle] = useState("90");
  const [gradPos, setGradPos] = useState("center");
  const [gradC1, setGradC1] = useState("#0f766e");
  const [gradC2, setGradC2] = useState("#38bdf8");
  const [gradC3, setGradC3] = useState("#fbbf24");
  const [gradThird, setGradThird] = useState(false);

  const [shadowX, setShadowX] = useState("0");
  const [shadowY, setShadowY] = useState("8");
  const [shadowBlur, setShadowBlur] = useState("24");
  const [shadowSpread, setShadowSpread] = useState("0");
  const [shadowColor, setShadowColor] = useState("#0f172a");
  const [shadowOpacity, setShadowOpacity] = useState("0.25");
  const [shadowInset, setShadowInset] = useState(false);

  const [radiusLinked, setRadiusLinked] = useState(true);
  const [tl, setTl] = useState("16");
  const [tr, setTr] = useState("16");
  const [br, setBr] = useState("16");
  const [bl, setBl] = useState("16");

  const [clampProp, setClampProp] = useState("font-size");
  const [clampMin, setClampMin] = useState("1");
  const [clampPref, setClampPref] = useState("2");
  const [clampMax, setClampMax] = useState("2");
  const [clampUnit, setClampUnit] = useState("rem");

  const [htmlLang, setHtmlLang] = useState("en");
  const [htmlTitle, setHtmlTitle] = useState("My Page");
  const [htmlDesc, setHtmlDesc] = useState("A short description");
  const [htmlCss, setHtmlCss] = useState("/styles.css");
  const [htmlJs, setHtmlJs] = useState("");
  const [htmlFavicon, setHtmlFavicon] = useState("/favicon.ico");

  const [metaTitle, setMetaTitle] = useState("Page Title");
  const [metaDesc, setMetaDesc] = useState("Helpful page description for search snippets.");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [metaAuthor, setMetaAuthor] = useState("");
  const [metaRobots, setMetaRobots] = useState("index, follow");
  const [metaCanonical, setMetaCanonical] = useState("https://example.com/page");

  const [ogTitle, setOgTitle] = useState("Share Title");
  const [ogDesc, setOgDesc] = useState("Share description");
  const [ogUrl, setOgUrl] = useState("https://example.com/page");
  const [ogImage, setOgImage] = useState("https://example.com/og.png");
  const [ogSite, setOgSite] = useState("Example Site");
  const [ogType, setOgType] = useState("website");
  const [ogTwitter, setOgTwitter] = useState(true);

  const [robotsPreset, setRobotsPreset] = useState("common");
  const [robotsUa, setRobotsUa] = useState("*");
  const [robotsAllow, setRobotsAllow] = useState("/");
  const [robotsDisallow, setRobotsDisallow] = useState("/admin/\n/private/");
  const [robotsSitemap, setRobotsSitemap] = useState("https://example.com/sitemap.xml");

  const [sitemapUrls, setSitemapUrls] = useState(
    "https://example.com/\nhttps://example.com/about\nhttps://example.com/tools",
  );
  const [sitemapFreq, setSitemapFreq] = useState("weekly");
  const [sitemapPriority, setSitemapPriority] = useState("0.8");
  const [sitemapLastmod, setSitemapLastmod] = useState("2026-10-06");

  const [gitignoreSelected, setGitignoreSelected] = useState<string[]>(["node", "macos"]);

  const [jsonCount, setJsonCount] = useState("5");
  const [jsonFields, setJsonFields] = useState<FieldRow[]>([
    { name: "id", type: "uuid" },
    { name: "name", type: "name" },
    { name: "email", type: "email" },
    { name: "age", type: "integer" },
    { name: "active", type: "boolean" },
  ]);

  const [csvRows, setCsvRows] = useState("10");
  const [csvDelimiter, setCsvDelimiter] = useState(",");
  const [csvColumns, setCsvColumns] = useState<FieldRow[]>([
    { name: "Name", type: "name" },
    { name: "Email", type: "email" },
    { name: "Age", type: "integer" },
    { name: "Country", type: "country" },
    { name: "Date", type: "date" },
    { name: "Active", type: "boolean" },
  ]);

  const [cronPreset, setCronPreset] = useState("every-weekday");
  const [cronMinute, setCronMinute] = useState("0");
  const [cronHour, setCronHour] = useState("9");
  const [cronDom, setCronDom] = useState("*");
  const [cronMonth, setCronMonth] = useState("*");
  const [cronDow, setCronDow] = useState("1-5");

  const liveCssPreview = useMemo(() => result?.previewCss, [result]);

  function runGenerate() {
    setCopied(false);
    setError(null);
    try {
      let next: GeneratorResult;
      switch (config.kind) {
        case "username":
          next = generateUsernames({
            style: usernameStyle,
            length: usernameLen,
            numbers: usernameNumbers,
            underscore: usernameUnderscore,
            separator: usernameSep,
            quantity: usernameQty,
          });
          break;
        case "business-name":
          next = generateBusinessNames({
            industry: bizIndustry,
            keyword: bizKeyword,
            style: bizStyle,
            length: bizLen,
            prefix: bizPrefix,
            suffix: bizSuffix,
            quantity: bizQty,
          });
          break;
        case "blog-title":
          next = generateBlogTitles({
            topic: blogTopic,
            keyword: blogKeyword,
            audience: blogAudience,
            tone: blogTone,
            quantity: blogQty,
          });
          break;
        case "hashtag":
          next = generateHashtags({
            topic: hashTopic,
            platform: hashPlatform,
            quantity: hashQty,
            mode: hashMode,
          });
          break;
        case "url-slug":
          next = generateUrlSlug({
            text: slugText,
            separator: slugSep,
            removeStopWords: slugStop,
            maxLength: slugMax,
          });
          break;
        case "utm-url":
          next = buildUtmUrl({
            baseUrl: utmBase,
            source: utmSource,
            medium: utmMedium,
            campaign: utmCampaign,
            term: utmTerm,
            content: utmContent,
          });
          break;
        case "color-palette": {
          next = generatePalette({
            size: paletteSize,
            seedColors: paletteColors,
            locked,
          });
          setPaletteColors(next.colors ?? []);
          setLocked((prev) => {
            const size = next.colors?.length ?? 0;
            return Array.from({ length: size }, (_, i) => Boolean(prev[i]));
          });
          break;
        }
        case "css-gradient":
          next = generateCssGradient({
            type: gradType,
            angle: gradAngle,
            position: gradPos,
            color1: gradC1,
            color2: gradC2,
            color3: gradC3,
            useThird: gradThird,
          });
          break;
        case "css-box-shadow":
          next = generateBoxShadow({
            x: shadowX,
            y: shadowY,
            blur: shadowBlur,
            spread: shadowSpread,
            color: shadowColor,
            opacity: shadowOpacity,
            inset: shadowInset,
          });
          break;
        case "css-border-radius":
          next = generateBorderRadius({
            tl,
            tr,
            br,
            bl,
            linked: radiusLinked,
          });
          break;
        case "css-clamp":
          next = generateClamp({
            property: clampProp,
            min: clampMin,
            preferred: clampPref,
            max: clampMax,
            unit: clampUnit,
          });
          break;
        case "html-boilerplate":
          next = generateHtmlBoilerplate({
            lang: htmlLang,
            title: htmlTitle,
            description: htmlDesc,
            stylesheet: htmlCss,
            script: htmlJs,
            favicon: htmlFavicon,
          });
          break;
        case "meta-tags":
          next = generateMetaTags({
            title: metaTitle,
            description: metaDesc,
            keywords: metaKeywords,
            author: metaAuthor,
            robots: metaRobots,
            canonical: metaCanonical,
          });
          break;
        case "open-graph":
          next = generateOpenGraph({
            title: ogTitle,
            description: ogDesc,
            url: ogUrl,
            image: ogImage,
            siteName: ogSite,
            type: ogType,
            twitter: ogTwitter,
          });
          break;
        case "robots-txt":
          next = generateRobotsTxt({
            preset: robotsPreset,
            userAgent: robotsUa,
            allow: robotsAllow,
            disallow: robotsDisallow,
            sitemap: robotsSitemap,
          });
          break;
        case "sitemap-xml":
          next = generateSitemapXml({
            urls: sitemapUrls,
            changefreq: sitemapFreq,
            priority: sitemapPriority,
            lastmod: sitemapLastmod,
          });
          break;
        case "gitignore":
          next = generateGitignore({ templates: gitignoreSelected });
          break;
        case "json-mock":
          next = generateJsonMock({ count: jsonCount, fields: jsonFields });
          break;
        case "csv-test":
          next = generateCsvTest({
            rows: csvRows,
            delimiter: csvDelimiter,
            columns: csvColumns,
          });
          break;
        case "cron":
          next = generateCron({
            minute: cronMinute,
            hour: cronHour,
            dayOfMonth: cronDom,
            month: cronMonth,
            dayOfWeek: cronDow,
            preset: cronPreset,
          });
          break;
        default:
          throw new Error("Unsupported generator.");
      }
      setResult(next);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Generation failed.");
    }
  }

  function resetAll() {
    setResult(null);
    setError(null);
    setCopied(false);
  }

  async function handleCopy(text?: string) {
    const value = text ?? result?.text;
    if (!value) return;
    const ok = await copyText(value);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  }

  function handleDownload() {
    if (!result?.text || !config.downloadName) return;
    downloadTextFile(result.text, config.downloadName);
  }

  return (
    <div className="space-y-6">
      {convertHeading ? <h2 className="tm-h2">{convertHeading}</h2> : null}
      {(config.notices ?? []).map((notice) => (
        <p key={notice} className="tm-notice tm-notice-info">
          {notice}
        </p>
      ))}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-4">
          {config.kind === "username" ? (
            <>
              <h3 className="tm-h3">Choose Username Options</h3>
              <Field id={`${id}-style`} label="Style">
                <select id={`${id}-style`} className="tm-input" value={usernameStyle} onChange={(e) => setUsernameStyle(e.target.value)}>
                  <option value="adj-noun">Adjective + noun</option>
                  <option value="adj-noun-number">Adjective + noun + number</option>
                  <option value="word-number">Word + number</option>
                  <option value="short">Short username</option>
                </select>
              </Field>
              <Field id={`${id}-len`} label="Target length">
                <input id={`${id}-len`} className="tm-input" inputMode="numeric" value={usernameLen} onChange={(e) => setUsernameLen(e.target.value)} />
              </Field>
              <Field id={`${id}-sep`} label="Separator">
                <select id={`${id}-sep`} className="tm-input" value={usernameSep} onChange={(e) => setUsernameSep(e.target.value)}>
                  <option value="none">None</option>
                  <option value="underscore">Underscore</option>
                  <option value="dash">Dash</option>
                </select>
              </Field>
              <Field id={`${id}-qty`} label="Quantity">
                <input id={`${id}-qty`} className="tm-input" inputMode="numeric" value={usernameQty} onChange={(e) => setUsernameQty(e.target.value)} />
              </Field>
              <label className="flex items-center gap-2 text-sm font-bold text-tm-text">
                <input type="checkbox" className="size-4 accent-[var(--tm-accent)]" checked={usernameNumbers} onChange={(e) => setUsernameNumbers(e.target.checked)} />
                Include numbers
              </label>
              <label className="flex items-center gap-2 text-sm font-bold text-tm-text">
                <input type="checkbox" className="size-4 accent-[var(--tm-accent)]" checked={usernameUnderscore} onChange={(e) => setUsernameUnderscore(e.target.checked)} />
                Prefer underscore
              </label>
            </>
          ) : null}

          {config.kind === "business-name" ? (
            <>
              <h3 className="tm-h3">Describe the Business</h3>
              <Field id={`${id}-ind`} label="Industry"><input id={`${id}-ind`} className="tm-input" value={bizIndustry} onChange={(e) => setBizIndustry(e.target.value)} /></Field>
              <Field id={`${id}-kw`} label="Keyword"><input id={`${id}-kw`} className="tm-input" value={bizKeyword} onChange={(e) => setBizKeyword(e.target.value)} /></Field>
              <Field id={`${id}-bst`} label="Style">
                <select id={`${id}-bst`} className="tm-input" value={bizStyle} onChange={(e) => setBizStyle(e.target.value)}>
                  <option value="modern">Modern</option>
                  <option value="premium">Premium</option>
                  <option value="minimal">Minimal</option>
                  <option value="tech">Tech</option>
                  <option value="creative">Creative</option>
                  <option value="professional">Professional</option>
                </select>
              </Field>
              <Field id={`${id}-blen`} label="Max length"><input id={`${id}-blen`} className="tm-input" value={bizLen} onChange={(e) => setBizLen(e.target.value)} /></Field>
              <Field id={`${id}-pre`} label="Optional prefix"><input id={`${id}-pre`} className="tm-input" value={bizPrefix} onChange={(e) => setBizPrefix(e.target.value)} /></Field>
              <Field id={`${id}-suf`} label="Optional suffix"><input id={`${id}-suf`} className="tm-input" value={bizSuffix} onChange={(e) => setBizSuffix(e.target.value)} /></Field>
              <Field id={`${id}-bqty`} label="Quantity"><input id={`${id}-bqty`} className="tm-input" value={bizQty} onChange={(e) => setBizQty(e.target.value)} /></Field>
            </>
          ) : null}

          {config.kind === "blog-title" ? (
            <>
              <h3 className="tm-h3">Enter Topic Details</h3>
              <Field id={`${id}-topic`} label="Topic"><input id={`${id}-topic`} className="tm-input" value={blogTopic} onChange={(e) => setBlogTopic(e.target.value)} /></Field>
              <Field id={`${id}-bkw`} label="Keyword"><input id={`${id}-bkw`} className="tm-input" value={blogKeyword} onChange={(e) => setBlogKeyword(e.target.value)} /></Field>
              <Field id={`${id}-aud`} label="Audience"><input id={`${id}-aud`} className="tm-input" value={blogAudience} onChange={(e) => setBlogAudience(e.target.value)} /></Field>
              <Field id={`${id}-tone`} label="Tone">
                <select id={`${id}-tone`} className="tm-input" value={blogTone} onChange={(e) => setBlogTone(e.target.value)}>
                  <option value="practical">Practical</option>
                  <option value="friendly">Friendly</option>
                  <option value="expert">Expert</option>
                  <option value="bold">Bold</option>
                </select>
              </Field>
              <Field id={`${id}-tqty`} label="Number of titles"><input id={`${id}-tqty`} className="tm-input" value={blogQty} onChange={(e) => setBlogQty(e.target.value)} /></Field>
            </>
          ) : null}

          {config.kind === "hashtag" ? (
            <>
              <h3 className="tm-h3">Enter a Topic</h3>
              <Field id={`${id}-ht`} label="Topic / keyword"><input id={`${id}-ht`} className="tm-input" value={hashTopic} onChange={(e) => setHashTopic(e.target.value)} /></Field>
              <Field id={`${id}-hp`} label="Platform">
                <select id={`${id}-hp`} className="tm-input" value={hashPlatform} onChange={(e) => setHashPlatform(e.target.value)}>
                  <option value="general">General</option>
                  <option value="instagram">Instagram-style</option>
                  <option value="linkedin">LinkedIn-style</option>
                </select>
              </Field>
              <Field id={`${id}-hm`} label="Mode">
                <select id={`${id}-hm`} className="tm-input" value={hashMode} onChange={(e) => setHashMode(e.target.value)}>
                  <option value="broad">Broad</option>
                  <option value="niche">Niche</option>
                </select>
              </Field>
              <Field id={`${id}-hq`} label="Number of hashtags"><input id={`${id}-hq`} className="tm-input" value={hashQty} onChange={(e) => setHashQty(e.target.value)} /></Field>
            </>
          ) : null}

          {config.kind === "url-slug" ? (
            <>
              <h3 className="tm-h3">Enter Text to Slugify</h3>
              <Field id={`${id}-st`} label="Text"><textarea id={`${id}-st`} className="tm-input min-h-28" value={slugText} onChange={(e) => setSlugText(e.target.value)} /></Field>
              <Field id={`${id}-ss`} label="Separator">
                <select id={`${id}-ss`} className="tm-input" value={slugSep} onChange={(e) => setSlugSep(e.target.value)}>
                  <option value="dash">Dash</option>
                  <option value="underscore">Underscore</option>
                </select>
              </Field>
              <Field id={`${id}-sm`} label="Max length"><input id={`${id}-sm`} className="tm-input" value={slugMax} onChange={(e) => setSlugMax(e.target.value)} /></Field>
              <label className="flex items-center gap-2 text-sm font-bold text-tm-text">
                <input type="checkbox" className="size-4 accent-[var(--tm-accent)]" checked={slugStop} onChange={(e) => setSlugStop(e.target.checked)} />
                Remove common stop words
              </label>
            </>
          ) : null}

          {config.kind === "utm-url" ? (
            <>
              <h3 className="tm-h3">Enter Campaign Parameters</h3>
              <Field id={`${id}-ub`} label="Base URL"><input id={`${id}-ub`} className="tm-input" value={utmBase} onChange={(e) => setUtmBase(e.target.value)} /></Field>
              <Field id={`${id}-us`} label="utm_source"><input id={`${id}-us`} className="tm-input" value={utmSource} onChange={(e) => setUtmSource(e.target.value)} /></Field>
              <Field id={`${id}-um`} label="utm_medium"><input id={`${id}-um`} className="tm-input" value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} /></Field>
              <Field id={`${id}-uc`} label="utm_campaign"><input id={`${id}-uc`} className="tm-input" value={utmCampaign} onChange={(e) => setUtmCampaign(e.target.value)} /></Field>
              <Field id={`${id}-ut`} label="utm_term (optional)"><input id={`${id}-ut`} className="tm-input" value={utmTerm} onChange={(e) => setUtmTerm(e.target.value)} /></Field>
              <Field id={`${id}-uco`} label="utm_content (optional)"><input id={`${id}-uco`} className="tm-input" value={utmContent} onChange={(e) => setUtmContent(e.target.value)} /></Field>
            </>
          ) : null}

          {config.kind === "color-palette" ? (
            <>
              <h3 className="tm-h3">Choose Your Palette Size</h3>
              <Field id={`${id}-ps`} label="Palette size">
                <select id={`${id}-ps`} className="tm-input" value={paletteSize} onChange={(e) => setPaletteSize(e.target.value)}>
                  {[3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={String(n)}>{n} colors</option>
                  ))}
                </select>
              </Field>
              {paletteColors.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {paletteColors.map((color, index) => (
                    <div key={`${color}-${index}`} className="rounded-xl border border-tm-border bg-tm-white p-3">
                      <div className="h-12 rounded-lg border border-tm-border" style={{ background: color }} />
                      <p className="mt-2 font-mono text-sm font-bold text-tm-text">{color}</p>
                      <label className="mt-2 flex items-center gap-2 text-xs font-bold text-tm-muted">
                        <input
                          type="checkbox"
                          className="size-4 accent-[var(--tm-accent)]"
                          checked={Boolean(locked[index])}
                          onChange={(e) => {
                            const next = [...locked];
                            next[index] = e.target.checked;
                            setLocked(next);
                          }}
                        />
                        Lock color
                      </label>
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          ) : null}

          {config.kind === "css-gradient" ? (
            <>
              <h3 className="tm-h3">Configure Gradient</h3>
              <Field id={`${id}-gt`} label="Type">
                <select id={`${id}-gt`} className="tm-input" value={gradType} onChange={(e) => setGradType(e.target.value)}>
                  <option value="linear">Linear</option>
                  <option value="radial">Radial</option>
                </select>
              </Field>
              {gradType === "linear" ? (
                <Field id={`${id}-ga`} label="Angle (deg)"><input id={`${id}-ga`} className="tm-input" value={gradAngle} onChange={(e) => setGradAngle(e.target.value)} /></Field>
              ) : (
                <Field id={`${id}-gp`} label="Position"><input id={`${id}-gp`} className="tm-input" value={gradPos} onChange={(e) => setGradPos(e.target.value)} /></Field>
              )}
              <Field id={`${id}-g1`} label="Color 1"><input id={`${id}-g1`} className="tm-input" value={gradC1} onChange={(e) => setGradC1(e.target.value)} /></Field>
              <Field id={`${id}-g2`} label="Color 2"><input id={`${id}-g2`} className="tm-input" value={gradC2} onChange={(e) => setGradC2(e.target.value)} /></Field>
              <label className="flex items-center gap-2 text-sm font-bold text-tm-text">
                <input type="checkbox" className="size-4 accent-[var(--tm-accent)]" checked={gradThird} onChange={(e) => setGradThird(e.target.checked)} />
                Use third color stop
              </label>
              {gradThird ? (
                <Field id={`${id}-g3`} label="Color 3"><input id={`${id}-g3`} className="tm-input" value={gradC3} onChange={(e) => setGradC3(e.target.value)} /></Field>
              ) : null}
            </>
          ) : null}

          {config.kind === "css-box-shadow" ? (
            <>
              <h3 className="tm-h3">Configure Shadow</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field id={`${id}-sx`} label="X offset"><input id={`${id}-sx`} className="tm-input" value={shadowX} onChange={(e) => setShadowX(e.target.value)} /></Field>
                <Field id={`${id}-sy`} label="Y offset"><input id={`${id}-sy`} className="tm-input" value={shadowY} onChange={(e) => setShadowY(e.target.value)} /></Field>
                <Field id={`${id}-sb`} label="Blur"><input id={`${id}-sb`} className="tm-input" value={shadowBlur} onChange={(e) => setShadowBlur(e.target.value)} /></Field>
                <Field id={`${id}-sp`} label="Spread"><input id={`${id}-sp`} className="tm-input" value={shadowSpread} onChange={(e) => setShadowSpread(e.target.value)} /></Field>
                <Field id={`${id}-sc`} label="Color"><input id={`${id}-sc`} className="tm-input" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} /></Field>
                <Field id={`${id}-so`} label="Opacity"><input id={`${id}-so`} className="tm-input" value={shadowOpacity} onChange={(e) => setShadowOpacity(e.target.value)} /></Field>
              </div>
              <label className="flex items-center gap-2 text-sm font-bold text-tm-text">
                <input type="checkbox" className="size-4 accent-[var(--tm-accent)]" checked={shadowInset} onChange={(e) => setShadowInset(e.target.checked)} />
                Inset shadow
              </label>
            </>
          ) : null}

          {config.kind === "css-border-radius" ? (
            <>
              <h3 className="tm-h3">Set Corner Radii</h3>
              <label className="flex items-center gap-2 text-sm font-bold text-tm-text">
                <input type="checkbox" className="size-4 accent-[var(--tm-accent)]" checked={radiusLinked} onChange={(e) => setRadiusLinked(e.target.checked)} />
                Link corners
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field id={`${id}-tl`} label="Top left"><input id={`${id}-tl`} className="tm-input" value={tl} onChange={(e) => setTl(e.target.value)} /></Field>
                {!radiusLinked ? (
                  <>
                    <Field id={`${id}-tr`} label="Top right"><input id={`${id}-tr`} className="tm-input" value={tr} onChange={(e) => setTr(e.target.value)} /></Field>
                    <Field id={`${id}-br`} label="Bottom right"><input id={`${id}-br`} className="tm-input" value={br} onChange={(e) => setBr(e.target.value)} /></Field>
                    <Field id={`${id}-bl`} label="Bottom left"><input id={`${id}-bl`} className="tm-input" value={bl} onChange={(e) => setBl(e.target.value)} /></Field>
                  </>
                ) : null}
              </div>
            </>
          ) : null}

          {config.kind === "css-clamp" ? (
            <>
              <h3 className="tm-h3">Build a Clamp Expression</h3>
              <Field id={`${id}-cp`} label="CSS property"><input id={`${id}-cp`} className="tm-input" value={clampProp} onChange={(e) => setClampProp(e.target.value)} /></Field>
              <Field id={`${id}-cu`} label="Unit">
                <select id={`${id}-cu`} className="tm-input" value={clampUnit} onChange={(e) => setClampUnit(e.target.value)}>
                  <option value="rem">rem</option>
                  <option value="em">em</option>
                  <option value="px">px</option>
                </select>
              </Field>
              <Field id={`${id}-cmin`} label="Minimum"><input id={`${id}-cmin`} className="tm-input" value={clampMin} onChange={(e) => setClampMin(e.target.value)} /></Field>
              <Field id={`${id}-cpref`} label="Preferred (vw number)"><input id={`${id}-cpref`} className="tm-input" value={clampPref} onChange={(e) => setClampPref(e.target.value)} /></Field>
              <Field id={`${id}-cmax`} label="Maximum"><input id={`${id}-cmax`} className="tm-input" value={clampMax} onChange={(e) => setClampMax(e.target.value)} /></Field>
            </>
          ) : null}

          {config.kind === "html-boilerplate" ? (
            <>
              <h3 className="tm-h3">Configure Document Options</h3>
              <Field id={`${id}-hl`} label="Language"><input id={`${id}-hl`} className="tm-input" value={htmlLang} onChange={(e) => setHtmlLang(e.target.value)} /></Field>
              <Field id={`${id}-ht`} label="Title"><input id={`${id}-ht`} className="tm-input" value={htmlTitle} onChange={(e) => setHtmlTitle(e.target.value)} /></Field>
              <Field id={`${id}-hd`} label="Description"><input id={`${id}-hd`} className="tm-input" value={htmlDesc} onChange={(e) => setHtmlDesc(e.target.value)} /></Field>
              <Field id={`${id}-hc`} label="Stylesheet path (optional)"><input id={`${id}-hc`} className="tm-input" value={htmlCss} onChange={(e) => setHtmlCss(e.target.value)} /></Field>
              <Field id={`${id}-hj`} label="Script path (optional)"><input id={`${id}-hj`} className="tm-input" value={htmlJs} onChange={(e) => setHtmlJs(e.target.value)} /></Field>
              <Field id={`${id}-hf`} label="Favicon path (optional)"><input id={`${id}-hf`} className="tm-input" value={htmlFavicon} onChange={(e) => setHtmlFavicon(e.target.value)} /></Field>
            </>
          ) : null}

          {config.kind === "meta-tags" ? (
            <>
              <h3 className="tm-h3">Enter Metadata</h3>
              <Field id={`${id}-mt`} label="Page title"><input id={`${id}-mt`} className="tm-input" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} /></Field>
              <Field id={`${id}-md`} label="Description"><textarea id={`${id}-md`} className="tm-input min-h-24" value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} /></Field>
              <Field id={`${id}-mk`} label="Keywords (optional)"><input id={`${id}-mk`} className="tm-input" value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} /></Field>
              <Field id={`${id}-ma`} label="Author (optional)"><input id={`${id}-ma`} className="tm-input" value={metaAuthor} onChange={(e) => setMetaAuthor(e.target.value)} /></Field>
              <Field id={`${id}-mr`} label="Robots"><input id={`${id}-mr`} className="tm-input" value={metaRobots} onChange={(e) => setMetaRobots(e.target.value)} /></Field>
              <Field id={`${id}-mc`} label="Canonical URL"><input id={`${id}-mc`} className="tm-input" value={metaCanonical} onChange={(e) => setMetaCanonical(e.target.value)} /></Field>
            </>
          ) : null}

          {config.kind === "open-graph" ? (
            <>
              <h3 className="tm-h3">Enter Open Graph Fields</h3>
              <Field id={`${id}-ot`} label="Title"><input id={`${id}-ot`} className="tm-input" value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} /></Field>
              <Field id={`${id}-od`} label="Description"><textarea id={`${id}-od`} className="tm-input min-h-24" value={ogDesc} onChange={(e) => setOgDesc(e.target.value)} /></Field>
              <Field id={`${id}-ou`} label="URL"><input id={`${id}-ou`} className="tm-input" value={ogUrl} onChange={(e) => setOgUrl(e.target.value)} /></Field>
              <Field id={`${id}-oi`} label="Image URL"><input id={`${id}-oi`} className="tm-input" value={ogImage} onChange={(e) => setOgImage(e.target.value)} /></Field>
              <Field id={`${id}-os`} label="Site name"><input id={`${id}-os`} className="tm-input" value={ogSite} onChange={(e) => setOgSite(e.target.value)} /></Field>
              <Field id={`${id}-oty`} label="Type"><input id={`${id}-oty`} className="tm-input" value={ogType} onChange={(e) => setOgType(e.target.value)} /></Field>
              <label className="flex items-center gap-2 text-sm font-bold text-tm-text">
                <input type="checkbox" className="size-4 accent-[var(--tm-accent)]" checked={ogTwitter} onChange={(e) => setOgTwitter(e.target.checked)} />
                Include Twitter/X card tags
              </label>
            </>
          ) : null}

          {config.kind === "robots-txt" ? (
            <>
              <h3 className="tm-h3">Choose Crawl Rules</h3>
              <Field id={`${id}-rp`} label="Preset">
                <select id={`${id}-rp`} className="tm-input" value={robotsPreset} onChange={(e) => setRobotsPreset(e.target.value)}>
                  <option value="allow-all">Allow all</option>
                  <option value="block-all">Block all</option>
                  <option value="common">Common website</option>
                  <option value="cms">CMS / admin protection</option>
                  <option value="custom">Custom</option>
                </select>
              </Field>
              <Field id={`${id}-rua`} label="User-agent"><input id={`${id}-rua`} className="tm-input" value={robotsUa} onChange={(e) => setRobotsUa(e.target.value)} /></Field>
              <Field id={`${id}-ra`} label="Allow paths (one per line)"><textarea id={`${id}-ra`} className="tm-input min-h-20" value={robotsAllow} onChange={(e) => setRobotsAllow(e.target.value)} /></Field>
              <Field id={`${id}-rd`} label="Disallow paths (one per line)"><textarea id={`${id}-rd`} className="tm-input min-h-20" value={robotsDisallow} onChange={(e) => setRobotsDisallow(e.target.value)} /></Field>
              <Field id={`${id}-rs`} label="Sitemap URL"><input id={`${id}-rs`} className="tm-input" value={robotsSitemap} onChange={(e) => setRobotsSitemap(e.target.value)} /></Field>
            </>
          ) : null}

          {config.kind === "sitemap-xml" ? (
            <>
              <h3 className="tm-h3">Enter URLs</h3>
              <Field id={`${id}-su`} label="URLs (one per line)"><textarea id={`${id}-su`} className="tm-input min-h-36" value={sitemapUrls} onChange={(e) => setSitemapUrls(e.target.value)} /></Field>
              <Field id={`${id}-sf`} label="changefreq (optional)"><input id={`${id}-sf`} className="tm-input" value={sitemapFreq} onChange={(e) => setSitemapFreq(e.target.value)} /></Field>
              <Field id={`${id}-sp`} label="priority (optional)"><input id={`${id}-sp`} className="tm-input" value={sitemapPriority} onChange={(e) => setSitemapPriority(e.target.value)} /></Field>
              <Field id={`${id}-sl`} label="lastmod (optional)"><input id={`${id}-sl`} className="tm-input" value={sitemapLastmod} onChange={(e) => setSitemapLastmod(e.target.value)} /></Field>
            </>
          ) : null}

          {config.kind === "gitignore" ? (
            <>
              <h3 className="tm-h3">Select Templates</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {GITIGNORE_OPTIONS.map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm font-bold text-tm-text">
                    <input
                      type="checkbox"
                      className="size-4 accent-[var(--tm-accent)]"
                      checked={gitignoreSelected.includes(key)}
                      onChange={(e) => {
                        setGitignoreSelected((prev) =>
                          e.target.checked ? [...prev, key] : prev.filter((item) => item !== key),
                        );
                      }}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </>
          ) : null}

          {config.kind === "json-mock" ? (
            <>
              <h3 className="tm-h3">Define Fields</h3>
              <Field id={`${id}-jc`} label="Number of records"><input id={`${id}-jc`} className="tm-input" value={jsonCount} onChange={(e) => setJsonCount(e.target.value)} /></Field>
              <FieldEditor rows={jsonFields} onChange={setJsonFields} idPrefix={`${id}-jf`} />
            </>
          ) : null}

          {config.kind === "csv-test" ? (
            <>
              <h3 className="tm-h3">Define Columns</h3>
              <Field id={`${id}-cr`} label="Number of rows"><input id={`${id}-cr`} className="tm-input" value={csvRows} onChange={(e) => setCsvRows(e.target.value)} /></Field>
              <Field id={`${id}-cd`} label="Delimiter">
                <select id={`${id}-cd`} className="tm-input" value={csvDelimiter} onChange={(e) => setCsvDelimiter(e.target.value)}>
                  <option value=",">Comma</option>
                  <option value=";">Semicolon</option>
                  <option value={"\t"}>Tab</option>
                </select>
              </Field>
              <FieldEditor rows={csvColumns} onChange={setCsvColumns} idPrefix={`${id}-cf`} />
            </>
          ) : null}

          {config.kind === "cron" ? (
            <>
              <h3 className="tm-h3">Choose a Schedule</h3>
              <Field id={`${id}-cp`} label="Preset">
                <select id={`${id}-cp`} className="tm-input" value={cronPreset} onChange={(e) => setCronPreset(e.target.value)}>
                  <option value="custom">Custom</option>
                  <option value="every-minute">Every minute</option>
                  <option value="every-hour">Every hour</option>
                  <option value="every-day">Every day</option>
                  <option value="every-weekday">Every weekday</option>
                  <option value="every-week">Every week</option>
                  <option value="every-month">Every month</option>
                </select>
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field id={`${id}-cm`} label="Minute"><input id={`${id}-cm`} className="tm-input" value={cronMinute} onChange={(e) => { setCronPreset("custom"); setCronMinute(e.target.value); }} /></Field>
                <Field id={`${id}-ch`} label="Hour"><input id={`${id}-ch`} className="tm-input" value={cronHour} onChange={(e) => { setCronPreset("custom"); setCronHour(e.target.value); }} /></Field>
                <Field id={`${id}-cdm`} label="Day of month"><input id={`${id}-cdm`} className="tm-input" value={cronDom} onChange={(e) => { setCronPreset("custom"); setCronDom(e.target.value); }} /></Field>
                <Field id={`${id}-cmo`} label="Month"><input id={`${id}-cmo`} className="tm-input" value={cronMonth} onChange={(e) => { setCronPreset("custom"); setCronMonth(e.target.value); }} /></Field>
                <Field id={`${id}-cdw`} label="Day of week"><input id={`${id}-cdw`} className="tm-input" value={cronDow} onChange={(e) => { setCronPreset("custom"); setCronDow(e.target.value); }} /></Field>
              </div>
            </>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="button" className="tm-btn tm-btn-primary" onClick={runGenerate} aria-label={config.actionLabel}>
              {config.actionLabel}
            </button>
            <button type="button" className="tm-btn tm-btn-ghost" onClick={resetAll}>
              Reset
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {error ? (
            <p className="tm-notice tm-notice-error" role="alert">{error}</p>
          ) : null}
          {result?.meta?.warning ? (
            <p className="tm-notice tm-notice-warning">{result.meta.warning}</p>
          ) : null}
          {result?.meta?.note ? (
            <p className="text-sm font-medium text-tm-muted">{result.meta.note}</p>
          ) : null}
          {result?.meta?.dialect ? (
            <p className="text-sm font-medium text-tm-muted">{result.meta.dialect}</p>
          ) : null}
          {result?.meta?.readable ? (
            <p className="rounded-xl border border-tm-border bg-tm-soft px-4 py-3 text-sm font-bold text-tm-text">
              {result.meta.readable}
            </p>
          ) : null}

          {liveCssPreview ? (
            <div className="overflow-hidden rounded-2xl border border-tm-border bg-tm-soft p-5">
              <p className="text-xs font-extrabold tracking-wide text-tm-accent uppercase">Preview</p>
              <div
                className="mt-3 h-28 rounded-xl border border-tm-border bg-tm-white"
                style={previewStyle(liveCssPreview, config.kind)}
                aria-hidden="true"
              />
            </div>
          ) : null}

          <div className="rounded-2xl border border-tm-border bg-tm-soft p-5" aria-live="polite">
            <p className="text-xs font-extrabold tracking-wide text-tm-accent uppercase">Result</p>
            {result ? (
              <pre className="mt-3 max-h-[28rem] overflow-auto whitespace-pre-wrap break-all font-mono text-sm font-semibold text-tm-text">
                {result.text}
              </pre>
            ) : (
              <p className="mt-3 text-sm font-medium text-tm-muted">Generate to see output here.</p>
            )}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className="tm-btn tm-btn-secondary"
                disabled={!result}
                onClick={() => void handleCopy()}
                aria-label="Copy generated result"
              >
                {copied ? "Copied" : config.kind === "hashtag" ? "Copy Hashtags" : config.kind === "url-slug" ? "Copy Slug" : config.kind === "utm-url" ? "Copy URL" : config.kind === "cron" ? "Copy Expression" : "Copy"}
              </button>
              {config.downloadName ? (
                <button
                  type="button"
                  className="tm-btn tm-btn-ghost"
                  disabled={!result}
                  onClick={handleDownload}
                  aria-label={`Download ${config.downloadName}`}
                >
                  Download
                </button>
              ) : null}
              {result?.items?.length && result.items.length > 1 ? (
                <button
                  type="button"
                  className="tm-btn tm-btn-ghost"
                  onClick={() => void handleCopy(result.items?.join("\n"))}
                >
                  Copy All
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldEditor({
  rows,
  onChange,
  idPrefix,
}: {
  rows: FieldRow[];
  onChange: (rows: FieldRow[]) => void;
  idPrefix: string;
}) {
  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={`${idPrefix}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input
            className="tm-input"
            aria-label={`Field ${index + 1} name`}
            value={row.name}
            onChange={(e) => {
              const next = [...rows];
              next[index] = { ...row, name: e.target.value };
              onChange(next);
            }}
          />
          <select
            className="tm-input"
            aria-label={`Field ${index + 1} type`}
            value={row.type}
            onChange={(e) => {
              const next = [...rows];
              next[index] = { ...row, type: e.target.value };
              onChange(next);
            }}
          >
            <option value="string">String</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="integer">Integer</option>
            <option value="boolean">Boolean</option>
            <option value="uuid">UUID</option>
            <option value="date">Date</option>
            <option value="country">Country</option>
          </select>
          <button
            type="button"
            className="tm-btn tm-btn-ghost"
            onClick={() => onChange(rows.filter((_, i) => i !== index))}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="tm-btn tm-btn-secondary"
        onClick={() => onChange([...rows, { name: "field", type: "string" }])}
      >
        Add field
      </button>
    </div>
  );
}

function previewStyle(css: string, kind: GeneratorToolConfig["kind"]): React.CSSProperties {
  if (kind === "css-gradient") {
    const match = css.match(/background:\s*(.+);/);
    return match ? { background: match[1] } : {};
  }
  if (kind === "css-box-shadow") {
    const match = css.match(/box-shadow:\s*(.+);/);
    return match ? { boxShadow: match[1], background: "var(--tm-white)" } : {};
  }
  if (kind === "css-border-radius") {
    const match = css.match(/border-radius:\s*(.+);/);
    return match
      ? { borderRadius: match[1], background: "var(--tm-accent)", opacity: 0.85 }
      : {};
  }
  if (kind === "css-clamp") {
    const match = css.match(/font-size:\s*(.+);/);
    return match
      ? { fontSize: match[1], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }
      : {};
  }
  return {};
}
