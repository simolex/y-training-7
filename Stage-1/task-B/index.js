/**
 * Ни больше ни меньше
 */

function equalSize(nums) {
    return nums.map((currentNums) => {
        const result = [];

        let count = 0;
        let min = Infinity;
        for (let num of currentNums) {
            count++;
            min = Math.min(min, num);
            if (count > min) {
                result.push(count - 1);
                count = 1;
                min = num;
            }
        }
        result.push(count);
        return result;
    });
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
    const nums = [];

    for (let i = 0; i < n; i++) {
        readInt();
        nums.push(readArray());
    }

    const result = equalSize(nums);

    result.forEach((arr) => {
        console.log(arr.length);
        console.log(arr.join(" "));
    });
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

module.exports = equalSize;
