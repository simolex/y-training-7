/**
 * Каждому по компьютеру
 */

var Node = function (index, value, next = null, prev = null) {
    this.index = index;
    this.value = value;
    this.prev = prev;
    this.next = next;
};

function weakPart(n, ranks) {
    const next = new Uint32Array(n + 2);
    const prev = new Uint32Array(n + 2);
    const value = new Uint32Array(n + 2);
    const index = new Uint32Array(n + 2);
    const weakPlayerSet = new Set();

    size = n;

    for (let i = 0; i < n; i++) {
        value[i] = ranks[i];
        next[i] = (i + 1) % n;
        prev[i] = (i - 1 + n) % n;
        index[i] = i;
    }

    for (let i = 0; i < n; i++) {
        if (value[prev[i]] > value[i] && value[next[i]] > value[i]) {
            weakPlayerSet.add(i);
        }
    }

    const result = Array(n).fill(0);
    let range = 0;
    let isGame = true;

    while (size > 2 && isGame) {
        isGame = false;
        range++;

        const nextRange = [];

        [...weakPlayerSet.values()].forEach((player) => {
            weakPlayerSet.delete(player);

            if (value[prev[player]] > value[player] && value[next[player]] > value[player]) {
                weakPlayerSet.add(player);
            }
        });

        [...weakPlayerSet.values()].forEach((player) => {
            weakPlayerSet.delete(player);

            if (value[prev[player]] > value[player] && value[next[player]] > value[player]) {
                result[index[player]] = range;

                if (value[prev[player]] < value[next[player]]) {
                    weakPlayerSet.add(prev[player]);
                } else {
                    weakPlayerSet.add(next[player]);
                }
                next[prev[player]] = next[player];
                prev[next[player]] = prev[player];

                size--;
                isGame = true;
            }
        });
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
    const ranks = readArray();

    const result = weakPart(n, ranks);

    console.log(result.join(" "));
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

module.exports = weakPart;
