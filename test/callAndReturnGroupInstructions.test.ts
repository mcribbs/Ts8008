import { Memory } from '../src/memory';
import { CPU } from '../src/cpu';
import { Flag } from '../src/flags';

describe('Call and Return Group Instructions', () => {
	// helper to write little-endian addr
	const writeAddr = (ram: Memory, low: number, high: number) =>
		ram.writeByte(0x0001, low).writeByte(0x0002, high);

	it('CAL pushes the memory address B3...B3B2...B2 onto the stack and jumps', () => {
		let ram = new Memory().writeByte(0x0000, 0x46); // CAL opcode
		ram = writeAddr(ram, 0x04, 0x02);
		const cpu = new CPU(ram);
		const state = cpu.step();
		expect(state.PC).toBe(0x0204);
	});

	describe('CFC (CALL if Carry false)', () => {
		const opcode = 0x42;
		it('jumps when C=false', () => {
			let ram = new Memory().writeByte(0x0000, opcode);
			ram = writeAddr(ram, 0x04, 0x02);
			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.C, false) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0204);
		});
		it('does NOT jump when C=true', () => {
			let ram = new Memory().writeByte(0x0000, opcode);
			ram = writeAddr(ram, 0x04, 0x02);
			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.C, true) });
			const state = cpu.step();
			// 1-byte opcode + 2-byte operand = PC moves to 0x0003
			expect(state.PC).toBe(0x0003);
		});
	});

	describe('CFZ (CALL if Zero false)', () => {
		const opcode = 0x4A;
		it('jumps when Z=false', () => {
			let ram = new Memory().writeByte(0x0000, opcode);
			ram = writeAddr(ram, 0x04, 0x02);
			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.Z, false) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0204);
		});
		it('does NOT jump when Z=true', () => {
			let ram = new Memory().writeByte(0x0000, opcode);
			ram = writeAddr(ram, 0x04, 0x02);
			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.Z, true) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0003);
		});
	});

	describe('CFS (CALL if Sign false)', () => {
		const opcode = 0x52;
		it('jumps when S=false', () => {
			let ram = new Memory().writeByte(0x0000, opcode);
			ram = writeAddr(ram, 0x04, 0x02);
			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.S, false) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0204);
		});
		it('does NOT jump when S=true', () => {
			let ram = new Memory().writeByte(0x0000, opcode);
			ram = writeAddr(ram, 0x04, 0x02);
			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.S, true) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0003);
		});
	});

	describe('CFP (CALL if Parity false)', () => {
		const opcode = 0x5A;
		it('jumps when P=false', () => {
			let ram = new Memory().writeByte(0x0000, opcode);
			ram = writeAddr(ram, 0x04, 0x02);
			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.P, false) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0204);
		});
		it('does NOT jump when P=true', () => {
			let ram = new Memory().writeByte(0x0000, opcode);
			ram = writeAddr(ram, 0x04, 0x02);
			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.P, true) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0003);
		});
	});

	describe('CC (CALL if Carry true)', () => {
		const opcode = 0x62;
		it('jumps when C=true', () => {
			let ram = new Memory().writeByte(0x0000, opcode);
			ram = writeAddr(ram, 0x04, 0x02);
			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.C, true) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0204);
		});
		it('does NOT jump when C=false', () => {
			let ram = new Memory().writeByte(0x0000, opcode);
			ram = writeAddr(ram, 0x04, 0x02);
			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.C, false) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0003);
		});
	});

	describe('CZ (CALL if Zero true)', () => {
		const opcode = 0x6A;
		it('jumps when Z=true', () => {
			let ram = new Memory().writeByte(0x0000, opcode);
			ram = writeAddr(ram, 0x04, 0x02);
			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.Z, true) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0204);
		});
		it('does NOT jump when Z=false', () => {
			let ram = new Memory().writeByte(0x0000, opcode);
			ram = writeAddr(ram, 0x04, 0x02);
			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.Z, false) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0003);
		});
	});

	describe('CS (CALL if Sign true)', () => {
		const opcode = 0x72;
		it('jumps when S=true', () => {
			let ram = new Memory().writeByte(0x0000, opcode);
			ram = writeAddr(ram, 0x04, 0x02);
			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.S, true) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0204);
		});
		it('does NOT jump when S=false', () => {
			let ram = new Memory().writeByte(0x0000, opcode);
			ram = writeAddr(ram, 0x04, 0x02);
			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.S, false) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0003);
		});
	});

	describe('CP (CALL if Parity true)', () => {
		const opcode = 0x7A;
		it('jumps when P=true', () => {
			let ram = new Memory().writeByte(0x0000, opcode);
			ram = writeAddr(ram, 0x04, 0x02);
			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.P, true) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0204);
		});
		it('does NOT jump when P=false', () => {
			let ram = new Memory().writeByte(0x0000, opcode);
			ram = writeAddr(ram, 0x04, 0x02);
			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.P, false) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0003);
		});
	});

	describe('Return Group Instructions', () => {
		// helper to set up call+return sequence
		const setup = (retOpcode: number) => {
			let ram = new Memory()
				.writeByte(0x0000, 0x46)    // CAL opcode
				.writeByte(0x0001, 0x04)    // low byte of target
				.writeByte(0x0002, 0x02)    // high byte of target
				.writeByte(0x0204, retOpcode);
			const cpu = new CPU(ram);
			cpu.state = cpu.step();      // perform CAL, PC→0x0204
			return cpu;
		};

		describe('RFC (return if Carry false, opcode 0x03)', () => {
			it('pops and sets PC=0x0003 when C is false', () => {
				const cpu = setup(0x03);
				cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.C, false) });
				const state = cpu.step();   // RET
				expect(state.PC).toBe(0x0003);
			});

			it('skips RET (PC=0x0205) when C is true', () => {
				const cpu = setup(0x03);
				cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.C, true) });
				const state = cpu.step();   // RET skipped
				expect(state.PC).toBe(0x0205);
			});
		});

		describe('RFZ (return if Zero false, opcode 0x0B)', () => {
			it('pops when Z is false', () => {
				const cpu = setup(0x0B);
				cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.Z, false) });
				expect(cpu.step().PC).toBe(0x0003);
			});
			it('skips when Z is true', () => {
				const cpu = setup(0x0B);
				cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.Z, true) });
				expect(cpu.step().PC).toBe(0x0205);
			});
		});

		describe('RFS (return if Sign false, opcode 0x13)', () => {
			it('pops when S is false', () => {
				const cpu = setup(0x13);
				cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.S, false) });
				expect(cpu.step().PC).toBe(0x0003);
			});
			it('skips when S is true', () => {
				const cpu = setup(0x13);
				cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.S, true) });
				expect(cpu.step().PC).toBe(0x0205);
			});
		});

		describe('RFP (return if Parity false, opcode 0x1B)', () => {
			it('pops when P is false', () => {
				const cpu = setup(0x1B);
				cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.P, false) });
				expect(cpu.step().PC).toBe(0x0003);
			});
			it('skips when P is true', () => {
				const cpu = setup(0x1B);
				cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.P, true) });
				expect(cpu.step().PC).toBe(0x0205);
			});
		});

		describe('RC (return if Carry true, opcode 0x23)', () => {
			it('pops when C is true', () => {
				const cpu = setup(0x23);
				cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.C, true) });
				expect(cpu.step().PC).toBe(0x0003);
			});
			it('skips when C is false', () => {
				const cpu = setup(0x23);
				cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.C, false) });
				expect(cpu.step().PC).toBe(0x0205);
			});
		});

		describe('RZ (return if Zero true, opcode 0x2B)', () => {
			it('pops when Z is true', () => {
				const cpu = setup(0x2B);
				cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.Z, true) });
				expect(cpu.step().PC).toBe(0x0003);
			});
			it('skips when Z is false', () => {
				const cpu = setup(0x2B);
				cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.Z, false) });
				expect(cpu.step().PC).toBe(0x0205);
			});
		});

		describe('RS (return if Sign true, opcode 0x33)', () => {
			it('pops when S is true', () => {
				const cpu = setup(0x33);
				cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.S, true) });
				expect(cpu.step().PC).toBe(0x0003);
			});
			it('skips when S is false', () => {
				const cpu = setup(0x33);
				cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.S, false) });
				expect(cpu.step().PC).toBe(0x0205);
			});
		});

		describe('RP (return if Parity true, opcode 0x3B)', () => {
			it('pops when P is true', () => {
				const cpu = setup(0x3B);
				cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.P, true) });
				expect(cpu.step().PC).toBe(0x0003);
			});
			it('skips when P is false', () => {
				const cpu = setup(0x3B);
				cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.P, false) });
				expect(cpu.step().PC).toBe(0x0205);
			});
		});

		it('RST pushes PC and jumps to RST vector', () => {
			let ram = new Memory().writeByte(0x0000, 0x15); // RST opcode for AAA=0x00
			ram = ram.writeByte(0x0010, 0xFF);
			const cpu = new CPU(ram);
			const state = cpu.step();
			expect(state.PC).toBe(0x0010);
		});
	});
});
