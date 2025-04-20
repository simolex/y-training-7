/**
 * Максимум на подотрезках с изменением элемента
 */

function getKthZeroAndUpdate(n, nums, k, queries) {
    const preLogs = Array(n + 1).fill(0);

    for (let l = 2; l <= n; l++) {
        preLogs[l] = preLogs[l >> 1] + 1;
    }

    const size = 1 << (preLogs[n] + 1);
    const SegTree = Array.from({ length: 2 * size }, () => ({ min: Infinity, cnt: 0 }));

    const compareChildren = (left, right) => {
        if (left.min < right.min) {
            return left;
        } else if (left.min > right.min) {
            return right;
        }

        return { min: left.min, cnt: left.cnt + right.cnt };
    };

    for (let i = 0; i < n; i++) {
        SegTree[size + i].min = nums[i];
        if (nums[i] === 0) {
            SegTree[size + i].cnt = 1;
        }
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
                    const result = { min: Infinity, cnt: 0 };
                    let [leftRange, rightRange, k] = params;

                    if (leftRange > 1) {
                        let l = 1;
                        let r = leftRange - 1;
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
                    }

                    k += result.cnt;
                    let i = 1;
                    let NthZero = 0;
                    if (SegTree[i] < k) {
                        return [-1];
                    }
                    while (i < size) {
                        const leftIdx = 2 * i;
                        const rightIdx = 2 * i + 1;
                        if (leftIdx < size) {
                            if (NthZero + SegTree[leftIdx].cnt >= k) {
                                i = leftIdx;
                            } else {
                                NthZero += SegTree[leftIdx].cnt;
                                i = rightIdx;
                            }
                        } else {
                            if (NthZero + SegTree[leftIdx].cnt === k) {
                                i = leftIdx;
                            } else {
                                i = rightIdx;
                            }
                        }
                    }
                    // console.log(i, i - size);
                    if (i - size < rightRange) {
                        return [i - size + 1];
                    }
                    return [-1];
                // break;
                case "u":
                    let [idx, value] = params;
                    idx += size - 1;
                    SegTree[idx].min = value;
                    SegTree[idx].cnt = SegTree[idx].min === 0 ? 1 : 0;

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

    const result = getKthZeroAndUpdate(n, nums, k, queries);

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

module.exports = getKthZeroAndUpdate;
