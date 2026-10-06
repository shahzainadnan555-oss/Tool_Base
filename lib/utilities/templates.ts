export interface StarterTemplate {
  id: string;
  name: string;
  description: string;
  filename: string;
  html: string;
}

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: "landing",
    name: "HTML landing starter",
    description: "A single-page hero, features, and footer for a product launch.",
    filename: "tool-base-landing.html",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Northline Studio</title>
  <style>
    :root { font-family: Georgia, serif; color: #102033; background: #f6f3ee; }
    body { margin: 0; }
    header, section, footer { max-width: 920px; margin: 0 auto; padding: 48px 24px; }
    a { color: #155eef; }
    .hero h1 { font-size: clamp(2.4rem, 6vw, 4rem); line-height: 1.1; }
    .grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
    article { background: white; padding: 20px; border-radius: 16px; }
  </style>
</head>
<body>
  <header class="hero">
    <p>Northline Studio</p>
    <h1>Quiet tools for focused teams.</h1>
    <p>Replace this copy with your product story, then ship.</p>
    <p><a href="#features">See what’s included</a></p>
  </header>
  <section id="features">
    <div class="grid">
      <article><h2>Simple pages</h2><p>Start from semantic HTML, not a framework lock-in.</p></article>
      <article><h2>Clear type</h2><p>Readable defaults you can restyle in minutes.</p></article>
      <article><h2>Ready to edit</h2><p>Every heading is a placeholder, not finished brand copy.</p></article>
    </div>
  </section>
  <footer><p>Starter by Tool Base. Customize freely.</p></footer>
</body>
</html>`,
  },
  {
    id: "portfolio",
    name: "Portfolio starter",
    description: "A project grid with a short bio and contact placeholder.",
    filename: "tool-base-portfolio.html",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Jordan Hale — Portfolio</title>
  <style>
    body { margin: 0; font-family: ui-sans-serif, system-ui; background: #0f172a; color: #e2e8f0; }
    main { max-width: 960px; margin: 0 auto; padding: 56px 20px; }
    .work { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
    .card { border: 1px solid #334155; border-radius: 18px; padding: 20px; }
  </style>
</head>
<body>
  <main>
    <p>Selected work</p>
    <h1>Jordan Hale designs maps, type, and quiet interfaces.</h1>
    <div class="work">
      <div class="card"><h2>Harbor Marks</h2><p>Wayfinding system for a coastal archive.</p></div>
      <div class="card"><h2>Ledger Light</h2><p>A billing dashboard for independent studios.</p></div>
      <div class="card"><h2>Field Notes</h2><p>Editorial layout for a seasonal journal.</p></div>
    </div>
  </main>
</body>
</html>`,
  },
  {
    id: "saas",
    name: "SaaS landing starter",
    description: "Hero, pricing teaser, and a signup form shell.",
    filename: "tool-base-saas.html",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Cascade — Work in sequence</title>
  <style>
    body { margin: 0; font-family: ui-sans-serif, system-ui; background: #f8fafc; color: #0f172a; }
    .wrap { max-width: 880px; margin: 0 auto; padding: 64px 20px; }
    button { background: #155eef; color: white; border: 0; border-radius: 999px; padding: 12px 20px; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Keep every launch in one sequence.</h1>
    <p>Cascade is a placeholder product name. Describe the job your software actually does.</p>
    <form><label>Work email <input type="email" placeholder="you@studio.example" /></label> <button type="button">Join the waitlist</button></form>
  </div>
</body>
</html>`,
  },
  {
    id: "pricing",
    name: "Pricing section starter",
    description: "Three plan cards with feature lists you can edit.",
    filename: "tool-base-pricing.html",
    html: `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Pricing</title>
<style>body{font-family:ui-sans-serif,system-ui;margin:0;background:#fff;color:#111} .row{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));max-width:960px;margin:48px auto;padding:0 20px} .plan{border:1px solid #e2e8f0;border-radius:20px;padding:24px}</style>
</head><body>
<section class="row">
  <article class="plan"><h2>Starter</h2><p>$0</p><ul><li>1 workspace</li><li>Email support</li></ul></article>
  <article class="plan"><h2>Studio</h2><p>$29</p><ul><li>5 workspaces</li><li>Shared libraries</li></ul></article>
  <article class="plan"><h2>Team</h2><p>$79</p><ul><li>Unlimited seats</li><li>Priority review</li></ul></article>
</section></body></html>`,
  },
  {
    id: "navbar",
    name: "Navbar starter",
    description: "Accessible header with logo, links, and a menu button.",
    filename: "tool-base-navbar.html",
    html: `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Navbar starter</title>
<style>body{margin:0;font-family:ui-sans-serif,system-ui} header{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid #e2e8f0} nav a{margin-left:16px;color:#155eef;text-decoration:none}</style>
</head><body>
<header>
  <strong>Bright Harbor</strong>
  <nav aria-label="Primary">
    <a href="#work">Work</a>
    <a href="#notes">Notes</a>
    <a href="#visit">Visit</a>
  </nav>
</header>
<main style="padding:48px 24px"><h1>Replace this page body.</h1></main>
</body></html>`,
  },
  {
    id: "hero",
    name: "Hero starter",
    description: "A large headline, supporting line, and two actions.",
    filename: "tool-base-hero.html",
    html: `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Hero starter</title>
<style>body{margin:0;font-family:Georgia,serif;background:#102033;color:#f8fafc} .hero{min-height:70vh;display:grid;place-items:center;text-align:center;padding:40px} a{color:#7dd3fc}</style>
</head><body>
<section class="hero">
  <div>
    <p>Season four</p>
    <h1>Stories told at walking speed.</h1>
    <p><a href="#listen">Listen</a> · <a href="#read">Read the notes</a></p>
  </div>
</section>
</body></html>`,
  },
  {
    id: "login",
    name: "Login UI starter",
    description: "A labeled email/password form with a guest note.",
    filename: "tool-base-login.html",
    html: `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Sign in</title>
<style>body{margin:0;font-family:ui-sans-serif,system-ui;background:#f1f5f9} form{max-width:360px;margin:10vh auto;background:white;padding:28px;border-radius:20px;border:1px solid #e2e8f0} label{display:block;margin:12px 0 6px;font-weight:700} input{width:100%;padding:10px;border-radius:10px;border:1px solid #cbd5e1} button{margin-top:16px;width:100%;padding:12px;border:0;border-radius:12px;background:#155eef;color:white}</style>
</head><body>
<form>
  <h1>Sign in</h1>
  <label for="email">Email</label>
  <input id="email" type="email" autocomplete="username" />
  <label for="password">Password</label>
  <input id="password" type="password" autocomplete="current-password" />
  <button type="button">Continue</button>
  <p>This is a layout starter. Wire it to your own auth.</p>
</form>
</body></html>`,
  },
  {
    id: "dashboard",
    name: "Dashboard starter",
    description: "Sidebar, summary stats, and a table shell.",
    filename: "tool-base-dashboard.html",
    html: `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Dashboard starter</title>
<style>body{margin:0;font-family:ui-sans-serif,system-ui;display:grid;grid-template-columns:220px 1fr;min-height:100vh} aside{background:#0f172a;color:#e2e8f0;padding:24px} main{padding:32px;background:#f8fafc} .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px} .card{background:white;border:1px solid #e2e8f0;border-radius:16px;padding:16px}</style>
</head><body>
<aside><strong>Atlas Ops</strong><p>Overview</p><p>Shipments</p><p>Teams</p></aside>
<main>
  <h1>Today</h1>
  <div class="stats">
    <div class="card"><p>Open jobs</p><strong>18</strong></div>
    <div class="card"><p>On time</p><strong>94%</strong></div>
    <div class="card"><p>Alerts</p><strong>2</strong></div>
  </div>
</main>
</body></html>`,
  },
];
