class OptimizedLZW {
    constructor() {
        this.trie = new BinaryTrie();
        this.nextCode = 256;
        this._initDictionary();
    }

    _initDictionary() {
        for (let i = 0; i < 256; i++) {
            this.trie.insert(i.toString(2).padStart(8, "0"));
        }
    }

    compress(input) {
        let current = "";
        const output = [];
        for (const char of input) {
            const combined = current + char;
            const combinedBits = this._toBitString(combined);
            if (this.trie.search(combinedBits)) {
                current = combined;
            } else {
                output.push(this._toCode(current));
                this.trie.insert(combinedBits);
                current = char;
            }
        }
        if (current) output.push(this._toCode(current));
        return output;
    }

    _toBitString(str) {
        return Array.from(str)
            .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
            .join("");
    }

    _toCode(str) {
        return str.length === 1 ? str.charCodeAt(0) : 256 + this.trie._getKey(this._toBitString(str), 0);
    }
}

// Использование
const optimizer = new OptimizedLZW();
const result = optimizer.compress("TOBEORNOTTOBE");
console.log(result); // Аналогично стандартному LZW, но с битовой оптимизацией
