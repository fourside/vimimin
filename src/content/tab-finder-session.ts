import { fuzzyScore } from "../core/fuzzy.js";
import type { TabInfo, TabListResponse } from "../shared/messages.js";
import {
  removeTabFinder,
  showTabFinder,
  type TabItem,
  updateTabList,
} from "../ui/tab-finder.js";

export class TabFinderSession {
  private allTabs: TabInfo[] = [];
  private filtered: TabInfo[] = [];
  private selectedIndex = 0;
  private onClose: (() => void) | null = null;

  async start(onClose: () => void): Promise<void> {
    this.onClose = onClose;

    const response = (await browser.runtime.sendMessage({
      type: "tab-list",
    })) as TabListResponse;
    this.allTabs = response.tabs;
    this.filtered = this.allTabs;

    showTabFinder({
      onInput: (query) => this.filter(query),
      onSelect: () => this.select(),
      onMoveUp: () => this.moveUp(),
      onMoveDown: () => this.moveDown(),
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

  private updateList(): void {
    const items: TabItem[] = this.filtered.map((t) => ({
      id: t.id,
      title: t.title,
      url: t.url,
      active: t.active,
    }));
    updateTabList(items, this.selectedIndex);
  }

  destroy(): void {
    removeTabFinder();
    this.onClose?.();
  }
}
