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

		// Jump group (d7,d6,d5,d4,d3,d2,d1,d0):
		//   case (0,1,_,_,_,1,0,0) => JMP
		else if (d7 === 0 && d6 === 1 && d2 === 1 && d1 === 0 && d0 === 0) {
			nextState = instr.JMP(true);
		}

		// JFC: (0,1,0,0,0,0,0,0) – jump if Carry false
		else if (d7 === 0 && d6 === 1 && d5 === 0 && d4 === 0 && d3 === 0 && d2 === 0 && d1 === 0 && d0 === 0) {
			nextState = instr.JMP(!t1.flags.carry);
		}

		// JFZ: (0,1,0,0,1,0,0,0) – jump if Zero false
		else if (d7 === 0 && d6 === 1 && d5 === 0 && d4 === 0 && d3 === 1 && d2 === 0 && d1 === 0 && d0 === 0) {
			nextState = instr.JMP(!t1.flags.zero);
		}

		// JFS: (0,1,0,1,0,0,0,0) – jump if Sign false
		else if (d7 === 0 && d6 === 1 && d5 === 0 && d4 === 1 && d3 === 0 && d2 === 0 && d1 === 0 && d0 === 0) {
			nextState = instr.JMP(!t1.flags.sign);
		}

		// JFP: (0,1,0,1,1,0,0,0) – jump if Parity false
		else if (d7 === 0 && d6 === 1 && d5 === 0 && d4 === 1 && d3 === 1 && d2 === 0 && d1 === 0 && d0 === 0) {
			nextState = instr.JMP(!t1.flags.parity);
		}

		// JC:  (0,1,1,0,0,0,0,0) – jump if Carry true
		else if (d7 === 0 && d6 === 1 && d5 === 1 && d4 === 0 && d3 === 0 && d2 === 0 && d1 === 0 && d0 === 0) {
			nextState = instr.JMP(t1.flags.carry);
		}

		// JZ:  (0,1,1,0,1,0,0,0) – jump if Zero true
		else if (d7 === 0 && d6 === 1 && d5 === 1 && d4 === 0 && d3 === 1 && d2 === 0 && d1 === 0 && d0 === 0) {
			nextState = instr.JMP(t1.flags.zero);
		}

		// JS:  (0,1,1,1,0,0,0,0) – jump if Sign true
		else if (d7 === 0 && d6 === 1 && d5 === 1 && d4 === 1 && d3 === 0 && d2 === 0 && d1 === 0 && d0 === 0) {
			nextState = instr.JMP(t1.flags.sign);
		}

		// JP:  (0,1,1,1,1,0,0,0) – jump if Parity true
		else if (d7 === 0 && d6 === 1 && d5 === 1 && d4 === 1 && d3 === 1 && d2 === 0 && d1 === 0 && d0 === 0) {
			nextState = instr.JMP(t1.flags.parity);
		}

		else {
			throw new Error(`Opcode not implemented: 0x${opcode.toString(16)}`);
		}

		return nextState;
	}
}