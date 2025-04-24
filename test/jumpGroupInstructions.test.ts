import { Memory } from '../src/memory';
import { CPU } from '../src/cpu';
import { Flag } from '../src/flags';

describe('Jump Group Instructions', () => {
	it('JMP sets PC to immediate address regardless of flags', () => {
		let ram = new Memory();
		// Opcode 0x44 == JMP
		ram = ram.writeByte(0x0000, 0x44)
			.writeByte(0x0001, 0x04)
			.writeByte(0x0002, 0x02);

		const cpu = new CPU(ram);
		const state = cpu.step();
		expect(state.PC).toBe(0x0204);
	});

	describe('JFC (Jump if Carry false, opcode 0x40)', () => {
		const opcode = 0x40;
		it('jumps when carry flag is false', () => {
			let ram = new Memory();
			ram = ram.writeByte(0x0000, opcode)
				.writeByte(0x0001, 0x04)
				.writeByte(0x0002, 0x02);

			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.C, false) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0204);
		});

		it('does not jump when carry flag is true', () => {
			let ram = new Memory();
			ram = ram.writeByte(0x0000, opcode)
				.writeByte(0x0001, 0x04)
				.writeByte(0x0002, 0x02);

			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.C, true) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0003);
		});
	});

	describe('JFZ (Jump if Zero false, opcode 0x48)', () => {
		const opcode = 0x48;
		it('jumps when zero flag is false', () => {
			let ram = new Memory();
			ram = ram.writeByte(0x0000, opcode)
				.writeByte(0x0001, 0x04)
				.writeByte(0x0002, 0x02);

			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.Z, false) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0204);
		});

		it('does not jump when zero flag is true', () => {
			let ram = new Memory();
			ram = ram.writeByte(0x0000, opcode)
				.writeByte(0x0001, 0x04)
				.writeByte(0x0002, 0x02);

			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.Z, true) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0003);
		});
	});

	describe('JFS (Jump if Sign false, opcode 0x50)', () => {
		const opcode = 0x50;
		it('jumps when sign flag is false', () => {
			let ram = new Memory();
			ram = ram.writeByte(0x0000, opcode)
				.writeByte(0x0001, 0x04)
				.writeByte(0x0002, 0x02);

			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.S, false) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0204);
		});

		it('does not jump when sign flag is true', () => {
			let ram = new Memory();
			ram = ram.writeByte(0x0000, opcode)
				.writeByte(0x0001, 0x04)
				.writeByte(0x0002, 0x02);

			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.S, true) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0003);
		});
	});

	describe('JFP (Jump if Parity false, opcode 0x58)', () => {
		const opcode = 0x58;
		it('jumps when parity flag is false', () => {
			let ram = new Memory();
			ram = ram.writeByte(0x0000, opcode)
				.writeByte(0x0001, 0x04)
				.writeByte(0x0002, 0x02);

			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.P, false) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0204);
		});

		it('does not jump when parity flag is true', () => {
			let ram = new Memory();
			ram = ram.writeByte(0x0000, opcode)
				.writeByte(0x0001, 0x04)
				.writeByte(0x0002, 0x02);

			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.P, true) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0003);
		});
	});

	describe('JC (Jump if Carry true, opcode 0x60)', () => {
		const opcode = 0x60;
		it('jumps when carry flag is true', () => {
			let ram = new Memory();
			ram = ram.writeByte(0x0000, opcode)
				.writeByte(0x0001, 0x04)
				.writeByte(0x0002, 0x02);

			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.C, true) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0204);
		});

		it('does not jump when carry flag is false', () => {
			let ram = new Memory();
			ram = ram.writeByte(0x0000, opcode)
				.writeByte(0x0001, 0x04)
				.writeByte(0x0002, 0x02);

			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.C, false) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0003);
		});
	});

	describe('JZ (Jump if Zero true, opcode 0x68)', () => {
		const opcode = 0x68;
		it('jumps when zero flag is true', () => {
			let ram = new Memory();
			ram = ram.writeByte(0x0000, opcode)
				.writeByte(0x0001, 0x04)
				.writeByte(0x0002, 0x02)

			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.Z, true) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0204);
		});

		it('does not jump when zero flag is false', () => {
			let ram = new Memory();
			ram = ram.writeByte(0x0000, opcode)
				.writeByte(0x0001, 0x04)
				.writeByte(0x0002, 0x02);

			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.Z, false) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0003);
		});
	});

	describe('JS (Jump if Sign true, opcode 0x70)', () => {
		it('JS: sets PC to address if Sign is true', () => {
			let ram = new Memory()
				.writeByte(0x0000, 0x70)  // JS opcode
				.writeByte(0x0001, 0x04)  // low byte
				.writeByte(0x0002, 0x02); // high byte
			const cpu = new CPU(ram);
			// Force S flag = true
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.S, true) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0204);
		});

		it('JS: does NOT jump if Sign is false', () => {
			let ram = new Memory()
				.writeByte(0x0000, 0x70)
				.writeByte(0x0001, 0x04)
				.writeByte(0x0002, 0x02);
			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.S, false) });
			const state = cpu.step();
			// 1-byte opcode + 2-byte address => PC = 3
			expect(state.PC).toBe(0x0003);
		});
	});

	describe('JP (Jump if Parity true, opcode 0x78)', () => {
		// JP: Jump if Parity (opcode 0x78)
		it('JP: sets PC to address if Parity is true', () => {
			let ram = new Memory()
				.writeByte(0x0000, 0x78)  // JP opcode
				.writeByte(0x0001, 0x04)
				.writeByte(0x0002, 0x02);
			const cpu = new CPU(ram);
			// Force P flag = true
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.P, true) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0204);
		});

		it('JP: does NOT jump if Parity is false', () => {
			let ram = new Memory()
				.writeByte(0x0000, 0x78)
				.writeByte(0x0001, 0x04)
				.writeByte(0x0002, 0x02);
			const cpu = new CPU(ram);
			cpu.state = cpu.state.copy({ flags: cpu.state.flags.withFlag(Flag.P, false) });
			const state = cpu.step();
			expect(state.PC).toBe(0x0003);
		});
	});
});