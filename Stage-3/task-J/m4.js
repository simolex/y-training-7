class FrequencyBinaryTrieNode {
    constructor() {
        this.children = {};
        this.isEnd = false;
        this.frequency = 0; // Счетчик использования
        this.code = -1; // Код для LZW
    }
}

class OptimizedLZWWithPruning {
    constructor(maxDictSize = 4096) {
        this.trie = new FrequencyBinaryTrieNode();
        this.nextCode = 26;
        this.maxDictSize = maxDictSize;
        this._initDictionary();
        this.currentSize = 26; // Начальный размер словаря
    }

    _initDictionary() {
        // Заполняем Trie ASCII-символами
        for (let i = 97; i < 123; i++) {
            const bits = i.toString(2).padStart(8, "0");
            let node = this.trie;
            for (const bit of bits) {
                if (!node.children[bit]) {
                    node.children[bit] = new FrequencyBinaryTrieNode();
                }
                node = node.children[bit];
            }
            node.isEnd = true;
            node.code = i - 97;
            node.frequency = 1; // Минимальная частота
        }
    }

    compress(input) {
        let current = "";
        const output = [];
        for (const char of input) {
            const combined = current + char;
            const combinedBits = this._toBitString(combined);
            const node = this._searchNode(combinedBits);

            if (node && node.isEnd) {
                current = combined;
                node.frequency++; // Увеличиваем частоту использования
            } else {
                // Добавляем текущую строку в вывод
                const code = this._getCode(current);
                output.push(code);

                // Добавляем новую комбинацию в словарь
                if (this.currentSize < this.maxDictSize) {
                    this._insertNode(combinedBits);
                    this.currentSize++;
                } else {
                    // Удаляем редко используемые узлы
                    this._pruneTrie();
                    this._insertNode(combinedBits);
                }
                current = char;
            }
        }
        if (current) output.push(this._getCode(current));
        return output;
    }

    _searchNode(bitStr) {
        let node = this.trie;
        for (const bit of bitStr) {
            if (!node.children[bit]) return null;
            node = node.children[bit];
        }
        return node;
    }

    _insertNode(bitStr) {
        let node = this.trie;
        for (const bit of bitStr) {
            if (!node.children[bit]) {
                node.children[bit] = new FrequencyBinaryTrieNode();
            }
            node = node.children[bit];
        }
        node.isEnd = true;
        node.code = this.nextCode++;
        node.frequency = 1; // Начальная частота
    }

    _getCode(str) {
        if (str.length === 1) return str.charCodeAt(0);
        const bits = this._toBitString(str);
        const node = this._searchNode(bits);
        return node ? node.code : -1;
    }

    _toBitString(str) {
        return Array.from(str)
            .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
            .join("");
    }

    _pruneTrie() {
        // Находим узлы с наименьшей частотой
        const nodes = [];
        this._collectNodes(this.trie, nodes);

        // Сортируем по частоте и удаляем 10% самых редких
        nodes.sort((a, b) => a.frequency - b.frequency);
        const toRemove = Math.floor(nodes.length * 0.1);
        for (let i = 0; i < toRemove; i++) {
            const node = nodes[i];
            node.isEnd = false; // Помечаем как неиспользуемый
            node.code = -1;
        }
        this.currentSize -= toRemove;
    }

    _collectNodes(node, arr) {
        if (node.isEnd) {
            arr.push(node);
        }
        for (const key in node.children) {
            this._collectNodes(node.children[key], arr);
        }
    }
}

// Пример использования
const compressor = new OptimizedLZWWithPruning();
const data = "TOBEORNOTTOBEORTOBEORNOT";
const compressed = compressor.compress(data);
console.log("Сжатые данные:", compressed);
