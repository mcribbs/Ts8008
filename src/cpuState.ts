import { Stack } from './stack';
import { Registers, Register } from './registers';
import { Flag, Flags } from './flags';
import { Memory } from './memory';

export interface CPUStateOpts {
	stack?: Stack;
	registers?: Registers;
	flags?: Flags;
	halt?: boolean;
	ram?: Memory;
}

export class CPUState {
	public readonly stack: Stack;
	public readonly registers: Registers;
	public readonly flags: Flags;
	public readonly halt: boolean;
	public readonly ram: Memory;

	constructor({
		stack = new Stack(),
		registers = new Registers(),
		flags = new Flags(),
		halt = false,
		ram = new Memory()
	}: CPUStateOpts = {}) {
		this.stack = stack;
		this.registers = registers;
		this.flags = flags;
		this.halt = halt;
		this.ram = ram;
	}

	get PC(): number {
		return this.stack.PC;
	}

	incrementPC(): CPUState {
		return this.copy({
			stack: this.stack.incPC()
		});
	}

	pushToStack(address: number): CPUState {
		return this.copy({
			stack: this.stack.push(address)
		});
	}

	decrementSP(): CPUState {
		return this.copy({
			stack: this.stack.decSP()
		});
	}

	withRegister(registerId: Register, value: number): CPUState {
		return this.copy({
			registers: this.registers.withRegister(registerId, value),
		});
	}

	getRegister(registerId: Register): number {
		return this.registers.getRegister(registerId);
	}

	writeByte(address: number, value: number): CPUState {
		return this.copy({
			ram: this.ram.writeByte(address, value)
		});
	}

	withFlag(flagId: Flag, value: boolean): CPUState {
		return this.copy({
			flags: this.flags.withFlag(flagId, value),
		});
	}

	/**
 * Return a new CPUState, overriding only the provided fields.
 */
	copy(opts: Partial<CPUStateOpts>): CPUState {
		return new CPUState({
			stack: opts.stack ?? this.stack,
			registers: opts.registers ?? this.registers,
			flags: opts.flags ?? this.flags,
			halt: opts.halt ?? this.halt,
			ram: opts.ram ?? this.ram,
		});
	}

	logState(): void {
		console.log(this.stack.toString());
		console.log(this.registers.toString());
		console.log(this.flags.toString());
		console.log('');
	}
}