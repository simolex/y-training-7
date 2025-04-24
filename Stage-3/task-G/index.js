/**
 * Каждому по компьютеру
 */

function sumOnSegments(n) {
    let count = 0;
    const partSize = BigInt(1 << 16);

    while (n !== 0n) {
        let part = Number(n % partSize);
        while (part) {
            count += part & 1;
            part >>= 1;
        }

        n /= partSize;
    }
    return count;
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

    const queries = [];

    for (let i = 0; i < m; i++) {
        queries.push(readStringArray().map((v, i) => (i === 0 ? v : Number(v))));
    }

    const result = sumOnSegments(n, m, queries);

    console.log(result.join("\n"));

    console.log(result);
}

function readBigInt() {
    const n = BigInt(_inputLines[_curLine]);
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

module.exports = sumOnSegments;
