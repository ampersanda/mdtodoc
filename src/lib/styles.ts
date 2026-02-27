export interface TextStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  lineHeight: string;
}

export interface StyleConfig {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  h5: TextStyle;
  h6: TextStyle;
  paragraph: TextStyle;
}

export type StyleTarget = keyof StyleConfig;

export const DEFAULT_STYLES: StyleConfig = {
  h1: {
    fontFamily: "Arial",
    fontSize: "20pt",
    fontWeight: "bold",
    color: "#000000",
    lineHeight: "1.3",
  },
  h2: {
    fontFamily: "Arial",
    fontSize: "16pt",
    fontWeight: "bold",
    color: "#000000",
    lineHeight: "1.3",
  },
  h3: {
    fontFamily: "Arial",
    fontSize: "14pt",
    fontWeight: "bold",
    color: "#434343",
    lineHeight: "1.3",
  },
  h4: {
    fontFamily: "Arial",
    fontSize: "12pt",
    fontWeight: "bold",
    color: "#666666",
    lineHeight: "1.3",
  },
  h5: {
    fontFamily: "Arial",
    fontSize: "11pt",
    fontWeight: "bold",
    color: "#666666",
    lineHeight: "1.3",
  },
  h6: {
    fontFamily: "Arial",
    fontSize: "10pt",
    fontWeight: "bold",
    color: "#666666",
    lineHeight: "1.3",
  },
  paragraph: {
    fontFamily: "Arial",
    fontSize: "11pt",
    fontWeight: "normal",
    color: "#000000",
    lineHeight: "1.5",
  },
};

export function textStyleToCss(style: TextStyle): string {
  return [
    `font-family: ${style.fontFamily}, sans-serif`,
    `font-size: ${style.fontSize}`,
    `font-weight: ${style.fontWeight}`,
    `color: ${style.color}`,
    `line-height: ${style.lineHeight}`,
  ].join("; ");
}

export function linkCss(style: TextStyle): string {
  return [
    `font-family: ${style.fontFamily}, sans-serif`,
    `font-size: ${style.fontSize}`,
    "color: #1155cc",
    "text-decoration: underline",
  ].join("; ");
}

export function inlineCodeCss(): string {
  return [
    "font-family: Consolas, Monaco, 'Courier New', monospace",
    "font-size: 9pt",
    "background-color: #f0f0f0",
    "border: 1px solid #e0e0e0",
    "border-radius: 3px",
    "padding: 2px 4px",
    "color: #c7254e",
  ].join("; ");
}

export function hrCss(): string {
  return [
    "border: none",
    "border-top: 1px solid #cccccc",
    "margin: 1.5em 0",
  ].join("; ");
}

export function tableCss(): string {
  return [
    "border-collapse: collapse",
    "margin: 1em 0",
    "width: 100%",
  ].join("; ");
}

export function thCss(style: TextStyle): string {
  return [
    `font-family: ${style.fontFamily}, sans-serif`,
    `font-size: ${style.fontSize}`,
    "font-weight: bold",
    `color: ${style.color}`,
    "border: 1px solid #cccccc",
    "padding: 8px 12px",
    "background-color: #f5f5f5",
    "text-align: left",
  ].join("; ");
}

export function tdCss(style: TextStyle): string {
  return [
    `font-family: ${style.fontFamily}, sans-serif`,
    `font-size: ${style.fontSize}`,
    `color: ${style.color}`,
    "border: 1px solid #cccccc",
    "padding: 8px 12px",
    "text-align: left",
  ].join("; ");
}
