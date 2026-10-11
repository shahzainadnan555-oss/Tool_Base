/**
 * Permanent Light Mode boot — runs before paint.
 * Clears legacy theme prefs and blocks OS/Safari auto-dark adaptations.
 */
export const themeInitScript = `(function(){try{var keys=["tb-theme","theme","color-theme","colorTheme","next-theme","chakra-ui-color-mode"];for(var i=0;i<keys.length;i++){try{localStorage.removeItem(keys[i])}catch(e){}}var root=document.documentElement;root.classList.remove("dark");root.classList.add("light");root.setAttribute("data-theme","light");root.removeAttribute("data-theme-preference");root.removeAttribute("data-theme-mobile-forced");root.style.colorScheme="only light";root.style.setProperty("color-scheme","only light");if(document.body){document.body.style.colorScheme="only light";document.body.style.setProperty("color-scheme","only light")}var meta=document.querySelector('meta[name="color-scheme"]');if(!meta){meta=document.createElement("meta");meta.setAttribute("name","color-scheme");document.head.appendChild(meta)}meta.setAttribute("content","light only");var supported=document.querySelector('meta[name="supported-color-schemes"]');if(!supported){supported=document.createElement("meta");supported.setAttribute("name","supported-color-schemes");document.head.appendChild(supported)}supported.setAttribute("content","light");}catch(e){}})();`;

/** Legacy key removed on boot. */
export const THEME_STORAGE_KEY = "tb-theme";
