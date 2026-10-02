import type { IndentStyle } from "./types";
import { indentUnit } from "./utils";

async function loadPrettier() {
  const prettier = await import("prettier/standalone");
  const [babel, estree, html, postcss] = await Promise.all([
    import("prettier/plugins/babel"),
    import("prettier/plugins/estree"),
    import("prettier/plugins/html"),
    import("prettier/plugins/postcss"),
  ]);
  return {
    prettier,
    plugins: [babel, estree, html, postcss],
  };
}

function tabWidth(indent: IndentStyle): { tabWidth: number; useTabs: boolean } {
  if (indent === "tab") return { tabWidth: 2, useTabs: true };
  return { tabWidth: Number(indent), useTabs: false };
}

export async function formatHtml(input: string, indent: IndentStyle = "2"): Promise<string> {
  if (!input.trim()) throw new Error("Please enter HTML to format.");
  const { prettier, plugins } = await loadPrettier();
  return prettier.format(input, {
    parser: "html",
    plugins,
    ...tabWidth(indent),
    printWidth: 100,
  });
}

export async function formatCss(input: string, indent: IndentStyle = "2"): Promise<string> {
  if (!input.trim()) throw new Error("Please enter CSS to format.");
  const { prettier, plugins } = await loadPrettier();
  return prettier.format(input, {
    parser: "css",
    plugins,
    ...tabWidth(indent),
    printWidth: 100,
  });
}

export async function formatJavaScript(
  input: string,
  indent: IndentStyle = "2",
): Promise<string> {
  if (!input.trim()) throw new Error("Please enter JavaScript to format.");
  const { prettier, plugins } = await loadPrettier();
  try {
    return await prettier.format(input, {
      parser: "babel",
      plugins,
      ...tabWidth(indent),
      printWidth: 100,
      semi: true,
      singleQuote: false,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to parse JavaScript.";
    throw new Error(message.split("\n")[0] || "Unable to parse JavaScript.");
  }
}

export async function minifyHtml(input: string): Promise<string> {
  if (!input.trim()) throw new Error("Please enter HTML to minify.");
  const { minify } = await import("html-minifier-terser");
  return minify(input, {
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeComments: true,
    minifyCSS: false,
    minifyJS: false,
    keepClosingSlash: true,
    caseSensitive: true,
  });
}

export async function minifyCss(input: string): Promise<string> {
  if (!input.trim()) throw new Error("Please enter CSS to minify.");
  const CleanCSS = (await import("clean-css")).default;
  const minifier = new CleanCSS({
    level: 1,
  });
  const result = minifier.minify(input);
  if (result.errors?.length) {
    throw new Error(result.errors[0] || "Unable to minify CSS.");
  }
  return result.styles;
}

export async function minifyJavaScript(input: string): Promise<string> {
  if (!input.trim()) throw new Error("Please enter JavaScript to minify.");
  const { minify } = await import("terser");
  const result = await minify(input, {
    compress: true,
    mangle: true,
    format: {
      comments: false,
    },
  });
  if (!result.code) {
    throw new Error("Unable to minify JavaScript.");
  }
  return result.code;
}

export { indentUnit };
