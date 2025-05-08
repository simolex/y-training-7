class BitBuffer {
    constructor(fileReader) {
        this.fileReader = fileReader; // Источник данных (FileReader, fetch и т.д.)
        this.arrayBuffer = new ArrayBuffer(4); // Буфер 4 байта
        this.dataView = new DataView(this.arrayBuffer); // Для удобного доступа
        this.bitOffset = 0; // Текущее смещение в битах (0-31)
        this.eof = false; // Флаг конца данных
    }

    // Загружает данные в буфер (до 4 байтов)
    async loadBytes() {
        if (this.eof) return;

        // Если есть непрочитанные байты, сдвигаем их в начало
        if (this.bitOffset >= 8) {
            const bytesConsumed = Math.floor(this.bitOffset / 8);
            const bytesRemaining = 4 - bytesConsumed;

            // Создаем временный буфер для сдвига
            const temp = new Uint8Array(this.arrayBuffer);
            for (let i = 0; i < bytesRemaining; i++) {
                temp[i] = temp[i + bytesConsumed];
            }
            this.bitOffset %= 8;
        }

        // Дозагружаем новые байты
        const startPos = 4 - (this.bitOffset === 0 ? 0 : Math.ceil(this.bitOffset / 8));
        for (let i = startPos; i < 4 && !this.eof; i++) {
            try {
                const byte = await this.readNextByte();
                this.dataView.setUint8(i, byte);
            } catch (e) {
                this.eof = true;
                break;
            }
        }
    }

    // Чтение следующего байта (заглушка - реализуйте под ваш источник)
    readNextByte() {
        return new Promise((resolve, reject) => {
            // Реализация чтения байта из вашего источника данных
            // Например, через FileReader или fetch
            resolve(0); // Заглушка
        });
    }

    // Чтение битов (1-32)
    async readBits(numBits) {
        if (numBits < 1 || numBits > 32) {
            throw new Error("Can read only 1-32 bits at once");
        }

        // Проверяем, достаточно ли битов доступно
        const availableBits = 4 * 8 - this.bitOffset;
        if (availableBits < numBits) {
            await this.loadBytes();
            if (4 * 8 - this.bitOffset < numBits) {
                numBits = 4 * 8 - this.bitOffset;
                if (numBits <= 0) return null; // Нет данных
            }
        }

        // Получаем текущее 32-битное значение
        const value = this.dataView.getUint32(0, false); // Big-endian

        // Вычисляем маску и извлекаем биты
        const mask = numBits === 32 ? 0xffffffff : (1 << numBits) - 1;
        const bits = (value >>> (32 - this.bitOffset - numBits)) & mask;

        this.bitOffset += numBits;

        // Если прочитали все биты, сбрасываем буфер
        if (this.bitOffset >= 32) {
            this.bitOffset = 0;
            this.arrayBuffer = new ArrayBuffer(4);
            this.dataView = new DataView(this.arrayBuffer);
        }

        return bits;
    }

    // Пропуск битов
    async skipBits(numBits) {
        while (numBits > 0) {
            const available = 4 * 8 - this.bitOffset;
            const toSkip = Math.min(numBits, available);

            if (toSkip <= 0) {
                await this.loadBytes();
                if (this.bitOffset >= 32) break; // EOF
                continue;
            }

            this.bitOffset += toSkip;
            numBits -= toSkip;

            if (this.bitOffset >= 32) {
                this.bitOffset = 0;
                this.arrayBuffer = new ArrayBuffer(4);
                this.dataView = new DataView(this.arrayBuffer);
            }
        }
    }
}
