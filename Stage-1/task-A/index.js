/**
 * Каждому по компьютеру
 */

function eachComputers(n, m, students, rooms) {
    const resStudents = students.map((c, i) => [c, i, -1]); // student, index, room
    const idxRooms = Array.from({ length: m }, (_, i) => i);

    resStudents.sort((a, b) => b[0] - a[0]);
    idxRooms.sort((a, b) => rooms[b] - rooms[a]);

    let j = 0;
    let count = 0;
    for (let i = 0; i < m && j < n; i++) {
        while (j < n && resStudents[j][0] + 1 > rooms[idxRooms[i]]) {
            j++;
        }
        if (j < n) {
            resStudents[j][2] = idxRooms[i];
            count++;
        }
        j++;
    }

    resStudents.sort((a, b) => a[1] - b[1]);

    return { count, recept: resStudents.map((g) => g[2] + 1) };
}

const _readline = require("readline");

const _reader = _readline.createInterface({
    input: process.stdin,
});

const _inputLines = [];
let _curLine = 0;

_reader.on("line", (line) => {
    _inputLines.push(line);
});

process.stdin.on("end", solve);

function solve() {
    const [n, m] = readArray();

    const students = readArray();
    const rooms = readArray();

    const result = eachComputers(n, m, students, rooms);

    console.log(result.count);
    console.log(result.recept.join(" "));
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

module.exports = eachComputers;
