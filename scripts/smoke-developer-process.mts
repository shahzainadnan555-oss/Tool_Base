import assert from "assert";
import { processDeveloperTool } from "../lib/developer/process";
import { getDeveloperToolConfig, developerToolSlugs } from "../lib/developer/configs";
import { developerTools } from "../lib/tools/developer-tools";
import {
  encodeBase64,
  decodeBase64,
  encodeHtmlEntities,
  encodeUrl,
  decodeUrl,
} from "../lib/developer/encode";
import { testRegexSafe, generateRegex } from "../lib/developer/regex";

async function main() {
  assert.equal(developerToolSlugs.length, 20);
  assert.equal(developerTools.length, 20);

  const json = `{
  "name": "ToolMyra",
  "tools": ["formatter", "validator", "minifier"],
  "active": true,
  "unicode": "یہ ایک ٹیسٹ ہے 🚀"
}`;

  const fmt = getDeveloperToolConfig("json-formatter")!;
  const formatted = await processDeveloperTool(fmt, json, { indent: "2" });
  assert.ok(formatted.output.includes("\n"));
  assert.ok(JSON.parse(formatted.output).name === "ToolMyra");

  const val = getDeveloperToolConfig("json-validator")!;
  const good = await processDeveloperTool(val, json);
  assert.equal(good.validation?.valid, true);
  const bad = await processDeveloperTool(val, "{bad");
  assert.equal(bad.validation?.valid, false);

  const mini = getDeveloperToolConfig("json-minifier")!;
  const minified = await processDeveloperTool(mini, json);
  assert.equal(minified.output, JSON.stringify(JSON.parse(json)));

  const html = getDeveloperToolConfig("html-formatter")!;
  const htmlOut = await processDeveloperTool(
    html,
    "<!DOCTYPE html><html><body><h1>Hello ToolMyra</h1></body></html>",
  );
  assert.ok(htmlOut.output.toLowerCase().includes("<html"));

  const css = getDeveloperToolConfig("css-formatter")!;
  const cssOut = await processDeveloperTool(css, "body{margin:0;padding:0;}");
  assert.ok(cssOut.output.includes("body"));

  const js = getDeveloperToolConfig("javascript-formatter")!;
  const jsOut = await processDeveloperTool(js, "const add=(a,b)=>{return a+b;}");
  assert.ok(jsOut.output.includes("const"));

  const xml = getDeveloperToolConfig("xml-formatter")!;
  const xmlOut = await processDeveloperTool(
    xml,
    '<root><item id="1">ToolMyra</item></root>',
  );
  assert.ok(xmlOut.output.includes("root"));

  const xmlVal = getDeveloperToolConfig("xml-validator")!;
  const xmlOk = await processDeveloperTool(xmlVal, "<root><item/></root>");
  assert.equal(xmlOk.validation?.valid, true);

  const sql = getDeveloperToolConfig("sql-formatter")!;
  const sqlOut = await processDeveloperTool(
    sql,
    "SELECT id, name FROM users WHERE active = true ORDER BY name;",
  );
  assert.ok(sqlOut.output.toUpperCase().includes("SELECT"));

  const b64 = encodeBase64("Hello ToolMyra 🚀");
  assert.equal(decodeBase64(b64), "Hello ToolMyra 🚀");

  assert.equal(
    encodeHtmlEntities("<div>Hello & welcome</div>"),
    "&lt;div&gt;Hello &amp; welcome&lt;/div&gt;",
  );
  assert.equal(encodeUrl("hello world"), "hello%20world");
  assert.equal(decodeUrl("%20"), " ");

  const gen = generateRegex({ template: "email" });
  assert.ok(gen.pattern.includes("@"));

  const regex = await testRegexSafe(
    "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
    "",
    "hi@toolmyra.com",
  );
  assert.equal(regex.matchCount, 1);

  // Keep stress pattern small in Node (no blob worker termination).
  const started = Date.now();
  const stress = await testRegexSafe("a+", "g", "aaa");
  assert.ok(Date.now() - started < 2000);
  assert.equal(stress.matchCount, 1);

  console.log("developer processor smoke OK");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
