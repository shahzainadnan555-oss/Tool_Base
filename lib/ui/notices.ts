/**
 * Hide implementation/runtime banners from normal tool UI.
 * Keep task-relevant notices (formats, limits, quality tradeoffs).
 */
const TECHNICAL_NOTICE =
  /\b(on[- ]device|browser[- ]based|client[- ]side|webassembly|\bwasm\b|web ?worker|worker processing|model loading|runtime loading|processed in your browser|processing in your browser|files stay on your device|local processing)\b/i;

export function isTechnicalNotice(text: string): boolean {
  return TECHNICAL_NOTICE.test(text);
}

export function filterUserFacingNotices(notices: string[]): string[] {
  return notices.filter((notice) => notice.trim() && !isTechnicalNotice(notice));
}
