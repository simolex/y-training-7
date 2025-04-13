/**
 *  Распределение задач*
 */

function goodDays(n, orders) {
    let result = 0;
    const oddList = [];
    const evenList = [];

    const selectorList = {
        0: evenList,
        1: oddList
    };

    let currentList, order, item;
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
        item = [...oddEvenDays, oddEvenDays[0] - oddEvenDays[1]];
        currentList.push(item);
    }

    oddList.sort((a, b) => b[2] - a[2] || b[0] - a[0]);
    evenList.sort((a, b) => b[2] - a[2] || b[0] - a[0]);

    let isOdd = 1;
    let count = 0;
    console.log(evenList, oddList);

    for (let i = 0; i < evenList.atOdd.length; i++) {
        count += evenList.atOdd[i][1];
    }
    for (let i = 0; i < evenList.atBoth.length; i++) {
        count += evenList.atBoth[i][1];
    }
    if (oddList.atOdd.length > 0) {
        count += oddList.atOdd.pop()[1];
        isOdd = 1 - isOdd;
    }
    if (isOdd === 1) {
        if (oddList.atEven.length > 0) {
            count += oddList.atEven.shift()[1];
            isOdd = 1 - isOdd;
        } else if (oddList.atBoth.length > 0) {
            count += oddList.atBoth.pop()[1];
            isOdd = 1 - isOdd;
        }
    }
    for (let i = 0; i < evenList.atEven.length; i++) {
        count += evenList.atEven[i][0];
    }
    while (oddList.atOdd.length) {
        count += oddList.atOdd.pop()[isOdd];
        isOdd = 1 - isOdd;
        if (oddList.atEven.length) {
            isOdd = 1 - isOdd;
            count += oddList.atEven.pop()[isOdd];
        } else if (oddList.atBoth.length) {
            count += oddList.atBoth.pop()[isOdd];
            isOdd = 1 - isOdd;
        } else if (oddList.atOdd.length) {
            isOdd = 1 - isOdd;
            count += oddList.atOdd.shift()[isOdd];
        }
    }

    while (oddList.atEven.length) {
        count += oddList.atEven.pop()[isOdd];
        isOdd = 1 - isOdd;
        if (oddList.atOdd.length) {
            isOdd = 1 - isOdd;
            count += oddList.atOdd.pop()[isOdd];
        } else if (oddList.atBoth.length) {
            count += oddList.atBoth.pop()[isOdd];
            isOdd = 1 - isOdd;
        } else if (oddList.atEven.length) {
            isOdd = 1 - isOdd;
            count += oddList.atEven.shift()[isOdd];
        }
    }

    return count;
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
