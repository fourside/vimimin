const LABEL_STYLE = [
  "position: fixed",
  "z-index: 2147483647",
  "padding: 1px 4px",
  "background: #f5d442",
  "color: #000",
  "font: bold 12px/1.2 monospace",
  "border: 1px solid #c4a71e",
  "border-radius: 3px",
  "text-transform: uppercase",
  "pointer-events: none",
].join(";");

const CONTAINER_ID = "vimimin-hint-container";

function getOrCreateContainer(): HTMLDivElement {
  let container = document.getElementById(
    CONTAINER_ID,
  ) as HTMLDivElement | null;
  if (!container) {
    container = document.createElement("div");
    container.id = CONTAINER_ID;
    container.style.cssText =
      "position: fixed; top: 0; left: 0; z-index: 2147483647; pointer-events: none;";
    document.documentElement.appendChild(container);
  }
  return container;
}

export function showHints(
  targets: Element[],
  labels: string[],
): Map<string, Element> {
  const container = getOrCreateContainer();
  const map = new Map<string, Element>();

  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    const label = labels[i];
    if (!target || !label) continue;

    const rect = target.getBoundingClientRect();
    const span = document.createElement("span");
    span.textContent = label;
    span.dataset.hintLabel = label;
    span.style.cssText = `${LABEL_STYLE};top:${rect.top}px;left:${rect.left}px;`;
    container.appendChild(span);
    map.set(label, target);
  }

  return map;
}

export function updateHintVisibility(activeLabels: readonly string[]): void {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) return;

  const activeSet = new Set(activeLabels);
  for (const span of container.children) {
    if (span instanceof HTMLElement) {
      const label = span.dataset.hintLabel;
      span.style.display = label && activeSet.has(label) ? "" : "none";
    }
  }
}

export function highlightHintInput(input: string): void {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) return;

  for (const span of container.children) {
    if (!(span instanceof HTMLElement)) continue;
    const label = span.dataset.hintLabel ?? "";
    if (label.startsWith(input) && input.length > 0) {
      const matched = label.slice(0, input.length);
      const rest = label.slice(input.length);
      span.textContent = "";
      const matchedSpan = document.createElement("span");
      matchedSpan.style.color = "#d44";
      matchedSpan.textContent = matched;
      span.appendChild(matchedSpan);
      span.append(rest);
    } else {
      span.textContent = label;
    }
  }
}

export function removeHints(): void {
  const container = document.getElementById(CONTAINER_ID);
  container?.remove();
}
