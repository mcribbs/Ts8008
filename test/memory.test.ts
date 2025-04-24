import { Memory } from '../src/memory';

describe('Memory', () => {
	it('reads and writes bytes correctly', () => {
		const mem = new Memory();
		const updated = mem.writeByte(0, 0x42);
		expect(updated.readByte(0)).toBe(0x42);
		// original is still zeroed (immutability)
		expect(mem.readByte(0)).toBe(0x00);
	});
});