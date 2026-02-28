import { ActionRegistry } from "../core/action-registry.js";
import { defaultKeymap } from "../core/keymap.js";
import { registerScrollActions } from "./actions/scroll.js";
import { setupKeyListener } from "./keylistener.js";

const registry = new ActionRegistry();
registerScrollActions(registry);
setupKeyListener(defaultKeymap, registry);
