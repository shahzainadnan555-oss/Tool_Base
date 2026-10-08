/**
 * Inline boot script — applied before paint to avoid a light/dark flash.
 * Preference values: "light" | "dark" | "system" (missing/invalid → system).
 */
export const themeInitScript = `(function(){try{var k="tb-theme";var p=localStorage.getItem(k);if(p!=="light"&&p!=="dark"&&p!=="system")p="system";var dark=p==="dark"||(p==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var root=document.documentElement;if(dark){root.classList.add("dark")}else{root.classList.remove("dark")}root.setAttribute("data-theme",dark?"dark":"light");root.setAttribute("data-theme-preference",p);root.style.setProperty("color-scheme",dark?"dark":"light");var meta=document.querySelector('meta[name="color-scheme"]');if(!meta){meta=document.createElement("meta");meta.setAttribute("name","color-scheme");document.head.appendChild(meta)}meta.setAttribute("content",dark?"dark":"light");}catch(e){}})();`;

export const THEME_STORAGE_KEY = "tb-theme";
