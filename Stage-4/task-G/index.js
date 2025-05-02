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
        if (a !== b) {
            if (this.weight[a] > this.weight[b]) {
                [a, b] = [b, a];
            }
            this.weight[b] += this.weight[a];
            this.parent[a] = b;
        }
    }

    size(v) {
        v = this.find(v);
        return this.weight[v];
    }
}

function unionIslands(n, k, bridges) {
    const dsu = new DSU(n + 1);

    for (let i = 0; i < k; i++) {
        dsu.union(bridges[i][0], bridges[i][1]);
        if (dsu.size(bridges[i][0]) === n) {
            return i + 1;
        }
    }

    return k;
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
    const bridges = [];
    for (let i = 0; i < k; i++) {
        bridges.push(readArray());
    }

    const result = unionIslands(n, k, bridges);
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

module.exports = unionIslands;
