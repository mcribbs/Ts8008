import { Stack } from '../src/stack';

describe('Stack', () => {
	it('defaults to sp=0 and an all-zero stack', () => {
		const st = new Stack();
		expect(st.sp).toBe(0);
		expect(st.s.length).toBe(Stack.MAX_SIZE);
		for (const v of st.s) expect(v).toBe(0);
		expect(st.PC).toBe(0);
	});

	it('push increments sp and stores the address at the new SP', () => {
		const st = new Stack();
		const pushed = st.push(0x1234);
		expect(pushed.sp).toBe(1);
		expect(pushed.PC).toBe(0x1234);
		// original unchanged
		expect(st.sp).toBe(0);
		expect(st.PC).toBe(0);
	});

	it('decSP wraps SP backwards without touching data', () => {
		const st = new Stack();
		const dec = st.decSP();
		expect(dec.sp).toBe(7);
		expect(dec.s).toEqual(st.s);
	});

	it('withPC overwrites only the current PC slot', () => {
		const st = new Stack();
		const withPc = st.withPC(0x00ff);
		expect(withPc.sp).toBe(0);
		expect(withPc.PC).toBe(0x00ff);
		expect(st.PC).toBe(0);
	});

	it('incPC increments the stored PC value by one', () => {
		const base = new Stack();
		const inc = base.incPC();
		expect(inc.PC).toBe(1);
		expect(base.PC).toBe(0);
	});

	it('toString produces a formatted hex dump', () => {
		const custom = new Stack(1, [0x0001, 0x0002, 0, 0, 0, 0, 0, 0]);
		const str = custom.toString();
		expect(str).toContain('PC:0x0002');
		expect(str).toContain('Stack(0x0001, 0x0002');
		expect(str).toContain('sp:0x01');
	});
});