/**
 *  Распределение задач*
 */

function goodDays(n, orders) {
    const oddList = [];
    const evenList = [];
    const selectorList = {
        0: evenList,
        1: oddList
    };
    // Делим на слова четной и нечетной длины + выгода для Васи
    let currentList, order;
    const oddEvenDays = [];
    for (let i = 0; i < n; i++) {
        order = orders[i];
        currentList = selectorList[order.length % 2];
        oddEvenDays[0] = oddEvenDays[1] = 0;
        for (let d = 0; d < order.length; d++) {
            if (order[d] === "S") {
                oddEvenDays[d % 2]++;
            }
        }
        currentList.push([...oddEvenDays, oddEvenDays[0] - oddEvenDays[1]]);
    }

    oddList.sort((a, b) => b[2] - a[2] || b[0] - a[0]);
    evenList.sort((a, b) => b[2] - a[2] || b[0] - a[0]);

    // Максимизируем четные выгоды
    let maxByEvenList = 0;
    if (oddList.length > 0 && evenList.length > 0) {
        let prefix = evenList[0][0];
        let suffix = 0;
        for (let i = 1; i < evenList.length; i++) {
            suffix += evenList[i][1];
        }
        maxByEvenList = prefix + suffix;

        for (let i = 1; i < evenList.length - 1; i++) {
            prefix += evenList[i][0];
            suffix -= evenList[i][1];
            if (maxByEvenList < prefix + suffix) maxByEvenList = prefix + suffix;
        }
    } else {
        for (let i = 0; i < evenList.length; i++) {
            maxByEvenList += evenList[i][0];
        }
    }
    // Считаем нечетные выгоды
    let lenOddList = oddList.length;
    let maxByOddList = lenOddList % 2 ? oddList[Math.floor(lenOddList / 2)][0] : 0;
    for (let i = 0; i < Math.floor(lenOddList / 2); i++) {
        maxByEvenList += oddList[i][0] + oddList[lenOddList - i - 1][1];
    }

    return maxByEvenList + maxByOddList;
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
    const orders = [];

    for (let i = 0; i < n; i++) {
        orders.push(readString());
    }

    const result = goodDays(n, orders);

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

module.exports = goodDays;
