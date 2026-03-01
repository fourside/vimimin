import { fuzzyScore } from "../core/fuzzy.js";
import type { TabInfo, TabListResponse } from "../shared/messages.js";
import {
  removeFinder,
  showFinder,
  updateFinderList,
} from "../ui/finder-modal.js";

export class TabFinderSession {
  private allTabs: TabInfo[] = [];
  private filtered: TabInfo[] = [];
  private selectedIndex = 0;
  private onClose: (() => void) | null = null;

  async start(onClose: () => void): Promise<void> {
    this.onClose = onClose;

    const response: unknown = await browser.runtime.sendMessage({
      type: "tab-list",
    });
    if (
      typeof response === "object" &&
      response !== null &&
      Array.isArray((response as Record<string, unknown>).tabs)
    ) {
      this.allTabs = (response as TabListResponse).tabs;
    }
    this.filtered = this.allTabs;

    showFinder("Search tabs...", {
      onInput: (query) => this.filter(query),
      onSelect: () => this.select(),
      onMoveUp: () => this.moveUp(),
      onMoveDown: () => this.moveDown(),
      onDelete: () => this.deleteTab(),
      onClose: () => this.destroy(),
    });

    this.updateList();
  }

  private filter(query: string): void {
    if (query === "") {
      this.filtered = this.allTabs;
    } else {
      this.filtered = this.allTabs
        .map((tab) => ({
          tab,
          score: Math.max(
            fuzzyScore(query, tab.title),
            fuzzyScore(query, tab.url),
          ),
        }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((entry) => entry.tab);
    }
    this.selectedIndex = 0;
    this.updateList();
  }

  private moveUp(): void {
    if (this.filtered.length === 0) return;
    this.selectedIndex =
      (this.selectedIndex - 1 + this.filtered.length) % this.filtered.length;
    this.updateList();
  }

  private moveDown(): void {
    if (this.filtered.length === 0) return;
    this.selectedIndex = (this.selectedIndex + 1) % this.filtered.length;
    this.updateList();
  }

  private select(): void {
    const tab = this.filtered[this.selectedIndex];
    if (tab) {
      browser.runtime.sendMessage({ type: "tab-switch", tabId: tab.id });
    }
    this.destroy();
  }

  private deleteTab(): void {
    const tab = this.filtered[this.selectedIndex];
    if (!tab) return;

    browser.runtime.sendMessage({ type: "tab-close", tabId: tab.id });

    this.allTabs = this.allTabs.filter((t) => t.id !== tab.id);
    this.filtered = this.filtered.filter((t) => t.id !== tab.id);

    if (this.selectedIndex >= this.filtered.length) {
      this.selectedIndex = Math.max(0, this.filtered.length - 1);
    }
    this.updateList();
  }

  private updateList(): void {
    updateFinderList(this.filtered, this.selectedIndex);
  }

  destroy(): void {
    removeFinder();
    this.onClose?.();
  }
}
