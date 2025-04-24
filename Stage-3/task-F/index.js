/**
 * Каждому по компьютеру
 */

class BitSet {
    constructor(size = 32) {
        this.chunkCount = Math.ceil(size / 32);
        this.chunks = new Uint32Array(this.chunkCount);
        this.maskChunk = (-1 << 6) >>> 1;
        this.maskBits = (1 << 5) - 1;
    }

    _getChunk(index) {
        return index & this.maskChunk;
    }

    _getAddress(index) {
        return 1 << (index & this.maskBits);
    }

    get(index) {
        return this.chunks[this._getChunk(index)] & this._getAddress(index);
    }

    set(index) {
        this.chunks[this._getChunk(index)] |= this._getAddress(index);
    }

    delete(index) {
        this.chunks[this._getChunk(index)] &= ~this._getAddress(index);
    }

    has(index) {
        return !!this.get(index);
    }
}

function isFullCovering(n, k, rooks) {
    const cube = [new BitSet(n), new BitSet(n), new BitSet(n)];

    for (let i = 0; i < k; i++) {
        rooks[i].forEach((c, j) => cube[j].set(c - 1));
    }

    return [];
}

const _readline = require("readline");

const _reader = _readline.createInterface({
    input: process.stdin,
});

const _inputLines = [];
let _curLine = 0;

_reader.on("line", (line) => {
    _inputLines.push(line);
});

process.stdin.on("end", solve);

function solve() {
    const [n, k] = readArray();

    const rooks = [];

    for (let i = 0; i < k; i++) {
        rooks.push(readArray());
    }

    const result = isFullCovering(n, k, rooks);

    console.log(result.join("\n"));
}

function readInt() {
    const n = Number(_inputLines[_curLine]);
    _curLine++;
    return n;
}

function readBigInt() {
    const n = BigInt(_inputLines[_curLine]);
    _curLine++;
    return n;
}

function readArray() {
    var arr = _inputLines[_curLine]
        .trim(" ")
        .split(" ")
        .map((num) => Number(num));
    _curLine++;
    return arr;
}

function readString() {
    const s = _inputLines[_curLine].trim();
    _curLine++;
    return s;
}

module.exports = isFullCovering;
