/**
 * Нолики
 */

const hashSettings = [
    { xValue: 257, pMod: 10 ** 7 + 19 },
    { xValue: 263, pMod: 10 ** 7 + 79 },
    { xValue: 269, pMod: 10 ** 7 + 103 },
];

function compareSubSegments(n, nums, k, updates) {
    const size = 1 << Math.ceil(Math.log2(n));
    const SegTree = Array.from({ length: 2 * size }, () => ({ value: 0, hash: [] }));
    const LazyPromises = Array.from({ length: 2 * size }, () => 0);

    const countSettings = hashSettings.length;
    const x = [];
    const xValue = [];
    const pMod = [];

    const isEqual = (hash1, hash2) => {
        let result = true;
        let j = 0;
        do {
            result &&= hash1[j] === hash2[j];
        } while (result && j < countSettings);
        return result;
    };

    //где-то  надо хранить длину
    const merge = (leftHash, rightHash, lenRight) => {
        const result = Array(countSettings);
        for (let j = 0; j < countSettings; j++) {
            result[j] = leftHash[j] * x[j][lenRight] + rightHash[j];
        }
        return result;
    };

    for (let i = 0; i < countSettings; i++) {
        x[i] = [1];
        xValue[i] = hashSettings[i].xValue;
        pMod[i] = hashSettings[i].pMod;
    }

    for (let i = 0; i < n; i++) {
        SegTree[size + i].value = nums[i];
        SegTree[size + i].hash = Array(countSettings);
        for (let j = 0; j < countSettings; j++) {
            SegTree[size + i].hash[j] = nums[i] % pMod[j];
            x[j][i + 1] = (x[j][i] * xValue[j]) % pMod[j];
        }
    }

    for (let i = size - 1; i > 0; i--) {
        const left = SegTree[2 * i];
        const right = SegTree[2 * i + 1];
        SegTree[i].max = Math.max(left.max, right.max);
    }

    const applyPromise = (nIndex, nLeft, nRight, value) => {
        SegTree[nIndex].max += value;
        if (nLeft != nRight) {
            LazyPromises[nIndex] += value;
        } else {
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

    const getMax = (left, right, nIndex = 1, nLeft = 0, nRight = size - 1) => {
        if (right < nLeft || nRight < left) {
            return -Infinity;
        }
        if (left <= nLeft && right >= nRight) {
            return SegTree[nIndex].max;
        }

        const nMid = nLeft + Math.floor((nRight - nLeft) / 2);

        if (LazyPromises[nIndex] !== 0) {
            applyPromise(2 * nIndex, nLeft, nMid, LazyPromises[nIndex]);
            applyPromise(2 * nIndex + 1, nMid + 1, nRight, LazyPromises[nIndex]);
            LazyPromises[nIndex] = 0;
        }

        // Math.max(SegTree[2 * nIndex].max, SegTree[2 * nIndex + 1].max);

        return Math.max(
            getMax(left, right, 2 * nIndex, nLeft, nMid),
            getMax(left, right, 2 * nIndex + 1, nMid + 1, nRight)
        );
    };

    return updates
        .map(([operation, ...params]) => {
            switch (operation) {
                case 0:
                    let [left, right, value] = params;
                    updateNodeRange(left - 1, right - 1, value);
                    break;
                case 1:
                    let [leftR, rightR, size] = params;
                    return getMax(leftR - 1, rightR - 1);
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
        updates.push(readArray());
    }

    const result = compareSubSegments(n, nums, m, updates);

    console.log(result.join(""));
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

module.exports = compareSubSegments;
