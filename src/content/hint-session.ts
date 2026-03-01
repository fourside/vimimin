import { filterLabels } from "../core/hint-filter.js";
import { generateLabels } from "../core/hint-label.js";
import type { HintActionType } from "../shared/types.js";
import {
  highlightHintInput,
  removeHints,
  showHints,
  updateHintVisibility,
} from "../ui/hint-overlay.js";
import { executeHintAction } from "./actions/hint-actions.js";
import { collectHintTargets } from "./actions/hint-dom.js";

export class HintSession {
  private input = "";
  private labels: string[];
  private labelMap: Map<string, Element>;

  constructor(private readonly actionType: HintActionType) {
    const targets = collectHintTargets();
    this.labels = generateLabels(targets.length);
    this.labelMap = showHints(targets, this.labels);
  }

  feedKey(key: string): "continue" | "complete" | "cancel" {
    if (key.length !== 1) {
      return "continue";
    }

    this.input += key;
    const result = filterLabels(this.input, this.labels);

    switch (result.status) {
      case "matched": {
        const el = this.labelMap.get(result.label);
        this.destroy();
        if (el) {
          executeHintAction(this.actionType, el);
        }
        return "complete";
      }
      case "narrowed":
        updateHintVisibility(result.remaining);
        highlightHintInput(this.input);
        return "continue";
      case "none":
        this.destroy();
        return "cancel";
    }
  }

  destroy(): void {
    removeHints();
  }
}

const HINT_ACTION_PREFIX = "hint-";

export function parseHintActionType(actionName: string): HintActionType | null {
  if (!actionName.startsWith(HINT_ACTION_PREFIX)) return null;
  const type = actionName.slice(HINT_ACTION_PREFIX.length);
  switch (type) {
    case "click":
    case "new-tab":
    case "copy-url":
    case "copy-text":
    case "copy-markdown":
      return type;
    default:
      return null;
  }
}
