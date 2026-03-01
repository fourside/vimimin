const CONTAINER_ID = "vimimin-search-bar";
let cleanupClickOutside: (() => void) | null = null;

const CONTAINER_STYLE = [
  "position: fixed",
  "bottom: 0",
  "left: 0",
  "right: 0",
  "z-index: 2147483647",
  "background: #1a1a2e",
  "border-top: 2px solid #e94560",
  "padding: 4px 8px",
  "display: flex",
  "align-items: center",
  "font: 14px/1.4 monospace",
  "color: #eee",
].join(";");

const INPUT_STYLE = [
  "flex: 1",
  "background: transparent",
  "border: none",
  "outline: none",
  "color: #eee",
  "font: inherit",
  "margin-left: 4px",
].join(";");

type SearchBarCallbacks = {
  onInput(query: string): void;
  onNext(): void;
  onPrev(): void;
  onClose(): void;
};

export function showSearchBar(callbacks: SearchBarCallbacks): void {
  if (document.getElementById(CONTAINER_ID)) return;

  const container = document.createElement("div");
  container.id = CONTAINER_ID;
  container.style.cssText = CONTAINER_STYLE;

  const label = document.createElement("span");
  label.textContent = "/";
  container.appendChild(label);

  const input = document.createElement("input");
  input.type = "text";
  input.style.cssText = INPUT_STYLE;
  container.appendChild(input);

  const counter = document.createElement("span");
  counter.style.cssText = "margin-left: 8px; color: #aaa; font-size: 12px;";
  container.appendChild(counter);

  input.addEventListener("input", () => {
    callbacks.onInput(input.value);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      callbacks.onPrev();
    } else if (e.key === "Enter") {
      e.preventDefault();
      callbacks.onNext();
    } else if (e.key === "Escape") {
      e.preventDefault();
      callbacks.onClose();
    }
  });

  const onClickOutside = (e: MouseEvent) => {
    if (!container.contains(e.target as Node)) {
      callbacks.onClose();
    }
  };
  document.addEventListener("click", onClickOutside);
  cleanupClickOutside = () => {
    document.removeEventListener("click", onClickOutside);
  };

  document.documentElement.appendChild(container);
  input.focus();
}

export function updateSearchCount(current: number, total: number): void {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) return;
  const counter = container.querySelector("span:last-child");
  if (counter) {
    counter.textContent = total > 0 ? `${current}/${total}` : "";
  }
}

export function removeSearchBar(): void {
  document.getElementById(CONTAINER_ID)?.remove();
  cleanupClickOutside?.();
  cleanupClickOutside = null;
}
