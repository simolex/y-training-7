/**
 * Рюкзак: наибольший вес
 */

function maxKnapsack(m, weights) {
    const knapsack = Array(m + 1).fill(false);
    knapsack[0] = true;

    for (let weight of weights) {
        for (let size = m; size >= weight; size--) {
            knapsack[size] ||= knapsack[size - weight];
        }
    }

    max = m;
    while (!knapsack[max]) {
        max--;
    }
    return max;
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
    const weights = readArray();

    const result = maxKnapsack(m, weights);
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

module.exports = maxKnapsack;
