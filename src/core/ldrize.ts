type Rect = { readonly top: number };

export function findItemIndex(
  rects: readonly Rect[],
  threshold: number,
  direction: "next" | "prev",
): number | undefined {
  if (direction === "next") {
    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i];
      if (rect && rect.top > threshold) {
        return i;
      }
    }
    return undefined;
  }

  for (let i = rects.length - 1; i >= 0; i--) {
    const rect = rects[i];
    if (rect && rect.top < -threshold) {
      return i;
    }
  }
  return undefined;
}
