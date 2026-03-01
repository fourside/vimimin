import { formatMarkdownLink } from "../../core/yank.js";
import type { HintActionType } from "../../shared/types.js";

function clickElement(el: Element): void {
  if (el instanceof HTMLElement) {
    el.click();
  }
}

function openInNewTab(el: Element): void {
  if (el instanceof HTMLAnchorElement && el.href) {
    window.open(el.href, "_blank", "noopener");
  } else {
    clickElement(el);
  }
}

function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text);
}

function getUrl(el: Element): string {
  if (el instanceof HTMLAnchorElement) {
    return el.href;
  }
  return window.location.href;
}

function getText(el: Element): string {
  return el.textContent?.trim() ?? "";
}

export function executeHintAction(
  actionType: HintActionType,
  el: Element,
): void {
  switch (actionType) {
    case "click":
      clickElement(el);
      break;
    case "new-tab":
      openInNewTab(el);
      break;
    case "copy-url":
      copyToClipboard(getUrl(el));
      break;
    case "copy-text":
      copyToClipboard(getText(el));
      break;
    case "copy-markdown": {
      const url = getUrl(el);
      const text = getText(el);
      copyToClipboard(formatMarkdownLink(text, url));
      break;
    }
  }
}
