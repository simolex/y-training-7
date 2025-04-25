/**
 * Каждому по компьютеру
 */

class BinaryIndexedTree {
    constructor(size) {
        this.size = size;
        this.tree = new Array(size + 1).fill(0);
    }

    // Обновление элемента в дереве
    update(index, value) {
        while (index <= this.size) {
            this.tree[index] += value;
            index += index & -index;
        }
    }

    // Запрос суммы на префиксе [1, index]
    prefixQuery(index) {
        let sum = 0;
        while (index > 0) {
            sum += this.tree[index];
            index -= index & -index;
        }
        return sum;
    }

    // Запрос суммы на отрезке [left, right]
    rangeQuery(left, right) {
        return this.prefixQuery(right) - this.prefixQuery(left - 1);
    }

    // Запрос суммы на диапазоне [index+1, size]
    query(index) {
        return this.prefixQuery(this.size) - this.prefixQuery(index);
    }
}

function sumOnSegments(n, m, queries) {
    const values = Array(n + 1).fill(0);
    const segment = new BinaryIndexedTree(n);

    queries = queries.slice(0, m);

    return queries
        .map(([operation, ...params]) => {
            switch (operation) {
                case "A":
                    const [idx, value] = params;
                    const diff = value - values[idx];
                    segment.update(idx, diff);
                    values[idx] = value;
                    break;
                case "Q":
                    const [l, r] = params;
                    return [segment.rangeQuery(l, r)];
                // break;
            }
        })
        .filter(Boolean)
        .map((r) => r.join(""));
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
    const [n, m] = readArray();

    const queries = [];

    for (let i = 0; i < m; i++) {
        queries.push(readStringArray().map((v, i) => (i === 0 ? v : Number(v))));
    }

    const result = sumOnSegments(n, m, queries);
    console.log(result.join("\n"));
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

function readStringArray() {
    var arr = _inputLines[_curLine]
        .trim(" ")
        .split(" ")
        .filter((str) => str && str.length > 0);
    _curLine++;
    return arr;
}

module.exports = sumOnSegments;
