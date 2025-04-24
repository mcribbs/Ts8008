export class Memory {
	static readonly MAX_MEMORY = 16000;
	private readonly data: Uint8Array;

	constructor(data?: Uint8Array) {
		this.data = data ?? new Uint8Array(Memory.MAX_MEMORY);
		if (this.data.length !== Memory.MAX_MEMORY) {
			throw new Error(`Max supported memory is ${Memory.MAX_MEMORY} bytes`);
		}
	}

	writeByte(address: number, value: number): Memory {
		if (address < 0 || address >= this.data.length) {
			throw new RangeError(`Address out of bounds: ${address}`);
		}
		const newData = this.data.slice();
		newData[address] = value;
		return new Memory(newData);
	}

	readByte(address: number): number {
		if (address < 0 || address >= this.data.length) {
			throw new RangeError(`Address out of bounds: ${address}`);
		}
		return this.data[address];
	}

	readAddress(address: number): number {
    	// Little‑endian: low byte at address, high byte at address+1
		return ((this.data[address + 1] << 8) + this.data[address]);
	}

	logBytes(start: number, length: number): void {
		const end = Math.min(start + length, this.data.length);
		let line = "";
		for (let i = start; i < end; i++) {
			line += this.data[i].toString(16).padStart(2, "0") + " ";
			if ((i - start + 1) % 8 === 0) {
				console.log(line);
				line = "";
			}
		}
		if (line) console.log(line);
	}
}