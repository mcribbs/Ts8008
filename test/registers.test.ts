import { Registers, Register } from '../src/registers';

describe('Registers', () => {
	it('initializes all registers to 0', () => {
		const regs = new Registers();
		for (const r of [
			Register.A,
			Register.B,
			Register.C,
			Register.D,
			Register.E,
			Register.H,
			Register.L,
			Register.HL
		]) {
			expect(regs.getRegister(r)).toBe(0);
		}
	});

	it('withRegister returns a new instance with the updated register only', () => {
		const regs = new Registers();
		const regsA = regs.withRegister(Register.A, 0x7f);
		expect(regsA.getRegister(Register.A)).toBe(0x7f);
		// original still zero
		expect(regs.getRegister(Register.A)).toBe(0);

		const regsL = regsA.withRegister(Register.L, 0x99);
		expect(regsL.getRegister(Register.L)).toBe(0x99);
		// other registers unchanged
		expect(regsL.getRegister(Register.A)).toBe(0x7f);
	});

	it('HL getter composes H and L into a 16-bit value', () => {
		const partly = new Registers(0, 0, 0, 0, 0, 0x12, 0x34);
		expect(partly.HL).toBe(0x1234);
		// also via getRegister
		expect(partly.getRegister(Register.HL)).toBe(0x1234);
	});

	it('toString formats registers as hex strings', () => {
		const regs = new Registers(0x01, 0x02, 0x03, 0x04, 0x05, 0x0a, 0x0b);
		const str = regs.toString();
		// Should include each register label and two-hex-digit values
		expect(str).toContain('A:0x01');
		expect(str).toContain('B:0x02');
		expect(str).toContain('C:0x03');
		expect(str).toContain('D:0x04');
		expect(str).toContain('E:0x05');
		expect(str).toContain('H:0x0a');
		expect(str).toContain('L:0x0b');
		// HL should be four digits: 0x0a0b
		expect(str).toContain('HL:0x0a0b');
	});

	it('decodeRegister maps numbers 0–7 to the correct enum', () => {
		expect(Registers.decodeRegister(0)).toBe(Register.A);
		expect(Registers.decodeRegister(1)).toBe(Register.B);
		expect(Registers.decodeRegister(2)).toBe(Register.C);
		expect(Registers.decodeRegister(3)).toBe(Register.D);
		expect(Registers.decodeRegister(4)).toBe(Register.E);
		expect(Registers.decodeRegister(5)).toBe(Register.H);
		expect(Registers.decodeRegister(6)).toBe(Register.L);
		expect(Registers.decodeRegister(7)).toBe(Register.HL);
	});

	it('throws on invalid decodeRegister input', () => {
		expect(() => Registers.decodeRegister(8)).toThrow();
	});
});