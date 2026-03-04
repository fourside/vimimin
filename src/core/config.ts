import type { Mode } from "../shared/types.js";
import type { KeyBindings, Keymap } from "./keymap.js";
import type { Siteinfo } from "./siteinfo.js";

type UserConfig = {
  keymap?: Partial<Record<Mode, Record<string, string>>>;
  siteinfo?: Siteinfo[];
};

export function mergeKeymap(
  base: Keymap,
  overrides: UserConfig["keymap"],
): Keymap {
  if (!overrides) return base;

  const result = { ...base };
  for (const mode of Object.keys(overrides) as Mode[]) {
    const modeOverrides = overrides[mode];
    if (!modeOverrides) continue;
    const merged: KeyBindings = { ...base[mode] };
    for (const [key, action] of Object.entries(modeOverrides)) {
      if (action === "") {
        delete merged[key];
      } else {
        merged[key] = action;
      }
    }
    result[mode] = merged;
  }
  return result;
}

export function mergeSiteinfos(
  builtins: readonly Siteinfo[],
  user: Siteinfo[] | undefined,
): readonly Siteinfo[] {
  if (!user || user.length === 0) return builtins;

  const userPatterns = new Set(user.map((s) => s.pattern));
  const filtered = builtins.filter((s) => !userPatterns.has(s.pattern));
  return [...filtered, ...user];
}

export function validateConfig(value: unknown): UserConfig {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Config must be a JSON object");
  }

  const obj = value as Record<string, unknown>;
  const config: UserConfig = {};

  if ("keymap" in obj) {
    if (
      typeof obj.keymap !== "object" ||
      obj.keymap === null ||
      Array.isArray(obj.keymap)
    ) {
      throw new Error("keymap must be an object");
    }
    const keymapObj = obj.keymap as Record<string, unknown>;
    const validModes: Mode[] = ["normal", "insert", "hint", "search"];
    for (const key of Object.keys(keymapObj)) {
      if (!validModes.includes(key as Mode)) {
        throw new Error(`Invalid mode in keymap: ${key}`);
      }
      const bindings = keymapObj[key];
      if (
        typeof bindings !== "object" ||
        bindings === null ||
        Array.isArray(bindings)
      ) {
        throw new Error(`keymap.${key} must be an object`);
      }
      for (const [, action] of Object.entries(
        bindings as Record<string, unknown>,
      )) {
        if (typeof action !== "string") {
          throw new Error(`keymap values must be strings`);
        }
      }
    }
    config.keymap = obj.keymap as UserConfig["keymap"];
  }

  if ("siteinfo" in obj) {
    if (!Array.isArray(obj.siteinfo)) {
      throw new Error("siteinfo must be an array");
    }
    for (const item of obj.siteinfo) {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        throw new Error("Each siteinfo entry must be an object");
      }
      const entry = item as Record<string, unknown>;
      if (
        typeof entry.pattern !== "string" ||
        typeof entry.selector !== "string"
      ) {
        throw new Error(
          "Each siteinfo entry must have pattern and selector strings",
        );
      }
    }
    config.siteinfo = obj.siteinfo as Siteinfo[];
  }

  return config;
}
