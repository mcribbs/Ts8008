import { CPUState } from './cpuState';
import { Instructions } from './instructions';
import { Memory } from './memory';
import { Registers, Register } from './registers';

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
		// Extract the “ddd” destination register (bits 5–3) and “sss” source register (bits 2–0):
		const ddd: Register = Registers.decodeRegister((opcode & 0x38) >> 3);
		const sss: Register = Registers.decodeRegister(opcode & 0x07);

		let nextState: CPUState;

		// HLT: 00000000 or 11111111
		if (opcode === 0x00 || opcode === 0xff) {
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

		// Call and Return group

		// CAL unconditional: (0,1,_,_,_,1,1,0)
		else if (d7 === 0 && d6 === 1 && d2 === 1 && d1 === 1 && d0 === 0) {
			nextState = instr.CAL(true);
		}

		// CFC: (0,1,0,0,0,0,1,0) – CALL if Carry false
		else if (d7 === 0 && d6 === 1 && d5 === 0 && d4 === 0 && d3 === 0 && d2 === 0 && d1 === 1 && d0 === 0) {
			nextState = instr.CAL(!t1.flags.carry);
		}

		// CFZ: (0,1,0,0,1,0,1,0) – CALL if Zero false
		else if (d7 === 0 && d6 === 1 && d5 === 0 && d4 === 0 && d3 === 1 && d2 === 0 && d1 === 1 && d0 === 0) {
			nextState = instr.CAL(!t1.flags.zero);
		}

		// CFS: (0,1,0,1,0,0,1,0) – CALL if Sign false
		else if (d7 === 0 && d6 === 1 && d5 === 0 && d4 === 1 && d3 === 0 && d2 === 0 && d1 === 1 && d0 === 0) {
			nextState = instr.CAL(!t1.flags.sign);
		}

		// CFP: (0,1,0,1,1,0,1,0) – CALL if Parity false
		else if (d7 === 0 && d6 === 1 && d5 === 0 && d4 === 1 && d3 === 1 && d2 === 0 && d1 === 1 && d0 === 0) {
			nextState = instr.CAL(!t1.flags.parity);
		}

		// CC:  (0,1,1,0,0,0,1,0) – CALL if Carry true
		else if (d7 === 0 && d6 === 1 && d5 === 1 && d4 === 0 && d3 === 0 && d2 === 0 && d1 === 1 && d0 === 0) {
			nextState = instr.CAL(t1.flags.carry);
		}

		// CZ:  (0,1,1,0,1,0,1,0) – CALL if Zero true
		else if (d7 === 0 && d6 === 1 && d5 === 1 && d4 === 0 && d3 === 1 && d2 === 0 && d1 === 1 && d0 === 0) {
			nextState = instr.CAL(t1.flags.zero);
		}

		// CS:  (0,1,1,1,0,0,1,0) – CALL if Sign true
		else if (d7 === 0 && d6 === 1 && d5 === 1 && d4 === 1 && d3 === 0 && d2 === 0 && d1 === 1 && d0 === 0) {
			nextState = instr.CAL(t1.flags.sign);
		}

		// CP:  (0,1,1,1,1,0,1,0) – CALL if Parity true
		else if (d7 === 0 && d6 === 1 && d5 === 1 && d4 === 1 && d3 === 1 && d2 === 0 && d1 === 1 && d0 === 0) {
			nextState = instr.CAL(t1.flags.parity);
		}

		// RET unconditional: (0,0,_,_,_,1,1,1)
		else if (d7 === 0 && d6 === 0 && d2 === 1 && d1 === 1 && d0 === 1) {
			nextState = instr.RET(true);
		}

		// RFC: (0,0,0,0,0,0,1,1) – RET if Carry false
		else if (d7 === 0 && d6 === 0 && d5 === 0 && d4 === 0 && d3 === 0 && d2 === 0 && d1 === 1 && d0 === 1) {
			nextState = instr.RET(!t1.flags.carry);
		}

		// RFZ: (0,0,0,0,1,0,1,1) – RET if Zero false
		else if (d7 === 0 && d6 === 0 && d5 === 0 && d4 === 0 && d3 === 1 && d2 === 0 && d1 === 1 && d0 === 1) {
			nextState = instr.RET(!t1.flags.zero);
		}

		// RFS: (0,0,0,1,0,0,1,1) – RET if Sign false
		else if (d7 === 0 && d6 === 0 && d5 === 0 && d4 === 1 && d3 === 0 && d2 === 0 && d1 === 1 && d0 === 1) {
			nextState = instr.RET(!t1.flags.sign);
		}

		// RFP: (0,0,0,1,1,0,1,1) – RET if Parity false
		else if (d7 === 0 && d6 === 0 && d5 === 0 && d4 === 1 && d3 === 1 && d2 === 0 && d1 === 1 && d0 === 1) {
			nextState = instr.RET(!t1.flags.parity);
		}

		// RC:  (0,0,1,0,0,0,1,1) – RET if Carry true
		else if (d7 === 0 && d6 === 0 && d5 === 1 && d4 === 0 && d3 === 0 && d2 === 0 && d1 === 1 && d0 === 1) {
			nextState = instr.RET(t1.flags.carry);
		}

		// RZ:  (0,0,1,0,1,0,1,1) – RET if Zero true
		else if (d7 === 0 && d6 === 0 && d5 === 1 && d4 === 0 && d3 === 1 && d2 === 0 && d1 === 1 && d0 === 1) {
			nextState = instr.RET(t1.flags.zero);
		}

		// RS:  (0,0,1,1,0,0,1,1) – RET if Sign true
		else if (d7 === 0 && d6 === 0 && d5 === 1 && d4 === 1 && d3 === 0 && d2 === 0 && d1 === 1 && d0 === 1) {
			nextState = instr.RET(t1.flags.sign);
		}

		// RP:  (0,0,1,1,1,0,1,1) – RET if Parity true
		else if (d7 === 0 && d6 === 0 && d5 === 1 && d4 === 1 && d3 === 1 && d2 === 0 && d1 === 1 && d0 === 1) {
			nextState = instr.RET(t1.flags.parity);
		}

		// RST: (0,0,_,_,_,1,0,1) – RST aaa
		else if (d7 === 0 && d6 === 0 && d2 === 1 && d1 === 0 && d0 === 1) {
			nextState = instr.RST(aaa);
		}

		// --- Load group ---------------------------------------------

		// LdM: (1,1,_,_,_,1,1,1) — load register from memory[HL]
		else if (d7 === 1 && d6 === 1 && d2 === 1 && d1 === 1 && d0 === 1) {
			nextState = instr.LrM(ddd);
		}

		// LMs: (1,1,1,1,1,_,_,_) — store register to memory[HL]
		else if (d7 === 1 && d6 === 1 && d5 === 1 && d4 === 1 && d3 === 1) {
			nextState = instr.LMr(sss);
		}

		// Lds: (1,1,_,_,_,_,_,_) — copy register-to-register
		else if (d7 === 1 && d6 === 1) {
			nextState = instr.Lrr(ddd, sss);
		}

		// LMI: (0,0,1,1,1,1,1,0) — load immediate into memory[HL]
		else if (
			d7 === 0 && d6 === 0 &&
			d5 === 1 && d4 === 1 && d3 === 1 &&
			d2 === 1 && d1 === 1 && d0 === 0
		) {
			nextState = instr.LMI();
		}

		// LdI: (0,0,_,_,_,1,1,0) — load immediate into register
		else if (d7 === 0 && d6 === 0 && d2 === 1 && d1 === 1 && d0 === 0) {
			nextState = instr.LrI(ddd);
		}

		// --- Arithmetic group ---------------------------------------

		// ADM: (1,0,0,0,0,1,1,1)
		else if (
			d7 === 1 && d6 === 0 &&
			d5 === 0 && d4 === 0 && d3 === 0 &&
			d2 === 1 && d1 === 1 && d0 === 1
		) {
			nextState = instr.ADM();
		}

		// ADI: (0,0,0,0,0,1,0,0)
		else if (
			d7 === 0 && d6 === 0 &&
			d5 === 0 && d4 === 0 && d3 === 0 &&
			d2 === 1 && d1 === 0 && d0 === 0
		) {
			nextState = instr.ADI();
		}

		// ADs: (1,0,0,0,0,_,_,_)  — add register
		else if (d7 === 1 && d6 === 0 && d5 === 0 && d4 === 0 && d3 === 0) {
			nextState = instr.ADr(sss);
		}

		// ACM: (1,0,0,0,1,1,1,1)
		else if (
			d7 === 1 && d6 === 0 &&
			d5 === 0 && d4 === 0 && d3 === 1 &&
			d2 === 1 && d1 === 1 && d0 === 1
		) {
			nextState = instr.ACM();
		}

		// ACI: (0,0,0,0,1,1,0,0)
		else if (
			d7 === 0 && d6 === 0 &&
			d5 === 0 && d4 === 0 && d3 === 1 &&
			d2 === 1 && d1 === 0 && d0 === 0
		) {
			nextState = instr.ACI();
		}

		// ACs: (1,0,0,0,1,_,_,_)  — add-with-carry register
		else if (d7 === 1 && d6 === 0 && d5 === 0 && d4 === 0 && d3 === 1) {
			nextState = instr.ACr(sss);
		}

		// SUM: (1,0,0,1,0,1,1,1)
		else if (
			d7 === 1 && d6 === 0 &&
			d5 === 0 && d4 === 1 && d3 === 0 &&
			d2 === 1 && d1 === 1 && d0 === 1
		) {
			nextState = instr.SUM();
		}

		// SUI: (0,0,0,1,0,1,0,0)
		else if (
			d7 === 0 && d6 === 0 &&
			d5 === 0 && d4 === 1 && d3 === 0 &&
			d2 === 1 && d1 === 0 && d0 === 0
		) {
			nextState = instr.SUI();
		}

		// SUs: (1,0,0,1,0,_,_,_)  — subtract register
		else if (d7 === 1 && d6 === 0 && d5 === 0 && d4 === 1 && d3 === 0) {
			nextState = instr.SUr(sss);
		}

		// SBM: (1,0,0,1,1,1,1,1)
		else if (
			d7 === 1 && d6 === 0 &&
			d5 === 0 && d4 === 1 && d3 === 1 &&
			d2 === 1 && d1 === 1 && d0 === 1
		) {
			nextState = instr.SBM();
		}

		// SBI: (0,0,0,1,1,1,0,0)
		else if (
			d7 === 0 && d6 === 0 &&
			d5 === 0 && d4 === 1 && d3 === 1 &&
			d2 === 1 && d1 === 0 && d0 === 0
		) {
			nextState = instr.SBI();
		}

		// SBs: (1,0,0,1,1,_,_,_)  — subtract-with-borrow register
		else if (d7 === 1 && d6 === 0 && d5 === 0 && d4 === 1 && d3 === 1) {
			nextState = instr.SBr(sss);
		}

		// NDM: (1,0,1,0,0,1,1,1)
		else if (
			d7 === 1 && d6 === 0 &&
			d5 === 1 && d4 === 0 && d3 === 0 &&
			d2 === 1 && d1 === 1 && d0 === 1
		) {
			nextState = instr.NDM();
		}

		// NDI: (0,0,1,0,0,1,0,0)
		else if (
			d7 === 0 && d6 === 0 &&
			d5 === 1 && d4 === 0 && d3 === 0 &&
			d2 === 1 && d1 === 0 && d0 === 0
		) {
			nextState = instr.NDI();
		}

		// NDs: (1,0,1,0,0,_,_,_)  — AND register
		else if (d7 === 1 && d6 === 0 && d5 === 1 && d4 === 0 && d3 === 0) {
			nextState = instr.NDr(sss);
		}

		// XRM: (1,0,1,0,1,1,1,1)
		else if (
			d7 === 1 && d6 === 0 &&
			d5 === 1 && d4 === 0 && d3 === 1 &&
			d2 === 1 && d1 === 1 && d0 === 1
		) {
			nextState = instr.XRM();
		}

		// XRI: (0,0,1,0,1,1,0,0)
		else if (
			d7 === 0 && d6 === 0 &&
			d5 === 1 && d4 === 0 && d3 === 1 &&
			d2 === 1 && d1 === 0 && d0 === 0
		) {
			nextState = instr.XRI();
		}

		// XRs: (1,0,1,0,1,_,_,_)  — XOR register
		else if (d7 === 1 && d6 === 0 && d5 === 1 && d4 === 0 && d3 === 1) {
			nextState = instr.XRr(sss);
		}

		// ORM: (1,0,1,1,0,1,1,1)
		else if (
			d7 === 1 && d6 === 0 &&
			d5 === 1 && d4 === 1 && d3 === 0 &&
			d2 === 1 && d1 === 1 && d0 === 1
		) {
			nextState = instr.ORM();
		}

		// ORI: (0,0,1,1,0,1,0,0)
		else if (
			d7 === 0 && d6 === 0 &&
			d5 === 1 && d4 === 1 && d3 === 0 &&
			d2 === 1 && d1 === 0 && d0 === 0
		) {
			nextState = instr.ORI();
		}

		// ORs: (1,0,1,1,0,_,_,_)  — OR register
		else if (d7 === 1 && d6 === 0 && d5 === 1 && d4 === 1 && d3 === 0) {
			nextState = instr.ORr(sss);
		}

		// CPM: (1,0,1,1,1,1,1,1)
		else if (
			d7 === 1 && d6 === 0 &&
			d5 === 1 && d4 === 1 && d3 === 1 &&
			d2 === 1 && d1 === 1 && d0 === 1
		) {
			nextState = instr.CPM();
		}

		// CPI: (0,0,1,1,1,1,0,0)
		else if (
			d7 === 0 && d6 === 0 &&
			d5 === 1 && d4 === 1 && d3 === 1 &&
			d2 === 1 && d1 === 0 && d0 === 0
		) {
			nextState = instr.CPI();
		}

		// CPs: (1,0,1,1,1,_,_,_)  — compare register
		else if (d7 === 1 && d6 === 0 && d5 === 1 && d4 === 1 && d3 === 1) {
			nextState = instr.CPr(sss);
		}

		// INr: (0,0,_,_,_,0,0,0)  — increment register
		else if (d7 === 0 && d6 === 0 && d2 === 0 && d1 === 0 && d0 === 0) {
			nextState = instr.INr(ddd);
		}

		// DCr: (0,0,_,_,_,0,0,1)  — decrement register
		else if (d7 === 0 && d6 === 0 && d2 === 0 && d1 === 0 && d0 === 1) {
			nextState = instr.DCr(ddd);
		}

		// --- Rotate group ---------------------------------------

		// RLC: (0,0,0,0,0,1,1,1) → 0x07
		else if (
			d7 === 0 && d6 === 0 && d5 === 0 && d4 === 0 &&
			d3 === 0 && d2 === 1 && d1 === 1 && d0 === 1
		) {
			nextState = instr.RLC();
		}

		// RRC: (0,0,0,0,1,1,1,1) → 0x0F
		else if (
			d7 === 0 && d6 === 0 && d5 === 0 && d4 === 0 &&
			d3 === 1 && d2 === 1 && d1 === 1 && d0 === 1
		) {
			nextState = instr.RRC();
		}

		// RAL: (0,0,0,1,0,1,1,1) → 0x17
		else if (
			d7 === 0 && d6 === 0 && d5 === 0 && d4 === 1 &&
			d3 === 0 && d2 === 1 && d1 === 1 && d0 === 1
		) {
			nextState = instr.RAL();
		}

		// RAR: (0,0,0,1,1,1,1,1) → 0x1F
		else if (
			d7 === 0 && d6 === 0 && d5 === 0 && d4 === 1 &&
			d3 === 1 && d2 === 1 && d1 === 1 && d0 === 1
		) {
			nextState = instr.RAR();
		}


		else {
			throw new Error(`Opcode not implemented: 0x${opcode.toString(16)}`);
		}

		return nextState;
	}
}
