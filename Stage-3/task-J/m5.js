class BinaryTrieNode {
  constructor() {
    this.children = {}; // ключ - индекс Де Брюина, значение - узел
    this.isEnd = false;
  }
}

class BinaryTrie {
  constructor() {
    this.root = new BinaryTrieNode();
    // Константа Де Брюина для 5-битных ключей
    this.deBruijnSeq = 0x077CB531;
    this.deBruijnTable = this._buildDeBruijnTable();
  }

  _buildDeBruijnTable() {
    const table = new Array(32);
    for (let i = 0; i < 32; i++) {
      const hash = (this.deBruijnSeq << i) >>> 27;
      table[hash] = i;
    }
    return table;
  }

  _getKey(bitStr, pos) {
    // Берём 5 бит начиная с позиции `pos`
    const chunk = (parseInt(bitStr.substr(pos, 5), 2) || 0;
    return this.deBruijnTable[(chunk * this.deBruijnSeq) >>> 27];
  }

  insert(bitStr) {
    let node = this.root;
    for (let i = 0; i < bitStr.length; i += 5) {
      const key = this._getKey(bitStr, i);
      if (!node.children[key]) {
        node.children[key] = new BinaryTrieNode();
      }
      node = node.children[key];
    }
    node.isEnd = true;
  }

  search(bitStr) {
    let node = this.root;
    for (let i = 0; i < bitStr.length; i += 5) {
      const key = this._getKey(bitStr, i);
      if (!node.children[key]) return false;
      node = node.children[key];
    }
    return node.isEnd;
  }
}

// Пример использования
const trie = new BinaryTrie();
trie.insert("101010101"); // Вставка битовой строки
console.log(trie.search("101010101")); // true
