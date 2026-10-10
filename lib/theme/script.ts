/**
 * Inline boot script — forces permanent Light Mode before paint.
 * Clears obsolete tb-theme preferences so old dark/system values cannot apply.
 */
export const themeInitScript = `(function(){try{var k="tb-theme";try{localStorage.removeItem(k)}catch(e){}var root=document.documentElement;root.classList.remove("dark");root.setAttribute("data-theme","light");root.removeAttribute("data-theme-preference");root.removeAttribute("data-theme-mobile-forced");root.style.setProperty("color-scheme","light");var meta=document.querySelector('meta[name="color-scheme"]');if(!meta){meta=document.createElement("meta");meta.setAttribute("name","color-scheme");document.head.appendChild(meta)}meta.setAttribute("content","light");}catch(e){}})();`;

/** Legacy key removed on boot; kept for reference / migration only. */
export const THEME_STORAGE_KEY = "tb-theme";
