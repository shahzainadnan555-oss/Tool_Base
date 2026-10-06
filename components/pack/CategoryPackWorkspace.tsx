"use client";

import type { ToolDefinition } from "@/lib/tools/types";
import {
  BreathingPanel,
  ChecklistPanel,
  CoinPanel,
  CountdownPanel,
  DaysUntilPanel,
  DicePanel,
  FocusTimerPanel,
  IntervalTimerPanel,
  MarkdownPanel,
  MeetingCostPanel,
  NotepadPanel,
  PasswordStrengthPanel,
  PomodoroPanel,
  RandomPickerPanel,
  StopwatchPanel,
  TodoPanel,
  WeekNumberPanel,
  WheelPanel,
  WorkHoursPanel,
} from "./ProductivityPanels";
import {
  AsciiArtPanel,
  ButtonGenPanel,
  ClipPathPanel,
  ContrastPanel,
  FaviconPanel,
  FilterPanel,
  FlexboxPanel,
  GlassPanel,
  PaletteExtractPanel,
  PixelArtPanel,
  PlaceholderPanel,
  SocialSizePanel,
  SvgShapePanel,
  TextShadowPanel,
  TransformPanel,
} from "./CreativePanels";
import {
  AspectPanel,
  BarcodePanel,
  BatteryPanel,
  BrowserInfoPanel,
  DataUriPanel,
  DprPanel,
  FileSigPanel,
  HttpStatusPanel,
  KeyboardPanel,
  MimePanel,
  MousePanel,
  OnlinePanel,
  ScreenPanel,
  TtsPanel,
  UaParserPanel,
  UrlParserPanel,
  ViewportPanel,
} from "./UtilityPanels";

const PANELS: Record<string, () => React.ReactNode> = {
  "pomodoro-timer": () => <PomodoroPanel />,
  "focus-timer": () => <FocusTimerPanel />,
  stopwatch: () => <StopwatchPanel />,
  "countdown-timer": () => <CountdownPanel />,
  "online-notepad": () => <NotepadPanel />,
  "markdown-preview": () => <MarkdownPanel />,
  "todo-list": () => <TodoPanel />,
  "checklist-maker": () => <ChecklistPanel />,
  "dice-roller": () => <DicePanel />,
  "coin-flip": () => <CoinPanel />,
  "decision-wheel": () => <WheelPanel />,
  "days-until": () => <DaysUntilPanel />,
  "week-number": () => <WeekNumberPanel />,
  "work-hours-calculator": () => <WorkHoursPanel />,
  "meeting-cost-calculator": () => <MeetingCostPanel />,
  "interval-timer": () => <IntervalTimerPanel />,
  "breathing-timer": () => <BreathingPanel />,
  "password-strength-checker": () => <PasswordStrengthPanel />,
  "random-picker": () => <RandomPickerPanel />,
  "css-text-shadow-generator": () => <TextShadowPanel />,
  "css-clip-path-generator": () => <ClipPathPanel />,
  "favicon-generator": () => <FaviconPanel />,
  "social-media-image-size-generator": () => <SocialSizePanel />,
  "image-placeholder-generator": () => <PlaceholderPanel />,
  "pixel-art-generator": () => <PixelArtPanel />,
  "ascii-art-generator": () => <AsciiArtPanel />,
  "image-color-palette-extractor": () => <PaletteExtractPanel />,
  "svg-shape-generator": () => <SvgShapePanel />,
  "css-transform-generator": () => <TransformPanel />,
  "css-button-generator": () => <ButtonGenPanel />,
  "css-filter-generator": () => <FilterPanel />,
  "css-flexbox-generator": () => <FlexboxPanel />,
  "css-glassmorphism-generator": () => <GlassPanel />,
  "color-contrast-checker": () => <ContrastPanel />,
  "barcode-generator": () => <BarcodePanel />,
  "screen-resolution-checker": () => <ScreenPanel />,
  "viewport-size-checker": () => <ViewportPanel />,
  "device-pixel-ratio-checker": () => <DprPanel />,
  "browser-information-checker": () => <BrowserInfoPanel />,
  "user-agent-parser": () => <UaParserPanel />,
  "keyboard-tester": () => <KeyboardPanel />,
  "mouse-tester": () => <MousePanel />,
  "url-parser": () => <UrlParserPanel />,
  "data-uri-generator": () => <DataUriPanel />,
  "mime-type-checker": () => <MimePanel />,
  "file-signature-checker": () => <FileSigPanel />,
  "http-status-code-lookup": () => <HttpStatusPanel />,
  "battery-status-checker": () => <BatteryPanel />,
  "online-status-checker": () => <OnlinePanel />,
  "text-to-speech": () => <TtsPanel />,
  "aspect-ratio-calculator": () => <AspectPanel />,
};

export function CategoryPackWorkspace({
  tool,
}: {
  tool: ToolDefinition;
}) {
  const render = PANELS[tool.slug];
  return (
    <div className="space-y-6">
      {tool.convertHeading ? <h2 className="tm-h2">{tool.convertHeading}</h2> : null}
      {render ? render() : <p className="tm-notice tm-notice-error">This tool is unavailable.</p>}
    </div>
  );
}
