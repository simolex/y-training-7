/**
 * Максимум на подотрезках с изменением элемента
 */

function getMaxAndUpdate(n, nums, k, queries) {
    const preLogs = Array(n + 1).fill(0);

    for (let l = 2; l <= n; l++) {
        preLogs[l] = preLogs[l >> 1] + 1;
    }

    const size = 1 << (preLogs[n] + 1);
    const SegTree = Array.from({ length: 2 * size }, () => ({ max: -Infinity }));

    const compareChildren = (left, right) => {
        if (left.max < right.max) {
            return right;
        } else if (left.max > right.max) {
            return left;
        }

        return { max: left.max };
    };

    for (let i = 0; i < n; i++) {
        SegTree[size + i].max = nums[i];
    }

    for (let i = size - 1; i > 0; i--) {
        const left = SegTree[2 * i];
        const right = SegTree[2 * i + 1];
        Object.assign(SegTree[i], compareChildren(left, right));
    }
    return queries
        .map(([operation, ...params]) => {
            switch (operation) {
                case "s":
                    const result = { max: -Infinity };
                    let [l, r] = params;
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

                    return [result.max];
                // break;
                case "u":
                    let [idx, value] = params;
                    idx += size - 1;
                    SegTree[idx].max = value;
                    while (idx > 0) {
                        idx >>= 1;
                        const left = SegTree[2 * idx];
                        const right = SegTree[2 * idx + 1];
                        Object.assign(SegTree[idx], compareChildren(left, right));
                    }
                    break;
            }
            return [];
        })
        .filter((r) => r.length !== 0);
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
        queries.push(readStringArray().map((v, i) => (i === 0 ? v : Number(v))));
    }

    const result = getMaxAndUpdate(n, nums, k, queries);

    console.log(result.join(" "));
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

function readStringArray() {
    var arr = _inputLines[_curLine]
        .trim(" ")
        .split(" ")
        .filter((str) => str && str.length > 0);
    _curLine++;
    return arr;
}

function readString() {
    const s = _inputLines[_curLine].trim();
    _curLine++;
    return s;
}

module.exports = getMaxAndUpdate;
