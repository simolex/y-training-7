/**
 * Каждому по компьютеру
 */

class BitSet {
    constructor(size = 32) {
        this.size = size;
        this.chunkCount = Math.ceil(size / 32);
        this.chunks = new Uint32Array(this.chunkCount);
        this.maskChunk = (-1 << 5) >>> 0;
        this.maskBits = (1 << 5) - 1;
        this.clear();
    }

    _getChunk(index) {
        return (index & this.maskChunk) >>> 5;
    }

    _getAddress(index) {
        return 1 << (index & this.maskBits);
    }

    clear() {
        this.chunks.fill(0);
        if (this.size % 32 !== 0) {
            this.chunks[this.chunkCount - 1] = (-1 << this.size % 32) >>> 0;
        }
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

    unionLite(B) {
        for (let i = 0; i < this.chunkCount; i++) {
            this.chunks[i] |= B.chunks[i];
        }
    }

    indexOfNotHas() {
        for (let i = 0; i < this.chunkCount; i++) {
            let findingDot = ~this.chunks[i];
            if (findingDot !== 0) {
                let index = 0;
                while (findingDot && !(findingDot & 1)) {
                    findingDot >>= 1;
                    index++;
                }
                return 32 * i + index;
            }
        }
        return -1;
    }
}

function isFullCovering(n, k, rooks) {
    const viewXY = Array.from({ length: n }, () => new BitSet(n));
    const viewYZ = Array.from({ length: n }, () => new BitSet(n));
    const viewXZ = Array.from({ length: n }, () => new BitSet(n));

    for (let i = 0; i < k; i++) {
        const [x, y, z] = rooks[i];
        viewXY[x - 1].set(y - 1);
        viewYZ[y - 1].set(z - 1);
        viewXZ[x - 1].set(z - 1);
    }

    const Z = new BitSet(n);
    for (let x = 0; x < n; x++) {
        for (let y = 0; y < n; y++) {
            if (!viewXY[x].has(y)) {
                Z.clear();
                Z.unionLite(viewYZ[y]);
                Z.unionLite(viewXZ[x]);
                if (Z.indexOfNotHas() >= 0) {
                    return [x + 1, y + 1, Z.indexOfNotHas() + 1];
                }
            }
        }
    }

    return [];
}

const _readline = require("readline");

const _reader = _readline.createInterface({
    input: process.stdin
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

    console.log(result.length === 0 ? "YES" : `NO\n${result.join(" ")}`);
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
