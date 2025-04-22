/**
 * Нолики
 */

function maxZeroSequence(n, nums, k, queries) {
    const size = 1 << Math.ceil(Math.log2(n));
    const SegTree = Array.from({ length: 2 * size }, () => ({
        max: 0,
        prefix: 0,
        suffix: 0,
        left: 0,
        right: 0
    }));

    const compareChildren = (left, right) => {
        const halfSize = left.right - left.left + 1;
        const result = {
            max: Math.max(left.max, right.max, left.suffix + right.prefix),
            prefix: left.prefix + (left.prefix === halfSize ? right.prefix : 0),
            suffix: right.suffix + (right.suffix === halfSize ? left.suffix : 0),
            left: left.left,
            right: right.right
        };

        return result;
    };

    let num;
    for (let i = 0; i < size; i++) {
        if (i < n) {
            num = nums[i];
        } else {
            num = -1;
        }

        if (num === 0) {
            SegTree[size + i].max = 1;
            SegTree[size + i].prefix = 1;
            SegTree[size + i].suffix = 1;
        }
        SegTree[size + i].left = i;
        SegTree[size + i].right = i;
    }

    for (let i = size - 1; i > 0; i--) {
        const left = SegTree[2 * i];
        const right = SegTree[2 * i + 1];

        Object.assign(SegTree[i], compareChildren(left, right));
    }

    const getMax = (idx, rLeft, rRight) => {
        const current = SegTree[idx];
        if (rRight < current.left || current.right < rLeft) {
            return { ...current, max: 0, prefix: 0, suffix: 0 };
        }

        if (rLeft <= current.left && current.right <= rRight) {
            return current;
        }

        const chLeft = getMax(2 * idx, rLeft, rRight);
        const chRight = getMax(2 * idx + 1, rLeft, rRight);
        return compareChildren(chLeft, chRight);
    };

    return queries
        .map(([operation, ...params]) => {
            switch (operation.trim().toUpperCase()) {
                case "QUERY":
                    let [left, right] = params;

                    const result = getMax(1, left - 1, right - 1);
                    return result.max;
                // break;
                case "UPDATE":
                    let [idx, value] = params;
                    idx += size - 1;

                    const prevValue = SegTree[idx].max;
                    SegTree[idx].max = value === 0 ? 1 : 0;

                    if (prevValue !== SegTree[idx].max) {
                        SegTree[idx].prefix = SegTree[idx].max;
                        SegTree[idx].suffix = SegTree[idx].max;

                        while (idx > 1) {
                            idx >>= 1;
                            const left = SegTree[2 * idx];
                            const right = SegTree[2 * idx + 1];
                            Object.assign(SegTree[idx], compareChildren(left, right));
                        }
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

    const m = readInt();
    const queries = [];

    for (let i = 0; i < m; i++) {
        queries.push(readStringArray().map((v, i) => (i === 0 ? v : Number(v))));
    }

    const result = maxZeroSequence(n, nums, m, queries);

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

module.exports = maxZeroSequence;
