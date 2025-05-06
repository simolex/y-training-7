/**
 * Каждому по компьютеру
 */

var Node = function (index, value, next = null, prev = null) {
    this.index = index;
    this.value = value;
    this.prev = prev;
    this.next = next;
};

function simpleRiver(n, parts, k, events) {
    let result = [];
    const next = new Uint32Array(n + k);
    const prev = new Uint32Array(n + k);
    const value = Array(n + k).fill(0);
    const stack = [];

    let currentTax = 0;

    for (let i = 0; i < n; i++) {
        value[i] = parts[i];
        next[i] = (i + 1) % n;
        prev[i] = (i - 1 + n) % n;
        currentTax += parts[i] * parts[i];
    }
    for (let j = n; j < n + k; j++) stack.push(j);

    result.push(currentTax);

    let typeEvent, numPart;
    let pntPart = 0;
    let cntParts = n;
    let absNumPart = 1;

    const selectPart = (target) => {
        while (absNumPart !== target) {
            if (absNumPart > target) {
                pntPart = prev[pntPart];
                absNumPart--;
            } else {
                pntPart = next[pntPart];
                absNumPart++;
            }
        }
    };
    const deleteNode = (pntNode) => {
        stack.push(pntNode);
        let prevNode = prev[pntNode];
        let nextNode = next[pntNode];
        next[prevNode] = nextNode;
        prev[nextNode] = prevNode;
    };

    const insertAfter = (pntNode) => {
        let insNode = stack.pop();
        let nextNode = next[pntNode];
        next[pntNode] = insNode;
        prev[insNode] = pntNode;
        next[insNode] = nextNode;
        prev[nextNode] = insNode;
        return insNode;
    };

    let pntPartLeft, pntPartRight;
    for (let i = 0; i < k; i++) {
        [typeEvent, numPart] = events[i];
        selectPart(numPart);
        currentTax -= value[pntPart] * value[pntPart];
        switch (typeEvent) {
            case 1:
                pntPartRight = next[pntPart];
                pntPartLeft = prev[pntPart];
                if (numPart === 1) {
                    currentTax -= value[pntPartRight] * value[pntPartRight];
                    value[pntPartRight] += value[pntPart];
                    currentTax += value[pntPartRight] * value[pntPartRight];
                    deleteNode(pntPart);
                    pntPart = pntPartRight;
                } else if (numPart === cntParts) {
                    currentTax -= value[pntPartLeft] * value[pntPartLeft];
                    value[pntPartLeft] += value[pntPart];
                    currentTax += value[pntPartLeft] * value[pntPartLeft];
                    deleteNode(pntPart);
                    pntPart = pntPartLeft;
                    absNumPart--;
                } else {
                    currentTax -= value[pntPartLeft] * value[pntPartLeft] + value[pntPartRight] * value[pntPartRight];
                    value[pntPartLeft] += Math.floor(value[pntPart] / 2);
                    value[pntPartRight] += Math.ceil(value[pntPart] / 2);
                    currentTax += value[pntPartLeft] * value[pntPartLeft];
                    currentTax += value[pntPartRight] * value[pntPartRight];
                    deleteNode(pntPart);
                    pntPart = pntPartRight;
                }
                cntParts--;
                break;
            case 2:
                pntPartRight = insertAfter(pntPart);
                value[pntPartRight] = Math.ceil(value[pntPart] / 2);
                value[pntPart] = Math.floor(value[pntPart] / 2);
                currentTax += value[pntPart] * value[pntPart];
                currentTax += value[pntPartRight] * value[pntPartRight];
                cntParts++;
                break;
        }
        result.push(currentTax);
    }

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
    const n = readInt();
    const parts = readArray();

    const k = readInt();
    const events = [];

    for (let i = 0; i < k; i++) {
        events.push(readArray());
    }

    const result = simpleRiver(n, parts, k, events);

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

function readString() {
    const s = _inputLines[_curLine].trim();
    _curLine++;
    return s;
}

module.exports = simpleRiver;
