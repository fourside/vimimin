type Action = () => void;

export class ActionRegistry {
	private actions = new Map<string, Action>();

	register(name: string, action: Action): void {
		this.actions.set(name, action);
	}

	get(name: string): Action | undefined {
		return this.actions.get(name);
	}

	has(name: string): boolean {
		return this.actions.has(name);
	}
}
