/**
 * Каждому по компьютеру
 */

function encode(code) {
    code = code.split("").map(Number);

    const n = code.length;
    const crcSize = Math.ceil(Math.log2(n + Math.ceil(Math.log2(n)) + 1));
    const size = n + crcSize;
    const buffer = Array(size + 1).fill(0);
    let pntCode = 0;
    let pntBuffer = 1;

    for (let i = 0; i < crcSize; i++) {
        let pntCRC = 1 << i;
        let dataSize = pntCRC - 1;

        pntBuffer++;
        while (dataSize && pntCode < n) {
            buffer[pntBuffer++] = code[pntCode++];
            dataSize--;
        }
    }

    for (let i = 0; i < crcSize; i++) {
        let pntCRC = 1 << i;
        let crc = 1;
        for (let i = pntCRC; i <= size; i++) {
            if (i & pntCRC) {
                crc ^= buffer[i];
            }
        }
        buffer[pntCRC] = crc;
    }

    return buffer.slice(1).join("");
}

function decode(code) {
    code = code.split("").map(Number);
    const size = code.length;
    let crcSize, n;

    for (crcSize = 1; crcSize <= 18; crcSize++) {
        n = size - crcSize;
        if (n <= 0) continue;

        const expectedCrcSize = Math.ceil(Math.log2(n + Math.ceil(Math.log2(n)) + 1));
        if (crcSize === expectedCrcSize) {
            break;
        }
    }

    const buffer = [0].concat(code);
    let badBit = 0;
    for (let i = 0; i < crcSize; i++) {
        let pntCRC = 1 << i;
        let crc = 1;
        for (let i = pntCRC; i <= size; i++) {
            if (i & pntCRC) {
                crc ^= buffer[i];
            }
        }
        if (crc) {
            badBit |= pntCRC;
        }
    }
    buffer[badBit] = 1 - buffer[badBit];

    let pntCode = 0;
    let pntBuffer = 1;
    const result = Array(n);

    for (let i = 0; i < crcSize; i++) {
        let pntCRC = 1 << i;
        let dataSize = pntCRC - 1;

        pntBuffer++;
        while (dataSize && pntCode < n) {
            result[pntCode++] = buffer[pntBuffer++];
            dataSize--;
        }
    }

    return result.join("");
}

const _readline = require("readline");

const _reader = _readline.createInterface({
    input: process.stdin,
});

const _inputLines = [];
let _curLine = 0;

let n;
let code;

_reader.on("line", (line) => {
    _inputLines.push(line);

    if (_inputLines.length === 1) {
        n = readInt();
    } else if (_inputLines.length === 2) {
        code = readString();

        let result;
        if (n == 1) {
            result = encode(code);
        } else {
            result = decode(code);
        }

        console.log(result);
    }
});

// process.stdin.on("end", solve);

function solve() {
    const n = readInt();
    const code = readString();

    let result;
    if (n == 1) {
        result = encode(code);
    } else {
        result = decode(code);
    }

    console.log(result);
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

module.exports = { encode, decode };

// let test = "";
// let result = "";

// while (test == result) {
//     const size = Math.floor(Math.random() * 10 ** 5 + 1);
//     const testArr = Array(size);
//     for (let i = 0; i < size; i++) {
//         testArr[i] = Math.floor(Math.random() + 0.5);
//     }
//     test = testArr.join("");
//     let res = encode(test);
//     const badBit = Math.floor(Math.random() * res.length);

//     const resArr = res.split("");
//     resArr[badBit] = 1 - resArr[badBit];

//     result = decode(resArr.join(""));
//     console.log("OK", test.length);
// }

// console.log("Bad");
// console.log(test);
