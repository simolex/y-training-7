/**
 * Каждому по компьютеру
 */

const BASE = BigInt(1 << 30);

function countOnes(n, nums) {
    const countOnes = Array(n);

    let totalCountOnes = 0;
    let maxSize = -Infinity;

    for (let i = 0; i < n; i++) {
        let num = nums[i];
        let count = 0;
        let size = 0;
        while (num !== 0n) {
            let part = Number(num % BASE);
            while (part) {
                count += part & 1;
                size++;
                part >>= 1;
            }

            num /= BASE;
        }
        countOnes[i] = count;
        totalCountOnes += count;
        maxSize = Math.max(maxSize, size);
    }

    if (totalCountOnes % 2 === 1) {
        return [];
    }

    const hashCounts = countOnes.map((c, i) => [i, c]);
    console.log(countOnes);
    console.log(
        nums.map((n) =>
            n
                .toString(2)
                .split("")
                .map(Number)
                .reduce((sum, b) => sum + b)
        )
    );
    // console.log(hashCounts);

    const result = Array.from({ length: n }, () => Array(maxSize).fill(0));
    for (let k = 0; k < maxSize; k++) {
        let prevIndex = -1;
        let count = 0;
        hashCounts.sort((a, b) => b[1] - a[1]);
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

    const resultToString = result.map((bitset) => bitset.reverse().join(""));

    if (maxSize <= 30) {
        return resultToString.map((b) => BigInt(parseInt(b, 2)));
    }
    return resultToString.map(
        (b) => BigInt(parseInt(b.slice(0, 30), 2)) * BASE + BigInt(parseInt(b.slice(30, maxSize), 2))
    );
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

    const nums = readBigIntArray();

    const result = countOnes(n, nums);

    if (!result.length) {
        console.log("impossible");
    }
    console.log(result.map((v) => v.toString()).join(" "));
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
