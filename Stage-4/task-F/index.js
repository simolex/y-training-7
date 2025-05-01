/**
 * Каждому по компьютеру
 */

class DSU {
    parent;
    weight;
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.weight = Array(n).fill(1);
    }

    find(v) {
        return this.parent[v] === v ? v : (this.parent[v] = this.find(this.parent[v]));
    }

    union(a, b) {
        a = this.find(a);
        b = this.find(b);
        if (this.weight[a] > this.weight[b]) {
            [a, b] = [b, a];
        }
        this.weight[b] += this.weight[a];
        this.parent[a] = b;
    }

    size(v) {
        v = this.find(v);
        return this.weight[v];
    }
}

function keepPiggyBanks(n, keys) {
    const dsu = new DSU(n);

    for (let i = 0; i < n; i++) {
        dsu.union(i, keys[i]);
    }

    return new Set(keys.map((k) => dsu.find(k))).size;
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
    const n = readInt();
    const keys = [];
    for (let i = 0; i < n; i++) {
        keys.push(readInt() - 1);
    }

    const result = keepPiggyBanks(n, keys);
    console.log(result);
}

function readInt() {
    const n = Number(_inputLines[_curLine]);
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

module.exports = keepPiggyBanks;
