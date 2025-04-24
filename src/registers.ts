/**
 * Which register to access
 */
export enum Register {
	A,
	B,
	C,
	D,
	E,
	H,
	L,
	HL
}

/**
 * Holds the 7 8-bit registers and computes the 16-bit HL pair.
 */
export class Registers {
	constructor(
		public readonly A: number = 0x00,
		public readonly B: number = 0x00,
		public readonly C: number = 0x00,
		public readonly D: number = 0x00,
		public readonly E: number = 0x00,
		public readonly H: number = 0x00,
		public readonly L: number = 0x00
	) {}

	/** Return a new Registers with one register updated */
	withRegister(registerId: Register, value: number): Registers {
    // mask to 8 bits
    const v = value & 0xff;
		switch (registerId) {
			case Register.A: return new Registers(v,   this.B, this.C, this.D, this.E, this.H, this.L);
			case Register.B: return new Registers(this.A, v,   this.C, this.D, this.E, this.H, this.L);
			case Register.C: return new Registers(this.A, this.B, v,   this.D, this.E, this.H, this.L);
			case Register.D: return new Registers(this.A, this.B, this.C, v,   this.E, this.H, this.L);
			case Register.E: return new Registers(this.A, this.B, this.C, this.D, v,   this.H, this.L);
			case Register.H: return new Registers(this.A, this.B, this.C, this.D, this.E, v,   this.L);
			case Register.L: return new Registers(this.A, this.B, this.C, this.D, this.E, this.H, v);
			default:           return this;
		}
	}

	/** Read one register (HL returns the combined pair) */
	getRegister(registerId: Register): number {
		switch (registerId) {
			case Register.A:  return this.A;
			case Register.B:  return this.B;
			case Register.C:  return this.C;
			case Register.D:  return this.D;
			case Register.E:  return this.E;
			case Register.H:  return this.H;
			case Register.L:  return this.L;
			case Register.HL: return this.HL;
			default: throw new Error(`Invalid register: ${registerId}`);
		}
	}

	/** 16-bit HL pair (H high-byte, L low-byte) */
	get HL(): number {
		return ((this.H << 8) + this.L) & 0xffff;
	}

	/** Hex-formatted dump of all registers */
	toString(): string {
		const hex = (n: number, w: number) => n.toString(16).padStart(w, '0');
		return [
			`A:0x${hex(this.A,2)}`, `B:0x${hex(this.B,2)}`,
			`C:0x${hex(this.C,2)}`, `D:0x${hex(this.D,2)}`,
			`E:0x${hex(this.E,2)}`, `H:0x${hex(this.H,2)}`,
			`L:0x${hex(this.L,2)}`, `HL:0x${hex(this.HL,4)}`
		].join(' ');
	}

	/** Decode a 3-bit value into a Register enum */
	static decodeRegister(r: number): Register {
		switch (r & 0xff) {
			case 0: return Register.A;
			case 1: return Register.B;
			case 2: return Register.C;
			case 3: return Register.D;
			case 4: return Register.E;
			case 5: return Register.H;
			case 6: return Register.L;
			case 7: return Register.HL;
			default: throw new Error(`Cannot decode register from: ${r}`);
		}
	}
}