export class Stack {
	static readonly MAX_SIZE = 8;

	constructor(
		public readonly sp: number = 0,
		public readonly s: number[] = Array(Stack.MAX_SIZE).fill(0)
	) { }

	/** Pushes a new return‐address onto the stack */
	push(address: number): Stack {
		const newSP = (this.sp + 1) % Stack.MAX_SIZE;
		const newS = this.s.slice();
		newS[newSP] = address & 0xffff;
		return new Stack(newSP, newS);
	}

	/** Decrements SP (wraps around) */
	decSP(): Stack {
		const newSP = (this.sp + Stack.MAX_SIZE - 1) % Stack.MAX_SIZE;
		return new Stack(newSP, this.s);
	}

	/** The current return‐address (PC) */
	get PC(): number {
		return this.s[this.sp];
	}

	/** Overwrites the current PC slot */
	withPC(newPC: number): Stack {
		const newS = this.s.slice();
		newS[this.sp] = newPC & 0xffff;
		return new Stack(this.sp, newS);
	}

	/** Increments the stored PC by one */
	incPC(): Stack {
		const newS = this.s.slice();
		newS[this.sp] = ((this.s[this.sp] + 1) & 0xffff);
		return new Stack(this.sp, newS);
	}

	/** Hex‐dump of PC, whole stack and SP */
	toString(): string {
		const hex = (n: number, width: number) =>
			n.toString(16).padStart(width, '0');
		const pcStr = `0x${hex(this.PC, 4)}`;
		const stackStr = this.s.map(n => `0x${hex(n, 4)}`).join(', ');
		const spStr = `0x${hex(this.sp, 2)}`;
		return `PC:${pcStr} Stack(${stackStr}) sp:${spStr}`;
	}
}