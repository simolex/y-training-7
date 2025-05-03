/**
 * Каждому по компьютеру
 */

class PersistentStack {
    constructor(head = null) {
        this.head = head;
    }

    push(value) {
        const newNode = { value: this.head === null ? value : this.head.value + value, next: this.head };
        return new PersistentStack(newNode);
    }

    pop() {
        return new PersistentStack(this.head.next);
    }

    isEmpty() {
        return this.head === null;
    }
}

function snowmen(n, clones) {
    return result;
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
    let result = 0;
    const n = readInt();

    let viewSnowmen = [];
    let clone;
    let snowman, ballWeight;
    viewSnowmen.push(new PersistentStack());
    for (let i = 0; i < n; i++) {
        [snowman, ballWeight] = readArray();
        if (ballWeight > 0) {
            clone = viewSnowmen[snowman].push(ballWeight);
        } else if (viewSnowmen[snowman].isEmpty()) {
            clone = viewSnowmen[0];
        } else {
            clone = viewSnowmen[snowman].pop();
        }
        result += clone.isEmpty() ? 0 : clone.head.value;
        viewSnowmen.push(clone);
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

module.exports = snowmen;
