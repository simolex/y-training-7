/**
 * Две стены
 */

function twoWall(n, k, bricks) {
    const wall = Array.from({ length: k + 1 }, () => []);
    const lines = Array(k + 1).fill(0);

    for (let i = 0; i < n; i++) {
        const [size, color] = bricks[i];
        lines[color] += size;
        wall[color].push({ size, num: i + 1 });
    }

    let isValidWall = true;
    const lineSize = lines[1];
    for (let color = 2; color <= k; color++) {
        isValidWall &&= lineSize === lines[color];
    }
    if (!isValidWall) {
        return [];
    }

    const knapsacks = Array.from({ length: k + 1 }, () => Array(lineSize + 1).fill(0));
    for (const knapsack of knapsacks) {
        knapsack[0] = Infinity;
    }
    // Для подсчета пересечения
    knapsacks[0].fill(k);

    let countBricks, size, num;
    for (let c = 1; c <= k; c++) {
        countBricks = wall[c].length;
        for (let i = 0; i < countBricks; i++) {
            ({ size, num } = wall[c][i]);
            for (let pos = lineSize; pos >= size; pos--) {
                if (knapsacks[c][pos] === 0 && knapsacks[c][pos - size] > 0) {
                    knapsacks[c][pos] = num;
                    knapsacks[0][pos]--;
                }
            }
        }
    }

    const getBricks = (color, atPos) => {
        const res = [];
        let brickNum;
        while (atPos !== 0) {
            brickNum = knapsacks[color][atPos];
            res.push(brickNum);
            atPos -= bricks[brickNum - 1][0];
        }
        return res;
    };

    const result = [];
    const splitLine = knapsacks[0].indexOf(0);

    // перебираем цвета
    if (splitLine < lineSize) {
        for (let c = 1; c <= k; c++) {
            result.push(...getBricks(c, splitLine));
        }
    }

    return result;
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
    const [n, k] = readArray();
    const bricks = [];

    for (let i = 0; i < n; i++) {
        bricks.push(readArray());
    }

    const result = twoWall(n, k, bricks);
    if (result.length === 0) {
        console.log("NO");
    } else {
        console.log("YES");
        console.log(result.join(" "));
    }
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

module.exports = twoWall;
