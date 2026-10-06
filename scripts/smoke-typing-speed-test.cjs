/* eslint-disable no-console */
const assert = require("assert");

async function main() {
  const engine = await import("../lib/typing/engine.ts");
  const { searchTools } = await import("../lib/tools/search.ts");
  const { getToolBySlug } = await import("../lib/tools/registry.ts");

  const {
    buildTargetText,
    calcWpm,
    calcRawWpm,
    calcAccuracy,
    compareTyped,
    wordModeComplete,
    createSessionId,
  } = engine;

  assert.strictEqual(calcWpm(1500, 5 * 60000), 60);
  assert.strictEqual(calcRawWpm(1500, 5 * 60000), 60);
  assert.strictEqual(calcAccuracy(194, 200), 97);
  assert.deepStrictEqual(compareTyped("abc", "axc"), {
    correctChars: 2,
    incorrectChars: 1,
  });

  for (const count of [10, 25, 50, 100]) {
    const target = buildTargetText({
      mode: "words",
      timeLimit: 60,
      wordCount: count,
      punctuation: false,
      numbers: false,
    });
    assert.strictEqual(target.split(" ").length, count);
    assert.strictEqual(wordModeComplete(target, target, count), true);
    const short = target.split(" ").slice(0, -1).join(" ");
    assert.strictEqual(wordModeComplete(target, short, count), false);
  }

  for (const seconds of [15, 30, 60, 120]) {
    const target = buildTargetText({
      mode: "time",
      timeLimit: seconds,
      wordCount: 25,
      punctuation: true,
      numbers: true,
    });
    assert.ok(target.length > 20);
  }

  const sentence = buildTargetText({
    mode: "sentence",
    timeLimit: 60,
    wordCount: 25,
    punctuation: true,
    numbers: false,
  });
  assert.ok(sentence.includes("."));

  const ids = new Set(Array.from({ length: 20 }, () => createSessionId()));
  assert.ok(ids.size >= 18);

  const tool = getToolBySlug("typing-speed-test");
  assert.ok(tool);
  assert.strictEqual(tool.category, "typing-productivity");
  assert.strictEqual(tool.route, "/tools/typing-speed-test");
  assert.ok(tool.tipsHeading);

  for (const q of [
    "typing",
    "typing test",
    "typing speed",
    "wpm",
    "wpm test",
    "typing accuracy",
  ]) {
    const hits = searchTools(q);
    assert.ok(
      hits.some((r) => r.tool.slug === "typing-speed-test"),
      `search miss: ${q}`,
    );
  }

  console.log("smoke-typing-speed-test: OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
