import { Memory } from '../src/memory';
import { CPU } from '../src/cpu';
import { Register } from '../src/registers';

describe('Load Group Instructions', () => {
	it('LMI loads memory at HL with immediate data', () => {
		let ram = new Memory()
			.writeByte(0x0000, 0x3E)
			.writeByte(0x0001, 0x42);
		const cpu = new CPU(ram);
		cpu.state = cpu.state
			.withRegister(Register.H, 0x00)
			.withRegister(Register.L, 0x01);
		const state = cpu.step();
		expect(state.ram.readByte(0x0001)).toBe(0x42);
	});

	it('LrI loads A register with immediate data', () => {
		let ram = new Memory()
			.writeByte(0x0000, 0x06)
			.writeByte(0x0001, 0x42);
		const cpu = new CPU(ram);
		const state = cpu.step();
		expect(state.getRegister(Register.A)).toBe(0x42);
	});

	it('LMr writes A register contents to memory at HL', () => {
		let ram = new Memory().writeByte(0x0000, 0xF8);
		const cpu = new CPU(ram);
		cpu.state = cpu.state
			.withRegister(Register.A, 0x42)
			.withRegister(Register.H, 0x00)
			.withRegister(Register.L, 0x01);
		const state = cpu.step();
		expect(state.ram.readByte(0x0001)).toBe(0x42);
	});

	it('LrM loads A register with memory contents at HL', () => {
		let ram = new Memory()
			.writeByte(0x0000, 0xC7)
			.writeByte(0x0001, 0x42);
		const cpu = new CPU(ram);
		cpu.state = cpu.state
			.withRegister(Register.H, 0x00)
			.withRegister(Register.L, 0x01);
		const state = cpu.step();
		expect(state.getRegister(Register.A)).toBe(0x42);
	});

	it('Lr1r2 loads B register with contents of A register', () => {
		let ram = new Memory().writeByte(0x0000, 0xC8);
		const cpu = new CPU(ram);
		cpu.state = cpu.state.withRegister(Register.A, 0x42);
		const state = cpu.step();
		expect(state.getRegister(Register.B)).toBe(0x42);
	});
});
