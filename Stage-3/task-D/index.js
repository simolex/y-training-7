/**
 * Каждому по компьютеру
 */

const BASE = 1 << 14;

function countOnes(n) {
    let num = n;
    let size = 0;
    while (num) {
        size++;
        num >>= 1;
    }
    let BASE = 1 << (size - 1);

    let max = n;

    for (let i = 0; i < size; i++) {
        const isOdd = (n & 1) === 1;
        n >>>= 1;
        if (isOdd) n |= BASE;
        max = Math.max(max, n);
    }
    return max;
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

    const result = countOnes(n);

    console.log(result);
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

function readBigIntArray() {
    var arr = _inputLines[_curLine]
        .trim(" ")
        .split(" ")
        .filter((s) => s.length > 0)
        .map((num) => BigInt(num));
    _curLine++;
    return arr;
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

module.exports = countOnes;
