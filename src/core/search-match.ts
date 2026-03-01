type MatchRange = {
  start: number;
  length: number;
};

export function findMatches(query: string, text: string): MatchRange[] {
  if (query === "") return [];

  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();
  const ranges: MatchRange[] = [];
  let pos = 0;

  while (pos <= lowerText.length - lowerQuery.length) {
    const index = lowerText.indexOf(lowerQuery, pos);
    if (index === -1) break;
    ranges.push({ start: index, length: query.length });
    pos = index + 1;
  }

  return ranges;
}
