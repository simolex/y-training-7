/**
 * Каждому по компьютеру
 */

// class PersistentStack {
//     constructor(head = null) {
//         this.head = head;
//     }

//     push(value) {
//         const newNode = { value: this.head === null ? value : this.head.value + value, next: this.head };
//         return new PersistentStack(newNode);
//     }

//     pop() {
//         return new PersistentStack(this.head.next);
//     }

//     isEmpty() {
//         return this.head === null;
//     }
// }

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
    let result = 0;
    const n = readInt();

    const next = new Int32Array(n + 1).fill(0);
    const weight = new Int32Array(n + 1).fill(0);

    let snowman, ballWeight;
    for (let i = 1; i <= n; i++) {
        [snowman, ballWeight] = readArray();
        if (ballWeight > 0) {
            next[i] = snowman;
            weight[i] = weight[snowman] + ballWeight;
        } else {
            next[i] = next[next[snowman]];
            weight[i] = weight[next[snowman]];
        }
        result += weight[i];
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
