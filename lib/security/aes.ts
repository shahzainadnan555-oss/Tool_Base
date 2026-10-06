const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const cleaned = value.replace(/\s+/g, "");
  if (!cleaned) throw new Error("Please paste the encrypted payload.");
  try {
    const binary = atob(cleaned);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    throw new Error("Invalid encrypted payload.");
  }
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  if (!passphrase) throw new Error("Please enter a passphrase.");
  const material = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: 120_000,
      hash: "SHA-256",
    },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function aesEncrypt(plaintext: string, passphrase: string): Promise<string> {
  if (!plaintext) throw new Error("Please enter text to encrypt.");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(plaintext),
  );
  const packed = new Uint8Array(16 + 12 + cipher.byteLength);
  packed.set(salt, 0);
  packed.set(iv, 16);
  packed.set(new Uint8Array(cipher), 28);
  return `TB1.${bytesToBase64(packed)}`;
}

export async function aesDecrypt(payload: string, passphrase: string): Promise<string> {
  const raw = payload.trim();
  if (!raw.startsWith("TB1.")) {
    throw new Error("This payload is not a Tool Base AES package. Use output from AES Encrypt.");
  }
  const packed = base64ToBytes(raw.slice(4));
  if (packed.length < 29) throw new Error("Encrypted payload is incomplete.");
  const salt = packed.slice(0, 16);
  const iv = packed.slice(16, 28);
  const data = packed.slice(28);
  const key = await deriveKey(passphrase, salt);
  try {
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data,
    );
    return decoder.decode(plain);
  } catch {
    throw new Error("Decryption failed. Check the passphrase and payload.");
  }
}
