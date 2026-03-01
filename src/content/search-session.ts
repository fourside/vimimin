import {
  removeSearchBar,
  showSearchBar,
  updateSearchCount,
} from "../ui/search-bar.js";
import { SearchHighlighter } from "./actions/search-dom.js";

export class SearchSession {
  private highlighter = new SearchHighlighter();
  private currentIndex = 0;
  private onClose: (() => void) | null = null;

  start(onClose: () => void): void {
    this.onClose = onClose;
    showSearchBar({
      onInput: (query) => this.search(query),
      onNext: () => this.next(),
      onPrev: () => this.prev(),
      onClose: () => this.destroy(),
    });
  }

  private search(query: string): void {
    const total = this.highlighter.highlight(query);
    this.currentIndex = 0;
    if (total > 0) {
      this.highlighter.setCurrent(0);
    }
    updateSearchCount(total > 0 ? 1 : 0, total);
  }

  next(): void {
    if (this.highlighter.count === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.highlighter.count;
    this.highlighter.setCurrent(this.currentIndex);
    updateSearchCount(this.currentIndex + 1, this.highlighter.count);
  }

  prev(): void {
    if (this.highlighter.count === 0) return;
    this.currentIndex =
      (this.currentIndex - 1 + this.highlighter.count) % this.highlighter.count;
    this.highlighter.setCurrent(this.currentIndex);
    updateSearchCount(this.currentIndex + 1, this.highlighter.count);
  }

  destroy(): void {
    this.highlighter.clear();
    removeSearchBar();
    this.onClose?.();
  }
}
