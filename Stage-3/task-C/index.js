/**
 * Каждому по компьютеру
 */

function countOnes(n, nums) {
    let maxSize = -Infinity;
    let totalCountOnes = 0;

    const hashCounts = nums.map((num, i) => {
        const bitset = num.toString(2);
        maxSize = Math.max(maxSize, bitset.length);

        const cntOne = bitset
            .split("")
            .map(Number)
            .reduce((sum, b) => sum + b);

        totalCountOnes += cntOne;
        return [i, cntOne];
    });
    if (totalCountOnes % 2 === 1) {
        return [];
    }

    const result = Array.from({ length: n }, () => Array(maxSize).fill(0));

    for (let k = maxSize - 1; k >= 0; k--) {
        let prevIndex = -1;
        hashCounts.sort((a, b) => (a[1] % 2) - (b[1] % 2) || b[1] - a[1]);
        let count = 0;
        for (let j = 0; j < n; j++) {
            const [i, cnt] = hashCounts[j];
            if (cnt > 0) {
                result[i][k] = 1;
                hashCounts[j][1]--;
                prevIndex = j;
                count++;
            }
        }
        if (count % 2 === 1) {
            result[hashCounts[prevIndex][0]][k] = 0;
            hashCounts[prevIndex][1]++;
        }
    }

    const rest = hashCounts.reduce((sum, [_, cnt]) => sum + cnt, 0);
    if (rest !== 0) {
        return [];
    }

    return result.map((bitset) => BigInt(parseInt(bitset.join(""), 2)));
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
    const nums = readBigIntArray();
    const result = countOnes(n, nums);
    if (!result.length) {
        console.log("impossible");
    }
    console.log(
        result.map((v) => v.toString()).join(" ")
        // result.map((v) => `${v.toString()} - ${v.toString(2).padStart(8, "0")}`).join("\n")
    );
}

function readInt() {
    const n = Number(_inputLines[_curLine]);
    _curLine++;
    return n;
}

function readBigInt() {
    const n = BigInt(_inputLines[_curLine]);
    _curLine++;
    return n;
}

function readBigIntArray() {
    var arr = _inputLines[_curLine]
        .trim(" ")
        .split(" ")
        .filter((s) => s.length > 0)
        .map((num) => BigInt(num));
    _curLine++;
    return arr;
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

module.exports = countOnes;
