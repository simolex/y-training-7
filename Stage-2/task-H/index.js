/**
 * Нолики
 */

function LazySegmentTree(n, nums, k, updates) {
    const size = 1 << Math.ceil(Math.log2(n));
    const SegTree = Array.from({ length: 2 * size }, () => ({ max: -Infinity }));
    const LazyPromises = Array.from({ length: 2 * size }, () => 0);

    for (let i = 0; i < n; i++) {
        SegTree[size + i].max = nums[i];
    }

    for (let i = size - 1; i > 0; i--) {
        const left = SegTree[2 * i];
        const right = SegTree[2 * i + 1];
        SegTree[i].max = Math.max(left.max, right.max);
    }

    const applyPromise = (nIndex, nLeft, nRight, value) => {
        if (nLeft != nRight) {
            LazyPromises[nIndex] += value;
        } else {
            SegTree[nIndex].max += value;
            LazyPromises[nIndex] = 0;
        }
    };

    const updateNodeRange = (left, right, value, nIndex = 1, nLeft = 0, nRight = size - 1) => {
        const node = SegTree[nIndex];
        if (right < nLeft || nRight < left) {
            return;
        }

        if (left <= nLeft && nRight <= right) {
            applyPromise(nIndex, nLeft, nRight, value);
            return;
        }

        const nMid = nLeft + Math.floor((nRight - nLeft) / 2);

        if (LazyPromises[nIndex] !== 0) {
            applyPromise(2 * nIndex, nLeft, nMid, LazyPromises[nIndex]);
            applyPromise(2 * nIndex + 1, nMid + 1, nRight, LazyPromises[nIndex]);
            LazyPromises[nIndex] = 0;
        }

        updateNodeRange(left, right, value, 2 * nIndex, nLeft, nMid);
        updateNodeRange(left, right, value, 2 * nIndex + 1, nMid + 1, nRight);

        node.max = Math.max(SegTree[2 * nIndex].max, SegTree[2 * nIndex + 1].max);
    };

    // const updateRange = (left, right, value) =>
    //     updateNodeRange(1, 0, size - 1, left - 1, right - 1, value);

    // console.log(SegTree);

    const getValue = (idx, nIndex = 1, nLeft = 0, nRight = size - 1) => {
        if (idx < nLeft || idx > nRight) {
            return -Infinity;
        }
        if (idx === nLeft && idx === nRight) {
            return SegTree[nIndex].max;
        }

        const nMid = nLeft + Math.floor((nRight - nLeft) / 2);

        if (LazyPromises[nIndex] !== 0) {
            applyPromise(2 * nIndex, nLeft, nMid, LazyPromises[nIndex]);
            applyPromise(2 * nIndex + 1, nMid + 1, nRight, LazyPromises[nIndex]);
            LazyPromises[nIndex] = 0;
        }

        return Math.max(
            getValue(idx, 2 * nIndex, nLeft, nMid),
            getValue(idx, 2 * nIndex + 1, nMid + 1, nRight)
        );
    };
    return updates
        .map(([operation, ...params]) => {
            switch (operation.trim()) {
                case "a":
                    let [left, right, value] = params;
                    updateNodeRange(left - 1, right - 1, value);
                    break;
                case "g":
                    let [idx] = params;
                    return getValue(idx - 1);
                // break;
            }
            return [];
        })
        .filter((r) => r.length !== 0);
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

    const m = readInt();
    const updates = [];
    for (let i = 0; i < m; i++) {
        updates.push(readStringArray().map((v, i) => (i === 0 ? v : Number(v))));
    }

    const result = LazySegmentTree(n, nums, m, updates);

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

module.exports = LazySegmentTree;
