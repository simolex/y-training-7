class TrieNode {
    constructor() {
        this.children = {};
        this.isEnd = false;
        this.code = -1; // Код для LZW
        this.frequency = 0; // Счетчик использования
        this.parent = null;
    }
}

class BitReader {
    constructor(fileArray) {
        this.fileArray = fileArray;
        this.offsetFile = 0;
        this.arrayBuffer = new ArrayBuffer(4); // Буфер 4 байта
        this.dataView = new DataView(this.arrayBuffer); // Для удобного доступа
        this.byteInBuffer = 0;
        this.bitOffset = 0; // Текущее смещение в битах (0-31)
        this.eof = fileArray.length === 0; // Флаг конца данных
    }

    // Загружает данные в буфер (до 4 байтов)
    loadBytes() {
        if (this.eof) return;

        // Если есть непрочитанные байты, сдвигаем их в начало
        if (this.bitOffset >= 8) {
            const bytesConsumed = Math.floor(this.bitOffset / 8);
            const bytesRemaining = 4 - bytesConsumed;
            this.byteInBuffer = bytesRemaining;

            // Создаем временный буфер для сдвига
            const temp = new Uint8Array(this.arrayBuffer);
            for (let i = 0; i < bytesRemaining; i++) {
                temp[i] = temp[i + bytesConsumed];
            }
            this.bitOffset %= 8;
        }

        // Дозагружаем новые байты
        const startPos = this.bitOffset === 0 ? 0 : Math.ceil(this.bitOffset / 8);
        for (let i = startPos; i < 4 && !this.eof; i++) {
            const byte = this.readNextByte();
            this.dataView.setUint8(i, byte);
            this.byteInBuffer++;
        }
    }

    // Чтение следующего байта (заглушка - реализуйте под ваш источник)
    readNextByte() {
        const byte = this.fileArray[this.offsetFile++];
        if (this.offsetFile === this.fileArray.length) {
            this.eof = true;
        }
        return byte;
    }

    // Чтение битов (1-32)
    readBits(numBits) {
        if (numBits < 1 || numBits > 32) {
            throw new Error("Can read only 1-32 bits at once");
        }

        // Проверяем, достаточно ли битов доступно
        const availableBits = 4 * 8 - this.bitOffset;
        if (availableBits < numBits || this.byteInBuffer === 0) {
            this.loadBytes();
            if (4 * 8 - this.bitOffset < numBits) {
                numBits = 4 * 8 - this.bitOffset;
                if (numBits <= 0) return null; // Нет данных
            }
        }

        // Получаем текущее 32-битное значение
        const value = this.dataView.getUint32(0, false); // Big-endian
        // console.log(value.toString(2));

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
}

class OptimizedLZW {
    constructor() {
        this.output = new Uint8Array(200000);
        this.buffer = new Uint32Array(1).fill(0);
        this.byteBuffer = this.reset();
    }

    _;

    _readTailSize(n, input) {
        this.pntByteOutput = 0;
        let maxReadByte = 0;
        while (this.pntByteOutput < n && maxReadByte < 4) {
            this.buffer[0] <<= 8;
            this.buffer[0] |= input[this.pntByteOutput] & 255;
            this.pntByteOutput++;
            maxReadByte++;
            // console.log(this.buffer[0]);
        }
        const tailMask = (0xe0 << ((maxReadByte - 1) * 8)) >>> 0;

        this.tailSize = (this.buffer[0] & tailMask) >>> (maxReadByte * 8 - 3);

        if (this.pntByteOutput == n) {
            this.lastBitOutput -= this.tailSize;
            this.buffer[0] >>>= (8 - this.tailSize) % 8;
            this.pntByteOutput++;
            // console.log(this.lastBitOutput, this.tailSize, maxReadByte, tailMask);
            // exit;
        }
    }

    _readData(n, input) {
        console.log(this.lastBitOutput);
        if (this.lastBitOutput === 1) {
            return [];
        }

        this.lastBitOutput -= this.sizePointer;
        let code = (this.buffer[0] >> this.lastBitOutput) & ((1 << this.sizePointer) - 1);

        let chrCode = -1;
        if (this.lastBitOutput !== 0) {
            this.lastBitOutput -= 5;
            chrCode = (this.buffer[0] >> this.lastBitOutput) & ((1 << 5) - 1);
        }

        // let maxReadByte = 0;
        while (this.pntByteOutput < n && this.lastBitOutput + 8 <= 32) {
            this.buffer[0] <<= 8;
            this.buffer[0] |= input[this.pntByteOutput] & 255;
            this.pntByteOutput++;
            this.lastBitOutput += 8;
        }

        if (this.pntByteOutput == n) {
            this.lastBitOutput -= this.tailSize;
            this.buffer[0] >>= (8 - this.tailSize) % 8;
        }

        return [code, chrCode];
    }

    _writeData(code, chr = "") {
        // console.log(">>", this.lastBitOutput);

        this.lastBitOutput -= this.sizePointer;
        let pointerCode = (code << this.lastBitOutput) >> 0;
        // console.log(pointerCode, this.buffer[0]);
        this.buffer[0] |= pointerCode;

        if (chr !== "") {
            this.lastBitOutput -= 5;
            let charCode = this.trie.children[chr].code << this.lastBitOutput;
            this.buffer[0] |= charCode << 0;
        }

        // console.log(this.lastBitOutput, this.buffer[0]);
        while (32 - this.lastBitOutput >= 8) {
            this.output[this.pntByteOutput++] = (this.buffer[0] & (255 << 24)) >> 24;
            this.buffer[0] <<= 8;
            this.lastBitOutput += 8;
        }

        if (chr === "" && this.lastBitOutput < 32) {
            this.output[this.pntByteOutput] = (this.buffer[0] & (255 << 24)) >> 24;
            this.buffer[0] <<= 8;
            // console.log(this.lastBitOutput, ((32 - this.lastBitOutput) << 5) & 255);
            this.output[0] |= ((32 - this.lastBitOutput) << 5) & 255;
        }
    }

    reset() {
        this.trie = new TrieNode();
        this.buffer.fill(0);
        this.output.fill(0);
        this.codesLZW = [];
        this.nextCode = 26;
        this.sizePointer = 5;
        this.initDictionary();
        this.pntByteOutput = 0;
        this.lastBitOutput = 29;
        this.totalByte = 0;
        // this.buffer = 0;
    }

    initDictionary() {
        let node = this.trie;
        for (let i = 97; i < 123; i++) {
            const letter = String.fromCharCode(i);
            node.children[letter] = new TrieNode();
            // node.children[letter].isEnd = true;
            node.children[letter].code = i - 97;
            node.children[letter].frequency = 1;
            // node.children[letter].parent = node;

            // this.codesLZW[i - 97] = node.children[letter];
        }
    }

    compress(input) {
        this.reset();
        const output = [];
        let pntInput = 0;

        while (pntInput < input.length) {
            let node = this.trie;
            let chr = input[pntInput++];
            let prev = null;
            while (pntInput < input.length && node.children[chr]) {
                node = node.children[chr];
                chr = input[pntInput++];
                prev = node;
            }
            if (pntInput === input.length && !prev) {
                this._writeData(node.children[chr].code);
                continue;
            }
            node.frequency++;
            node.children[chr] = new TrieNode();
            node.children[chr].code = this.nextCode;
            node.children[chr].frequency = 1;
            this.nextCode++;
            this._writeData(node.code, chr);
        }
        // console.log(this.pntByteOutput);
        return this.output.slice(0, this.pntByteOutput + 1);
    }

    decompress(compressed) {
        const result = [];

        this.reset();
        let n = compressed.length;
        const buffer = new BitReader(compressed);
        const tailSize = buffer.readBits(3);
        console.log(">>", tailSize);
        exit;
        // this._readTailSize(n, compressed);

        // console.log(this.buffer[0], this.lastBitOutput);

        const dict = [];

        // Обратный словарь (код -> строка)
        for (const key in this.trie.children) {
            dict[this.trie.children[key].code] = key;
        }

        let offset, chrCode, pair;
        while ((pair = this._readData(n, compressed)).length > 0) {
            console.log(pair);
            [offset, chrCode] = pair;
            const word = dict[offset] + chrCode >= 0 ? dict[chrCode] : "";
            if (chrCode >= 0) dict.push(word);
            result.push(word);
        }

        return result;
    }
}

const lzw = new OptimizedLZW();
// console.log(lzw);
const str = "ababab";
const compressed = lzw.compress(str);
console.log("Compressed:", compressed);
const decompressed = lzw.decompress(compressed);
console.log("Decompressed:", decompressed);
console.log("Match:", str === decompressed);
// console.dir(lzw.trie, { depth: 20 });

// // Пример сжатия и распаковки

// // Размер в битах (примерно)
// const originalSize = str.length * 8;
// const compressedSize = compressed.reduce((sum, code) => {
//     return sum + (code < 26 ? 5 : code < 256 ? 8 : 12); // 12 бит для кодов >255
// }, 0);

// console.log(`Original: ${originalSize} bits, Compressed: ${compressedSize} bits`);
// console.log(`Compression ratio: ${((compressedSize / originalSize) * 100).toFixed(1)}%`);
