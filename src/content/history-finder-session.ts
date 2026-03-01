import { fuzzyScore } from "../core/fuzzy.js";
import type { FinderEntry, HistoryListResponse } from "../shared/messages.js";
import {
  removeFinder,
  showFinder,
  updateFinderList,
} from "../ui/finder-modal.js";

export class HistoryFinderSession {
  private allItems: FinderEntry[] = [];
  private filtered: FinderEntry[] = [];
  private selectedIndex = 0;
  private onClose: (() => void) | null = null;

  async start(onClose: () => void): Promise<void> {
    this.onClose = onClose;

    const response: unknown = await browser.runtime.sendMessage({
      type: "history-list",
    });
    if (
      typeof response === "object" &&
      response !== null &&
      Array.isArray((response as Record<string, unknown>).history)
    ) {
      this.allItems = (response as HistoryListResponse).history;
    }
    this.filtered = this.allItems;

    showFinder("Search history...", {
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
      this.filtered = this.allItems;
    } else {
      this.filtered = this.allItems
        .map((item) => ({
          item,
          score: Math.max(
            fuzzyScore(query, item.title),
            fuzzyScore(query, item.url),
          ),
        }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((entry) => entry.item);
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
    const item = this.filtered[this.selectedIndex];
    if (item) {
      location.href = item.url;
    }
    this.destroy();
  }

  private updateList(): void {
    updateFinderList(this.filtered, this.selectedIndex);
  }

  destroy(): void {
    removeFinder();
    this.onClose?.();
  }
}
