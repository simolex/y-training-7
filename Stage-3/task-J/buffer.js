class BitBuffer {
    constructor(fileReader) {
        this.fileReader = fileReader;
        this.buffer = 0; // 32-битное значение
        this.bitPosition = 0; // текущая позиция в битах (0-32)
        this.byteBuffer = new Uint8Array(4); // буфер для байтов
        this.bytesInBuffer = 0; // сколько байтов сейчас в буфере
        this.eof = false;
    }

    async loadBytes() {
        if (this.eof) return;

        // Сдвигаем оставшиеся байты в начало буфера
        if (this.bitPosition >= 8) {
            const bytesConsumed = Math.floor(this.bitPosition / 8);
            for (let i = 0; i < this.bytesInBuffer - bytesConsumed; i++) {
                this.byteBuffer[i] = this.byteBuffer[i + bytesConsumed];
            }
            this.bytesInBuffer -= bytesConsumed;
            this.bitPosition %= 8;
        }

        // Дозагружаем байты, пока не заполним 4 или не достигнем EOF
        while (this.bytesInBuffer < 4 && !this.eof) {
            try {
                const byte = await this.readNextByte();
                this.byteBuffer[this.bytesInBuffer++] = byte;
            } catch (e) {
                this.eof = true;
                break;
            }
        }

        this.updateUint32Buffer();
    }

    updateUint32Buffer() {
        this.buffer = 0;
        for (let i = 0; i < this.bytesInBuffer; i++) {
            this.buffer |= this.byteBuffer[i] << (24 - i * 8);
        }
    }

    async readBits(numBits) {
        if (numBits < 1 || numBits > 32) {
            throw new Error("Can only read between 1 and 32 bits at a time");
        }

        // Проверяем, достаточно ли битов в буфере
        const availableBits = this.bytesInBuffer * 8 - this.bitPosition;
        if (availableBits < numBits) {
            await this.loadBytes();
            if (this.bytesInBuffer * 8 - this.bitPosition < numBits) {
                numBits = this.bytesInBuffer * 8 - this.bitPosition;
                if (numBits <= 0) return null;
            }
        }

        const mask = numBits === 32 ? 0xffffffff : (1 << numBits) - 1;
        const bits = (this.buffer >>> (32 - this.bitPosition - numBits)) & mask;

        this.bitPosition += numBits;

        // Если прочитали все биты из текущего буфера
        if (this.bitPosition >= this.bytesInBuffer * 8) {
            this.buffer = 0;
            this.bitPosition = 0;
            this.bytesInBuffer = 0;
        }

        return bits;
    }
}
