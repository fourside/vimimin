const HINT_CHARS = "asdfghjkl";

export function generateLabels(count: number): string[] {
	if (count <= 0) return [];

	const base = HINT_CHARS.length;
	let length = 1;
	while (base ** length < count) {
		length++;
	}

	const labels: string[] = [];
	for (let i = 0; i < count; i++) {
		let label = "";
		let n = i;
		for (let j = 0; j < length; j++) {
			label = HINT_CHARS[n % base] + label;
			n = Math.floor(n / base);
		}
		labels.push(label);
	}

	return labels;
}
