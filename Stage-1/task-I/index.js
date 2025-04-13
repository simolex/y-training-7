/**
 * Эластичный ровер*
 */

function flexRover(n, s, products) {
    for (let i = 0; i < n; i++) {
        products.forEach((product, i) => {
            product.push(i + 1);
        });
    }
    const maxSum = products.reduce((sum, v) => sum + v[0], 0);
    let maxCost = -1;
    let maxDelivery = [];

    for (let u = 0; u <= maxSum; u++) {
        const p = Math.max(0, u - s);
        const currentProducts = products.filter((product) => product[2] >= p);

        const knapsack = Array(u + 1).fill(-1);
        knapsack[0] = 0;
        const prevSet = Array.from({ length: u + 1 }, () => []);

        for (const product of currentProducts) {
            for (let i = u; i >= product[0]; i--) {
                if (knapsack[i - product[0]] !== -1) {
                    if (knapsack[i] < knapsack[i - product[0]] + product[1]) {
                        knapsack[i] = knapsack[i - product[0]] + product[1];
                        prevSet[i] = [...prevSet[i - product[0]], product[3]];
                    }
                }
            }
        }

        if (knapsack[u] > maxCost) {
            maxCost = knapsack[u];
            maxDelivery = prevSet[u] || [];
        }
    }

    return { maxCost, maxDelivery };
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
    const [n, s] = readArray();
    const products = [];

    for (let i = 0; i < n; i++) {
        products.push(readArray());
    }

    const { maxCost, maxDelivery } = flexRover(n, s, products);

    console.log(`${maxDelivery.length} ${maxCost}`);
    console.log(maxDelivery.join(" "));
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

module.exports = flexRover;
