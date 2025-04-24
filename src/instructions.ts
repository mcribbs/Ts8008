// src/instructions.ts

import { CPUState } from './cpuState';
import { Register } from './registers';
import { Flags, Flag } from './flags';

type ALUFunc = (a: number, b: number) => [number, boolean];

export enum ADDRESSING_MODE {
	/** Memory‐addressed */
	M,
	/** Immediate (PC‐fetched) */
	I,
	/** Register */
	R
}

export class Instructions {
	constructor(private readonly state: CPUState) { }

	HLT(): CPUState {
		return this.state.copy({ halt: true });
	}

	JMP(test: boolean): CPUState {
		if (test) {
			const address = this.state.ram.readAddress(this.state.PC);
			return this.state.copy({
				stack: this.state.stack.withPC(address)
			});
		} else {
			return this.state.incrementPC().incrementPC();
		}
	}

	CAL(test: boolean): CPUState {
		if (test) {
			const address = this.state.ram.readAddress(this.state.PC);
			const afterFetch = this.state.incrementPC().incrementPC();
			return afterFetch.copy({
				stack: afterFetch.stack.push(address)
			});
		} else {
			return this.state.incrementPC().incrementPC();
		}
	}

	RET(test: boolean): CPUState {
		return test ? this.state.decrementSP() : this.state;
	}

	RST(aaa: number): CPUState {
		// aaa is 0–7 in the 8008 spec
		const addr = (aaa << 3) & 0xffff;
		return this.state.copy({
			stack: this.state.stack.push(addr)
		});
	}

	LMI(): CPUState {
		const data = this.state.ram.readByte(this.state.PC);
		return this.state
			.incrementPC()
			.writeByte(this.state.registers.HL, data);
	}

	INr(dest: Register): CPUState {
		const v = (this.state.getRegister(dest) + 1) & 0xff;
		return this.state
			.withRegister(dest, v)
			.copy({ flags: Flags.calcZSP(v) });
	}

	DCr(dest: Register): CPUState {
		const v = (this.state.getRegister(dest) - 1) & 0xff;
		return this.state.withRegister(dest, v);
	}

	LrI(dest: Register): CPUState {
		const data = this.state.ram.readByte(this.state.PC);
		return this.state.incrementPC().withRegister(dest, data);
	}

	LMr(source: Register): CPUState {
		const data = this.state.getRegister(source);
		return this.state.writeByte(this.state.registers.HL, data);
	}

	LrM(dest: Register): CPUState {
		const data = this.state.ram.readByte(this.state.registers.HL);
		return this.state.incrementPC().withRegister(dest, data);
	}

	Lrr(dest: Register, src: Register): CPUState {
		return this.state.withRegister(dest, this.state.getRegister(src));
	}

	// ===== ALU instructions =====

	private doALU(
		mode: ADDRESSING_MODE,
		src: Register,
		f: ALUFunc
	): CPUState {
		let data: number;
		let sState: CPUState;

		switch (mode) {
			case ADDRESSING_MODE.M:
				data = this.state.ram.readByte(this.state.registers.HL);
				sState = this.state.incrementPC();
				break;
			case ADDRESSING_MODE.I:
				data = this.state.ram.readByte(this.state.PC);
				sState = this.state.incrementPC();
				break;
			case ADDRESSING_MODE.R:
				data = this.state.getRegister(src);
				sState = this.state;
				break;
		}

		const [res, carry] = f(sState.getRegister(Register.A), data);
		return sState
			.withRegister(Register.A, res)
			.copy({
				flags: Flags.calcZSP(res).withFlag(Flag.C, carry)
			});
	}

	ADM(): CPUState { return this.doALU(ADDRESSING_MODE.M, Register.A, this.add); }
	ADI(): CPUState { return this.doALU(ADDRESSING_MODE.I, Register.A, this.add); }
	ADr(r: Register): CPUState { return this.doALU(ADDRESSING_MODE.R, r, this.add); }

	ACM(): CPUState {
		return this.doALU(ADDRESSING_MODE.M, Register.A, this.addWithCarry);
	}
	ACI(): CPUState {
		return this.doALU(ADDRESSING_MODE.I, Register.A, this.addWithCarry);
	}
	ACr(r: Register): CPUState {
		return this.doALU(ADDRESSING_MODE.R, r, this.addWithCarry);
	}

	SUM(): CPUState { return this.doALU(ADDRESSING_MODE.M, Register.A, this.subtract); }
	SUI(): CPUState { return this.doALU(ADDRESSING_MODE.I, Register.A, this.subtract); }
	SUr(r: Register): CPUState { return this.doALU(ADDRESSING_MODE.R, r, this.subtract); }

	SBM(): CPUState {
		return this.doALU(ADDRESSING_MODE.M, Register.A, this.subtractWithBorrow);
	}
	SBI(): CPUState {
		return this.doALU(ADDRESSING_MODE.I, Register.A, this.subtractWithBorrow);
	}
	SBr(r: Register): CPUState {
		return this.doALU(ADDRESSING_MODE.R, r, this.subtractWithBorrow);
	}

	NDM(): CPUState { return this.doALU(ADDRESSING_MODE.M, Register.A, (a, b) => [(a & b), false]); }
	NDI(): CPUState { return this.doALU(ADDRESSING_MODE.I, Register.A, (a, b) => [(a & b), false]); }
	NDr(r: Register): CPUState { return this.doALU(ADDRESSING_MODE.R, r, (a, b) => [(a & b), false]); }

	XRM(): CPUState { return this.doALU(ADDRESSING_MODE.M, Register.A, (a, b) => [(a ^ b), false]); }
	XRI(): CPUState { return this.doALU(ADDRESSING_MODE.I, Register.A, (a, b) => [(a ^ b), false]); }
	XRr(r: Register): CPUState { return this.doALU(ADDRESSING_MODE.R, r, (a, b) => [(a ^ b), false]); }

	ORM(): CPUState { return this.doALU(ADDRESSING_MODE.M, Register.A, (a, b) => [(a | b), false]); }
	ORI(): CPUState { return this.doALU(ADDRESSING_MODE.I, Register.A, (a, b) => [(a | b), false]); }
	ORr(r: Register): CPUState { return this.doALU(ADDRESSING_MODE.R, r, (a, b) => [(a | b), false]); }

	CPM(): CPUState { return this.doALU(ADDRESSING_MODE.M, Register.A, this.compare); }
	CPI(): CPUState { return this.doALU(ADDRESSING_MODE.I, Register.A, this.compare); }
	CPr(r: Register): CPUState { return this.doALU(ADDRESSING_MODE.R, r, this.compare); }

	RLC(): CPUState {
		const a = this.state.getRegister(Register.A);
		const shifted = ((a << 1) & 0xff) | (a > 0x7f ? 1 : 0);
		const c = a > 0x7f;
		return this.state
			.withRegister(Register.A, shifted)
			.copy({ flags: this.state.flags.withFlag(Flag.C, c) });
	}

	RRC(): CPUState {
		const a = this.state.getRegister(Register.A);
		const c = (a & 0x01) !== 0;
		const shifted = ((a >>> 1) & 0xff) | (c ? 0x80 : 0);
		return this.state
			.withRegister(Register.A, shifted)
			.copy({ flags: this.state.flags.withFlag(Flag.C, c) });
	}

	RAL(): CPUState {
		const a = this.state.getRegister(Register.A);
		const cIn = this.state.flags.carry ? 1 : 0;
		const shifted = ((a << 1) | cIn) & 0xff;
		const cOut = a > 0x7f;
		return this.state
			.withRegister(Register.A, shifted)
			.copy({ flags: this.state.flags.withFlag(Flag.C, cOut) });
	}

	RAR(): CPUState {
		const a = this.state.getRegister(Register.A);
		const cIn = this.state.flags.carry ? 1 : 0;
		const cOut = (a & 0x01) !== 0;
		const shifted = ((a >>> 1) | (cIn << 7)) & 0xff;
		return this.state
			.withRegister(Register.A, shifted)
			.copy({ flags: this.state.flags.withFlag(Flag.C, cOut) });
	}

	private add(a: number, b: number): [number, boolean] {
		const sum = a + b;
		return [sum & 0xff, sum > 0xff];
	}

	private addWithCarry(a: number, b: number): [number, boolean] {
		const sum = a + b + (this.state.flags.carry ? 1 : 0);
		return [sum & 0xff, sum > 0xff];
	}

	private subtract(a: number, b: number): [number, boolean] {
		const diff = a - b;
		return [diff & 0xff, a < b];
	}

	private subtractWithBorrow(a: number, b: number): [number, boolean] {
		const borrow = this.state.flags.carry ? 1 : 0;
		const diff = a - b - borrow;
		return [diff & 0xff, a < b + borrow];
	}

	private compare(a: number, b: number): [number, boolean] {
		const diff = a - b;
		return [a, a < b];
	}
}