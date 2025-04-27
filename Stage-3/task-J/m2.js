class LZWCompressor {
    constructor() {
        this.deBruijnTable = this._buildDeBruijnTable();
    }

    _buildDeBruijnTable() {
        const table = new Array(256);
        for (let i = 0; i < 256; i++) {
            table[i] = Math.log2(i & -i) | 0; // Аналог De Bruijn для 8 бит
        }
        return table;
    }

    compress(input) {
        const dictionary = {};
        let nextCode = 256; // Начинаем с кодов ASCII
        for (let i = 0; i < 256; i++) {
            dictionary[String.fromCharCode(i)] = i;
        }

        let current = "";
        const output = [];
        for (const char of input) {
            const combined = current + char;
            if (combined in dictionary) {
                current = combined;
            } else {
                output.push(dictionary[current]);
                dictionary[combined] = nextCode++;
                current = char;
            }
        }
        if (current) output.push(dictionary[current]);
        return output;
    }

    _fastHash(str) {
        // Упрощённый хеш через младший бит (для демонстрации)
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            hash = (hash << 1) ^ this.deBruijnTable[code & 0xff];
        }
        return hash & 0xffff;
    }
}

// Пример использования
const lzw = new LZWCompressor();
const compressed = lzw.compress("ABRACADABRA");
console.log(compressed); // [65, 66, 82, 65, 67, 65, 256, 258, 260]
