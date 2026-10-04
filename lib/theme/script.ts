/** Inline boot script — applied before paint to avoid a light/dark flash. */
export const themeInitScript = `(function(){try{var k="tb-theme";var t=localStorage.getItem(k);var dark=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",dark);document.documentElement.dataset.theme=dark?"dark":"light";}catch(e){}})();`;

export const THEME_STORAGE_KEY = "tb-theme";
