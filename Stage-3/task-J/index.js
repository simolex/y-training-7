/**
 * Каждому по компьютеру
 */

function pack(text) {
    let len = text.length;
    const dictionary = {};
    const result = [];
    let a = "a".charCodeAt(0);
    for (let i = a; i <= "z".charCodeAt(0); i++) {
        dictionary[String.fromCharCode(i)] = i - a + 1;
    }
    let nextCode = 27;

    let left = 0;
    while (left < len) {
        let right = left;
        let current = text[right++];
        while (right < len && current in dictionary) {
            current += text[right++];
        }

        if (!(current in dictionary)) {
            result.push(dictionary[current.slice(0, -1)], current.slice(-1));
            dictionary[current] = nextCode++;
        } else {
            result.push(dictionary[current]);
        }
        left = right;
    }

    console.log(result);
    return [];
}

function unpack(n, codes) {
    return "";
}

const _readline = require("readline");

const _reader = _readline.createInterface({
    input: process.stdin,
});

const _inputLines = [];
let _curLine = 0;

let command;
let code;

_reader.on("line", (line) => {
    _inputLines.push(line);

    if (_inputLines.length === 1) {
        command = readString();
        console.log(command);
    } else if (command === "pack" && _inputLines.length === 2) {
        const result = pack(readString());
        console.log(result.length);
        console.log(result.join(" "));
    } else if (command === "unpack" && _inputLines.length === 3) {
        const n = readInt();
        const codes = readArray();
        const result = unpack(n, codes);
        console.log(result);
    }
});

// process.stdin.on("end", solve);

function solve() {
    const command = readString();

    switch (command) {
        case "pack":
            {
                const result = pack(readString());
                console.log(result.length);
                console.log(result.join(" "));
            }
            break;
        case "unpack":
            {
                const n = readInt();
                const codes = readArray();
                const result = unpack(n, codes);
            }
            console.log(result);
    }
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

module.exports = { pack, unpack };
