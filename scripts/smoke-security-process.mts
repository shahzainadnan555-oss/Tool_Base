import assert from "assert";
import { createHash } from "crypto";
import { processSecurityTool } from "../lib/security/process";
import { getSecurityToolConfig, securityToolSlugs } from "../lib/security/configs";
import { securityTools } from "../lib/tools/security-tools";
import { hashText } from "../lib/security/hash";
import { textToHex, hexToText, textToBinary, binaryToText, decimalToBinary, binaryToDecimal } from "../lib/security/convert";
import { encodeBase32, decodeBase32 } from "../lib/security/encode";
import { generateUuids, generatePassword } from "../lib/security/generate";
import { decodeJwt } from "../lib/security/jwt";
import { generateQr } from "../lib/security/qr";

async function main() {
  assert.equal(securityToolSlugs.length, 20);
  assert.equal(securityTools.length, 20);

  const sha256 = await hashText("abc", "SHA-256");
  assert.equal(
    sha256,
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
  );
  const md5 = await hashText("abc", "MD5");
  assert.equal(md5, "900150983cd24fb0d6963f7d28e17f72");
  const sha1 = await hashText("abc", "SHA-1");
  assert.equal(sha1, createHash("sha1").update("abc").digest("hex"));

  const uuids = generateUuids(3);
  assert.equal(uuids.length, 3);
  assert.match(uuids[0], /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

  const password = generatePassword({
    length: 16,
    includeUpper: true,
    includeLower: true,
    includeNumbers: true,
    includeSymbols: true,
  });
  assert.equal(password.length, 16);

  assert.equal(hexToText(textToHex("Hello")), "Hello");
  assert.equal(binaryToText(textToBinary("Hi")), "Hi");
  assert.equal(binaryToDecimal(decimalToBinary("42")), "42");
  assert.equal(decodeBase32(encodeBase32("ToolMyra")), "ToolMyra");
  assert.equal(hexToText(textToHex("اردو")), "اردو");

  // sample JWT header.payload.sig (unsigned dummy)
  const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ sub: "123", name: "ToolMyra" })).toString("base64url");
  const jwt = decodeJwt(`${header}.${payload}.signature`);
  assert.equal((jwt.payload as { name: string }).name, "ToolMyra");

  const qr = await generateQr({ text: "https://toolmyra.com" });
  assert.ok(qr.dataUrl.startsWith("data:image/png"));
  assert.ok(qr.svg.includes("<svg"));

  const cfg = getSecurityToolConfig("sha256-hash-generator")!;
  const hashed = await processSecurityTool(cfg, "abc");
  assert.equal(hashed.output, sha256);

  console.log("security processor smoke OK");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
