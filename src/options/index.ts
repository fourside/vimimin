import { validateConfig } from "../core/config.js";

const textarea = document.getElementById("config") as HTMLTextAreaElement;
const saveButton = document.getElementById("save") as HTMLButtonElement;
const status = document.getElementById("status") as HTMLSpanElement;

function showStatus(message: string, type: "success" | "error"): void {
  status.textContent = message;
  status.className = type;
}

async function load(): Promise<void> {
  try {
    const stored = await browser.storage.local.get("userConfig");
    if (stored.userConfig) {
      textarea.value = JSON.stringify(stored.userConfig, null, 2);
    } else {
      textarea.value = "{}";
    }
  } catch {
    textarea.value = "{}";
  }
}

saveButton.addEventListener("click", async () => {
  try {
    const parsed: unknown = JSON.parse(textarea.value);
    const config = validateConfig(parsed);
    await browser.storage.local.set({ userConfig: config });
    textarea.value = JSON.stringify(config, null, 2);
    showStatus("Saved. Reload pages to apply.", "success");
  } catch (e) {
    showStatus(e instanceof Error ? e.message : "Invalid JSON", "error");
  }
});

load();
