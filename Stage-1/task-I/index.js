/**
 * Эластичный ровер*
 */

function flexRover(n, s, products) {
    const sortedProducts = products
        .map(([u, c, p], i) => ({ u, c, p, idx: i + 1 }))
        .sort((a, b) => b.p - a.p);
    const maxCapacity = sortedProducts.reduce((sum, { u }) => sum + u, 0);
    const knapsack = Array.from({ length: n + 1 }, () => Array(maxCapacity + 1).fill(0));

    let product;
    for (let i = 1; i <= n; i++) {
        product = sortedProducts[i - 1];
        for (let size = maxCapacity; size >= 0; size--) {
            if (size >= product.u && size - s <= product.p) {
                knapsack[i][size] = Math.max(
                    knapsack[i - 1][size],
                    knapsack[i - 1][size - product.u] + product.c
                );
            } else {
                knapsack[i][size] = knapsack[i - 1][size];
            }
        }
    }

    let maxCost = -1;
    let idxMaxCost = maxCapacity;
    let maxDelivery = [];

    for (let i = maxCapacity; i !== 0; i--) {
        if (maxCost < knapsack[n][i]) {
            maxCost = knapsack[n][i];
            idxMaxCost = i;
        }
    }

    let current = idxMaxCost;
    for (let i = n; i > 0; i--) {
        if (knapsack[i - 1][current] !== knapsack[i][current]) {
            maxDelivery.push(sortedProducts[i - 1].idx);
            current -= sortedProducts[i - 1].u;
        }
    }
    maxDelivery.reverse();

    return { maxCost, maxDelivery };
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
