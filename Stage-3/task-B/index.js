/**
 * Каждому по компьютеру
 */

function missionJedi(n, matrix) {
    return matrix.map((row) => row.reduce((sum, x) => sum | x, 0));
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

    const matrix = [];

    for (let i = 0; i < n; i++) {
        matrix.push(readArray());
    }

    const result = missionJedi(n, matrix);

    console.log(result.join(" "));
}

function readInt() {
    const n = BigInt(_inputLines[_curLine]);
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

module.exports = missionJedi;
