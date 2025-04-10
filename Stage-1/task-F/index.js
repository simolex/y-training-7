/**
 * Рюкзак: наибольшая стоимость с восстановлением ответа
 */

function maxPriceKnapsack(n, m, weights, prices) {
    const knapsack = Array(m + 1).fill(false);
    const priceSum = Array(m + 1).fill(0);
    knapsack[0] = true;

    let i = 0;
    for (let weight of weights) {
        for (let size = m; size >= weight; size--) {
            knapsack[size] ||= knapsack[size - weight];

            if (knapsack[size]) {
                priceSum[size] = Math.max(priceSum[size], priceSum[size - weight] + prices[i]);
            }
        }
        i++;
    }

    return Math.max(...priceSum);
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
    const prices = readArray();

    const result = maxPriceKnapsack(n, m, weights, prices);
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

module.exports = maxPriceKnapsack;
