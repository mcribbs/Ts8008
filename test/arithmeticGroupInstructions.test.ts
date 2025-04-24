// test/arithmeticGroupInstructions.test.ts

import { Memory } from '../src/memory';
import { CPU } from '../src/cpu';
import { Register } from '../src/registers';
import { Flag } from '../src/flags';

/**
 * Arithmetic Group Instructions Test Suite (A* opcodes)
 */
describe('Arithmetic Group Instructions (Axxx)', () => {
	it('ADM: Add memory[HL] to A and set flags', () => {
		const ram = new Memory()
			.writeByte(0x0000, 0x87)  // ADM opcode
			.writeByte(0x0001, 0x05);

		const cpu = new CPU(ram);
		cpu.state = cpu.state
			.withRegister(Register.A, 0xFF)
			.withRegister(Register.H, 0x00)
			.withRegister(Register.L, 0x01);

		const state = cpu.step();
		expect(state.getRegister(Register.A)).toBe(0x04);
		expect(state.flags.carry).toBe(true);
		expect(state.flags.zero).toBe(false);
		expect(state.flags.sign).toBe(false);
		expect(state.flags.parity).toBe(false);
	});

	it('ADI: Add immediate to A and set flags', () => {
		const ram = new Memory()
			.writeByte(0x0000, 0x04)  // ADI opcode
			.writeByte(0x0001, 0x05);

		const cpu = new CPU(ram);
		cpu.state = cpu.state.withRegister(Register.A, 0xFF);

		const state = cpu.step();
		expect(state.getRegister(Register.A)).toBe(0x04);
		expect(state.flags.carry).toBe(true);
		expect(state.flags.zero).toBe(false);
		expect(state.flags.sign).toBe(false);
		expect(state.flags.parity).toBe(false);
	});

	it('ADr: Add register B to A and set flags', () => {
		const ram = new Memory()
			.writeByte(0x0000, 0x81); // ADr B opcode

		const cpu = new CPU(ram);
		cpu.state = cpu.state
			.withRegister(Register.A, 0xFF)
			.withRegister(Register.B, 0x05);

		const state = cpu.step();
		expect(state.getRegister(Register.A)).toBe(0x04);
		expect(state.flags.carry).toBe(true);
		expect(state.flags.zero).toBe(false);
		expect(state.flags.sign).toBe(false);
		expect(state.flags.parity).toBe(false);
	});

	it('ACM: Add memory[HL] + carry to A and set flags', () => {
		const ram = new Memory()
			.writeByte(0x0000, 0x8F)  // ACM opcode
			.writeByte(0x0001, 0x05);

		const cpu = new CPU(ram);
		cpu.state = cpu.state
			.withRegister(Register.A, 0xFF)
			.withRegister(Register.H, 0x00)
			.withRegister(Register.L, 0x01)
			.copy({ flags: cpu.state.flags.withFlag(Flag.C, true) });

		const state = cpu.step();
		expect(state.getRegister(Register.A)).toBe(0x05);
		expect(state.flags.carry).toBe(true);
		expect(state.flags.zero).toBe(false);
		expect(state.flags.sign).toBe(false);
		expect(state.flags.parity).toBe(true);
	});

	it('ACI: Add immediate + carry to A and set flags', () => {
		const ram = new Memory()
			.writeByte(0x0000, 0x0C)  // ACI opcode
			.writeByte(0x0001, 0x05);

		const cpu = new CPU(ram);
		cpu.state = cpu.state
			.withRegister(Register.A, 0xFF)
			.copy({ flags: cpu.state.flags.withFlag(Flag.C, true) });

		const state = cpu.step();
		expect(state.getRegister(Register.A)).toBe(0x05);
		expect(state.flags.carry).toBe(true);
		expect(state.flags.zero).toBe(false);
		expect(state.flags.sign).toBe(false);
		expect(state.flags.parity).toBe(true);
	});

	it('ACr: Add register B + carry to A and set flags', () => {
		const ram = new Memory()
			.writeByte(0x0000, 0x89); // ACr B opcode

		const cpu = new CPU(ram);
		cpu.state = cpu.state
			.withRegister(Register.A, 0xFF)
			.withRegister(Register.B, 0x05)
			.copy({ flags: cpu.state.flags.withFlag(Flag.C, true) });

		const state = cpu.step();
		expect(state.getRegister(Register.A)).toBe(0x05);
		expect(state.flags.carry).toBe(true);
		expect(state.flags.zero).toBe(false);
		expect(state.flags.sign).toBe(false);
		expect(state.flags.parity).toBe(true);
	});

	it('SUM: Subtract memory[HL] from A and set flags', () => {
		const ram = new Memory()
			.writeByte(0x0000, 0x97)  // SUM opcode
			.writeByte(0x0001, 0x05);

		const cpu = new CPU(ram);
		cpu.state = cpu.state
			.withRegister(Register.A, 0xFF)
			.withRegister(Register.H, 0x00)
			.withRegister(Register.L, 0x01);

		const state = cpu.step();
		expect(state.getRegister(Register.A)).toBe(0xFA);
		expect(state.flags.carry).toBe(false);
		expect(state.flags.zero).toBe(false);
		expect(state.flags.sign).toBe(true);
		expect(state.flags.parity).toBe(true);
	});

	it('SUI: Subtract immediate from A and set flags', () => {
		const ram = new Memory()
			.writeByte(0x0000, 0x14)  // SUI opcode
			.writeByte(0x0001, 0x05);

		const cpu = new CPU(ram);
		cpu.state = cpu.state.withRegister(Register.A, 0xFF);

		const state = cpu.step();
		expect(state.getRegister(Register.A)).toBe(0xFA);
		expect(state.flags.carry).toBe(false);
		expect(state.flags.zero).toBe(false);
		expect(state.flags.sign).toBe(true);
		expect(state.flags.parity).toBe(true);
	});

	it('SUr: Subtract register B from A and set flags', () => {
		const ram = new Memory()
			.writeByte(0x0000, 0x91); // SUr B opcode

		const cpu = new CPU(ram);
		cpu.state = cpu.state
			.withRegister(Register.A, 0xFF)
			.withRegister(Register.B, 0x05);

		const state = cpu.step();
		expect(state.getRegister(Register.A)).toBe(0xFA);
		expect(state.flags.carry).toBe(false);
		expect(state.flags.zero).toBe(false);
		expect(state.flags.sign).toBe(true);
		expect(state.flags.parity).toBe(true);
	});

	it('SBM: Subtract memory[HL] + borrow from A and set flags', () => {
		const ram = new Memory()
			.writeByte(0x0000, 0x9F)  // SBM opcode
			.writeByte(0x0001, 0x05);

		const cpu = new CPU(ram);
		cpu.state = cpu.state
			.withRegister(Register.A, 0xFF)
			.withRegister(Register.H, 0x00)
			.withRegister(Register.L, 0x01)
			.copy({ flags: cpu.state.flags.withFlag(Flag.C, true) });

		const state = cpu.step();
		expect(state.getRegister(Register.A)).toBe(0xF9);
		expect(state.flags.carry).toBe(false);
		expect(state.flags.zero).toBe(false);
		expect(state.flags.sign).toBe(true);
		expect(state.flags.parity).toBe(true);
	});

	it('SBI: Subtract immediate + borrow from A and set flags', () => {
		const ram = new Memory()
			.writeByte(0x0000, 0x1C)  // SBI opcode
			.writeByte(0x0001, 0x05);

		const cpu = new CPU(ram);
		cpu.state = cpu.state
			.withRegister(Register.A, 0xFF)
			.copy({ flags: cpu.state.flags.withFlag(Flag.C, true) });

		const state = cpu.step();
		expect(state.getRegister(Register.A)).toBe(0xF9);
		expect(state.flags.carry).toBe(false);
		expect(state.flags.zero).toBe(false);
		expect(state.flags.sign).toBe(true);
		expect(state.flags.parity).toBe(true);
	});

	it('SBr: Subtract register B + borrow from A and set flags', () => {
		const ram = new Memory()
			.writeByte(0x0000, 0x99); // SBr B opcode

		const cpu = new CPU(ram);
		cpu.state = cpu.state
			.withRegister(Register.A, 0xFF)
			.withRegister(Register.B, 0x05)
			.copy({ flags: cpu.state.flags.withFlag(Flag.C, true) });

		const state = cpu.step();
		expect(state.getRegister(Register.A)).toBe(0xF9);
		expect(state.flags.carry).toBe(false);
		expect(state.flags.zero).toBe(false);
		expect(state.flags.sign).toBe(true);
		expect(state.flags.parity).toBe(true);
	});
});
