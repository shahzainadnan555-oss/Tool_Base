import {
  binaryToBytes,
  bytesToBinary,
  bytesToHex,
  hexToBytes,
  utf8Decode,
  utf8Encode,
} from "./utils";

export function textToHex(text: string): string {
  if (!text) throw new Error("Please enter text to convert.");
  return bytesToHex(utf8Encode(text), " ");
}

export function hexToText(hex: string): string {
  return utf8Decode(hexToBytes(hex));
}

export function textToBinary(text: string): string {
  if (!text) throw new Error("Please enter text to convert.");
  return bytesToBinary(utf8Encode(text), " ");
}

export function binaryToText(binary: string): string {
  return utf8Decode(binaryToBytes(binary));
}

export function decimalToBinary(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Please enter a decimal number.");
  if (!/^-?\d+$/.test(trimmed)) {
    throw new Error("Enter a whole number (integer). Very large values are supported.");
  }
  const value = BigInt(trimmed);
  if (value < BigInt(0)) {
    throw new Error("This converter supports non-negative integers only.");
  }
  return value.toString(2);
}

export function binaryToDecimal(input: string): string {
  const cleaned = input.replace(/\s+/g, "");
  if (!cleaned) throw new Error("Please enter a binary number.");
  if (!/^[01]+$/.test(cleaned)) {
    throw new Error("Binary values may only contain 0 and 1.");
  }
  return BigInt(`0b${cleaned}`).toString(10);
}
