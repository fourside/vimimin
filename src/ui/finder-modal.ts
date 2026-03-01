const CONTAINER_ID = "vimimin-tab-finder";

const CONTAINER_STYLE = [
  "position: fixed",
  "top: 20%",
  "left: 50%",
  "transform: translateX(-50%)",
  "width: 500px",
  "max-height: 60vh",
  "z-index: 2147483647",
  "background: #1a1a2e",
  "border: 2px solid #e94560",
  "border-radius: 8px",
  "font: 14px/1.4 monospace",
  "color: #eee",
  "overflow: hidden",
  "box-shadow: 0 8px 32px rgba(0,0,0,0.5)",
].join(";");

const INPUT_STYLE = [
  "width: 100%",
  "box-sizing: border-box",
  "padding: 8px 12px",
  "background: #16213e",
  "border: none",
  "border-bottom: 1px solid #333",
  "outline: none",
  "color: #eee",
  "font: inherit",
].join(";");

const LIST_STYLE = [
  "max-height: calc(60vh - 40px)",
  "overflow-y: auto",
  "margin: 0",
  "padding: 0",
  "list-style: none",
].join(";");

type FinderCallbacks = {
  onInput(query: string): void;
  onSelect(): void;
  onMoveUp(): void;
  onMoveDown(): void;
  onClose(): void;
};

type FinderItem = {
  title: string;
  url: string;
  active?: boolean;
};

export function showFinder(
  placeholder: string,
  callbacks: FinderCallbacks,
): void {
  if (document.getElementById(CONTAINER_ID)) return;

  const container = document.createElement("div");
  container.id = CONTAINER_ID;
  container.style.cssText = CONTAINER_STYLE;

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = placeholder;
  input.style.cssText = INPUT_STYLE;
  container.appendChild(input);

  const list = document.createElement("ul");
  list.style.cssText = LIST_STYLE;
  container.appendChild(list);

  input.addEventListener("input", () => {
    callbacks.onInput(input.value);
  });

  input.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        callbacks.onSelect();
        break;
      case "Escape":
        e.preventDefault();
        callbacks.onClose();
        break;
      case "ArrowUp":
        e.preventDefault();
        callbacks.onMoveUp();
        break;
      case "ArrowDown":
        e.preventDefault();
        callbacks.onMoveDown();
        break;
      default:
        if (e.ctrlKey && e.key === "k") {
          e.preventDefault();
          callbacks.onMoveUp();
        } else if (e.ctrlKey && e.key === "j") {
          e.preventDefault();
          callbacks.onMoveDown();
        }
    }
  });

  document.documentElement.appendChild(container);
  input.focus();
}

export function updateFinderList(
  items: readonly FinderItem[],
  selectedIndex: number,
): void {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) return;
  const list = container.querySelector("ul");
  if (!list) return;

  list.replaceChildren();
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item) continue;
    const li = document.createElement("li");
    li.style.cssText = [
      "padding: 6px 12px",
      "cursor: pointer",
      "border-left: 3px solid transparent",
      i === selectedIndex
        ? "background: #16213e; border-left-color: #e94560"
        : "",
    ].join(";");

    const title = document.createElement("div");
    title.textContent = `${item.active ? "● " : "  "}${item.title}`;
    title.style.cssText =
      "white-space: nowrap; overflow: hidden; text-overflow: ellipsis;";
    li.appendChild(title);

    const url = document.createElement("div");
    url.textContent = item.url;
    url.style.cssText =
      "font-size: 11px; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;";
    li.appendChild(url);

    list.appendChild(li);
  }

  const selected = list.children[selectedIndex];
  if (selected instanceof HTMLElement) {
    selected.scrollIntoView({ block: "nearest" });
  }
}

export function removeFinder(): void {
  document.getElementById(CONTAINER_ID)?.remove();
}
