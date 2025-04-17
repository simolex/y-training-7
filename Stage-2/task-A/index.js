/**
 * Эластичный ровер*
 */

function getMaxAndCount(n, nums, k, queries) {
    const preLogs = Array(n + 1).fill(0);

    for (let l = 1; l <= n; l++) {
        preLogs[l] = preLogs[l >> 1] + 1;
    }

    // console.log(preLogs);

    const sparseTable = Array.from({ length: preLogs[n] }, () =>
        Array.from({ length: n }, () => ({ max: -Infinity, cnt: 0 }))
    );

    for (let current, i = 0; i < n; i++) {
        current = sparseTable[0][i];
        current.max = nums[i];
        current.cnt = 1;
    }

    for (let k = 1; k < preLogs[n]; k++) {
        for (let i = 0; i <= n - (1 << k); i++) {
            const left = sparseTable[k - 1][i];
            const right = sparseTable[k - 1][i + (1 << (k - 1))];

            if (left.max < right.max) sparseTable[k][i] = right;
            else if (left.max > right.max) sparseTable[k][i] = left;
            else {
                sparseTable[k][i].max = left.max;
                sparseTable[k][i].cnt = left.cnt + right.cnt;
            }
        }
    }

    // console.log(sparseTable);

    return queries.map(([l, r]) => {
        const len = r - l + 1;
        const logSize = preLogs[len] - 1;
        const left = sparseTable[logSize][l - 1];
        const right = sparseTable[logSize][r - (1 << logSize) + 1];

        // console.log(logSize, l, r);

        if (left.max > right.max || len === 1 << logSize) return [left.max, left.cnt];
        else if (left.max < right.max) return [right.max, right.cnt];
        else return [left.max, left.cnt + right.cnt];
    });
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
    const nums = readArray();
    const k = readInt();
    const queries = [];

    for (let i = 0; i < k; i++) {
        queries.push(readArray());
    }

    const result = getMaxAndCount(n, nums, k, queries);
    // console.log(result);

    console.log(result.map((resp) => resp.join(" ")).join("\n"));
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

module.exports = getMaxAndCount;
