const SCORE_CONSECUTIVE = 5;
const SCORE_START_BONUS = 10;
const SCORE_MATCH = 1;

export function fuzzyScore(query: string, target: string): number {
  if (query === "") return 0;

  const lowerQuery = query.toLowerCase();
  const lowerTarget = target.toLowerCase();
  let score = 0;
  let queryIndex = 0;
  let consecutive = 0;

  for (let i = 0; i < lowerTarget.length; i++) {
    if (queryIndex >= lowerQuery.length) break;

    if (lowerTarget[i] === lowerQuery[queryIndex]) {
      score += SCORE_MATCH;

      if (consecutive > 0) {
        score += SCORE_CONSECUTIVE;
      }

      if (i === 0 || lowerTarget[i - 1] === " " || lowerTarget[i - 1] === "/") {
        score += SCORE_START_BONUS;
      }

      consecutive++;
      queryIndex++;
    } else {
      consecutive = 0;
    }
  }

  if (queryIndex < lowerQuery.length) {
    return 0;
  }

  return score;
}
