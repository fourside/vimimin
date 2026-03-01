function globToRegex(pattern: string): RegExp {
  const collapsed = pattern.replace(/\*{2,}/g, "*");
  const escaped = collapsed
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*");
  return new RegExp(`^${escaped}$`);
}

export function isBlacklisted(url: string, patterns: string[]): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  for (const pattern of patterns) {
    const hasPath = pattern.includes("/");
    const target = hasPath
      ? parsed.hostname + parsed.pathname
      : parsed.hostname;
    if (globToRegex(pattern).test(target)) {
      return true;
    }
  }
  return false;
}
