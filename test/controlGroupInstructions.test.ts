import { Memory } from '../src/memory';
import { CPU } from '../src/cpu';

describe('HLT (Control Group) instruction', () => {
	it('sets the halt flag to true for opcode 0x00', () => {
		// Create empty RAM and write 0x00 at address 0x0000
		let ram = new Memory();
		ram = ram.writeByte(0x0000, 0x00);

		const cpu = new CPU(ram);
		const state = cpu.step();

		expect(state.halt).toBe(true);
	});

	it('sets the halt flag to true for opcode 0xFF', () => {
		// Create empty RAM and write 0xFF at address 0x0000
		let ram = new Memory();
		ram = ram.writeByte(0x0000, 0xFF);

		const cpu = new CPU(ram);
		const state = cpu.step();

		expect(state.halt).toBe(true);
	});
});