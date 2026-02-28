type FilterResult =
	| { status: "narrowed"; remaining: string[] }
	| { status: "matched"; label: string }
	| { status: "none" };

export function filterLabels(
	input: string,
	labels: readonly string[],
): FilterResult {
	if (input === "") {
		return { status: "narrowed", remaining: [...labels] };
	}

	const remaining = labels.filter((label) => label.startsWith(input));

	if (remaining.length === 0) {
		return { status: "none" };
	}

	if (remaining.length === 1 && remaining[0] === input) {
		return { status: "matched", label: remaining[0] };
	}

	return { status: "narrowed", remaining };
}
