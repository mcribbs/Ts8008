// src/cpu.ts

import { CPUState } from './cpuState';
import { Instructions } from './instructions';
import { Memory } from './memory';

/**
 * 8008 CPU: implement only control-group instructions as per ControlGroupInstructionsTest
 */
export class CPU {
	public state: CPUState;

	constructor(ram: Memory) {
		this.state = new CPUState({ ram });
	}

	/**
	 * Execute one control-group instruction and advance state.
	 */
	step(): CPUState {
		const opcode = this.state.ram.readByte(this.state.PC);
		const t1 = this.state.incrementPC();
		const instr = new Instructions(t1);

		// Decode bits
		const d7 = (opcode & 0x80) >>> 7;
		const d6 = (opcode & 0x40) >>> 6;
		const d5 = (opcode & 0x20) >>> 5;
		const d4 = (opcode & 0x10) >>> 4;
		const d3 = (opcode & 0x08) >>> 3;
		const d2 = (opcode & 0x04) >>> 2;
		const d1 = (opcode & 0x02) >>> 1;
		const d0 = (opcode & 0x01) >>> 0;
		const aaa = (opcode & 0x38) >>> 3;

		let nextState: CPUState;

		// HLT: 00000000 or 11111111
		if ((d7 | d6 | d5 | d4 | d3 | d2 | d1) === 0 || opcode === 0xff) {
			nextState = instr.HLT();
		}

		else {
			throw new Error(`Opcode not implemented: 0x${opcode.toString(16)}`);
		}

		return nextState;
	}
}