/**
 * Максимум на подотрезках с изменением элемента
 */

function nearestHigherNumber(n, nums, k, queries) {
    const size = 1 << Math.ceil(Math.log2(n));
    const SegTree = Array.from({ length: 2 * size }, () => ({ max: -Infinity, cnt: 0 }));

    const compareChildren = (left, right) => {
        if (left.max < right.max) {
            return right;
        } else if (left.max > right.max) {
            return left;
        }

        return { max: left.max, cnt: left.cnt + right.cnt };
    };

    for (let i = 0; i < n; i++) {
        SegTree[size + i].max = nums[i];
        if (nums[i] === 0) {
            SegTree[size + i].cnt = 1;
        }
    }

    for (let i = size - 1; i > 0; i--) {
        const left = SegTree[2 * i];
        const right = SegTree[2 * i + 1];
        Object.assign(SegTree[i], compareChildren(left, right));
    }

    // console.log(SegTree);

    return queries
        .map(([operation, ...params]) => {
            let [idx, value] = params;

            switch (operation) {
                case 1:
                    const result = { max: -Infinity, cnt: 0 };
                    idx += size - 1;
                    while (
                        idx > 0 &&
                        ((SegTree[idx].max < value && 2 * (idx >> 1) + 1 === idx) ||
                            (SegTree[idx].max >= value &&
                                2 * (idx >> 1) === idx &&
                                SegTree[2 * (idx >> 1) + 1].max < value))
                    ) {
                        idx >>= 1;
                    }
                    // console.log("?", idx, SegTree[idx].max);
                    if (idx === 0) {
                        return [-1];
                    }
                    let i = idx;

                    // console.log(">>", idx, value);
                    while (i < size) {
                        // console.log("LR", left, right);
                        const leftIdx = 2 * i;
                        const rightIdx = 2 * i + 1;
                        if (SegTree[leftIdx].max >= value) {
                            i = leftIdx;
                            // right = mid;
                        } else {
                            i = rightIdx;
                            // left = mid + 1;
                        }
                    }

                    // console.log("===", i);

                    if (i >= size && SegTree[i].max >= value) {
                        return [i - size + 1];
                    }
                    return [-1];
                // break;
                case 0:
                    idx += size - 1;
                    SegTree[idx].max = value;
                    SegTree[idx].cnt = SegTree[idx].max === 0 ? 1 : 0;

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
    const [n, m] = readArray();
    const nums = readArray();
    const queries = [];

    for (let i = 0; i < m; i++) {
        queries.push(readArray());
    }

    const result = nearestHigherNumber(n, nums, m, queries);

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

module.exports = nearestHigherNumber;
