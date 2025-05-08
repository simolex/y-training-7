/**
 * Каждому по компьютеру
 */

const codeSizes = Array.from({ length: 24 }, (_, i) => [1 << i, i]);

function pack(text) {
    let len = text.length;
    const dictionary = {};
    const result = [];
    let a = "a".charCodeAt(0);
    for (let i = a; i <= "z".charCodeAt(0); i++) {
        dictionary[String.fromCharCode(i)] = i - a + 1;
    }
    let nextCode = 27;
    let codeSizeIndex = 0;
    let currentCodeSize = 1;

    let left = 0;
    let outputCode = "";
    while (left < len) {
        let right = left;
        let current = text[right++];
        while (right < len && current in dictionary) {
            current += text[right++];
        }

        while (codeSizes[codeSizeIndex][0] < nextCode) {
            currentCodeSize = codeSizes[++codeSizeIndex][1];
        }

        if (!(current in dictionary)) {
            outputCode += dictionary[current.slice(0, -1)].toString(2).padStart(currentCodeSize, "0");
            outputCode += dictionary[current.slice(-1)].toString(2).padStart(5, "0");

            dictionary[current] = nextCode++;
        } else {
            outputCode += dictionary[current].toString(2).padStart(currentCodeSize, "0");
        }

        while (outputCode.length >= 8) {
            result.push(parseInt(outputCode.slice(0, 8), 2));
            outputCode = outputCode.slice(8);
        }
        left = right;
    }

    if (outputCode.length > 0) {
        result.push(parseInt(outputCode.slice(0, 8).padEnd(8, "0"), 2));
    }

    return result;
}

function unpack(n, codes) {
    let result = "";
    const dictionary = [""];

    let a = "a".charCodeAt(0);
    for (let i = a; i <= "z".charCodeAt(0); i++) {
        dictionary.push(String.fromCharCode(i));
    }
    let nextCode = dictionary.length;
    let codeSizeIndex = 0;
    let currentCodeSize = 1;

    let prefix = "";
    let currentCode = "";
    let currentByte = 0;
    let inputBuffer = "";
    while (currentByte < n) {
        while (codeSizes[codeSizeIndex][0] < nextCode) {
            currentCodeSize = codeSizes[++codeSizeIndex][1];
        }

        while (currentByte < n && inputBuffer.length < currentCodeSize + 5) {
            inputBuffer += codes[currentByte++].toString(2).padStart(8, "0");
        }

        currentCode = inputBuffer.slice(0, currentCodeSize);
        inputBuffer = inputBuffer.slice(currentCodeSize);
        prefix = dictionary[parseInt(currentCode, 2)];
        result += prefix;

        if (inputBuffer.length >= 5) {
            currentCode = inputBuffer.slice(0, 5);
            inputBuffer = inputBuffer.slice(5);
            prefix += dictionary[parseInt(currentCode, 2)];
            result += dictionary[parseInt(currentCode, 2)];
            dictionary.push(prefix);
            nextCode++;
        }
    }
    return result;
}

const _readline = require("readline");

const _reader = _readline.createInterface({
    input: process.stdin
});

const _inputLines = [];
let _curLine = 0;

let command;

_reader.on("line", (line) => {
    _inputLines.push(line);

    if (_inputLines.length === 1) {
        command = readString();
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
