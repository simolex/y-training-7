/**
 * Рюкзак: наибольшая стоимость с восстановлением ответа
 */

function receptPriceKnapsack(n, m, weights, prices) {
    const knapsack = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

    let weight;
    for (let i = 1; i <= n; i++) {
        weight = weights[i - 1];
        for (let size = m; size >= 0; size--) {
            if (size >= weight) {
                knapsack[i][size] = Math.max(knapsack[i - 1][size], knapsack[i - 1][size - weight] + prices[i - 1]);
            } else {
                knapsack[i][size] = knapsack[i - 1][size];
            }
        }
    }

    let current = m;
    const result = [];
    for (let i = n; i > 0; i--) {
        if (knapsack[i - 1][current] !== knapsack[i][current]) {
            result.push(i);
            current -= weights[i - 1];
        }
    }

    return result.reverse();
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
    const [n, m] = readArray();
    const weights = readArray();
    const prices = readArray();

    const result = receptPriceKnapsack(n, m, weights, prices);
    console.log(result.join("\n"));
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

module.exports = receptPriceKnapsack;
