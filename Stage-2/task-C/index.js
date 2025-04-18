/**
 * Количество максимумов на отрезке
 */

function getMaxAndIndex(n, nums, k, queries) {
    const preLogs = Array(n + 1).fill(0);

    for (let l = 2; l <= n; l++) {
        preLogs[l] = preLogs[l >> 1] + 1;
    }

    const size = 1 << (preLogs[n] + 1);
    const SegTree = Array.from({ length: 2 * size }, () => ({ max: -Infinity, idx: 0 }));

    const compareChildren = (left, right) => {
        if (left.max < right.max) {
            return right;
        } else if (left.max > right.max) {
            return left;
        }

        return { max: left.max, idx: left.idx };
    };

    for (let i = 0; i < n; i++) {
        SegTree[size + i].max = nums[i];
        SegTree[size + i].idx = i + 1;
    }

    for (let i = size - 1; i > 0; i--) {
        const left = SegTree[2 * i];
        const right = SegTree[2 * i + 1];
        Object.assign(SegTree[i], compareChildren(left, right));
    }
    return queries.map(([l, r]) => {
        const result = { max: -Infinity, idx: 0 };
        l += size - 1;
        r += size - 1;

        while (l <= r) {
            if (l % 2 === 1) {
                Object.assign(result, compareChildren(result, SegTree[l]));
                l++;
            }
            if (r % 2 === 0) {
                Object.assign(result, compareChildren(result, SegTree[r]));
                r--;
            }
            l >>= 1;
            r >>= 1;
        }

        return [result.max, result.idx];
    });
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
    const n = readInt();
    const nums = readArray();
    const k = readInt();
    const queries = [];

    for (let i = 0; i < k; i++) {
        queries.push(readArray());
    }

    const result = getMaxAndIndex(n, nums, k, queries);
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

module.exports = getMaxAndIndex;
