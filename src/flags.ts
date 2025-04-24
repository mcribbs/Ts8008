export enum Flag {
	C,
	Z,
	S,
	P
}

export class Flags {
	constructor(
		public readonly carry: boolean = false,
		public readonly zero: boolean = false,
		public readonly sign: boolean = false,
		public readonly parity: boolean = false
	) { }

	withFlag(flagId: Flag, value: boolean): Flags {
		switch (flagId) {
			case Flag.C:
				return new Flags(value, this.zero, this.sign, this.parity);
			case Flag.Z:
				return new Flags(this.carry, value, this.sign, this.parity);
			case Flag.S:
				return new Flags(this.carry, this.zero, value, this.parity);
			case Flag.P:
				return new Flags(this.carry, this.zero, this.sign, value);
		}
	}

	toString(): string {
		return `Flags(Carry:${this.carry} Zero:${this.zero} Sign:${this.sign} Parity:${this.parity})`;
	}

	static calcZSP(value: number): Flags {
		const z = value === 0;
		const s = (value & 0x80) === 0x80;
		const bitCount = value.toString(2).split('').filter(b => b === '1').length;
		const p = bitCount % 2 === 0;
		return new Flags(false, z, s, p);
	}
}