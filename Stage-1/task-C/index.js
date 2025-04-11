/**
 *  Интернет
 */

function internet(m, a) {
    let result = 0;
    let remaining = m;

    const cards = a.map((seconds, k) => ({
        cost: 1 << k, // 2^k рублей
        seconds,
        ratio: seconds / (1 << k), // эффективность
    }));

    // Сортируем по убыванию эффективности
    cards.sort((a, b) => b.ratio - a.ratio);

    let monoCards = Infinity;

    for (let k = 0; k <= 30; k++) {
        if (Math.ceil(m / cards[k].seconds) > 0)
            monoCards = Math.min(monoCards, Math.ceil(m / cards[k].seconds) * cards[k].cost);
        if (remaining < 0) break;

        if (cards[k].seconds === 0) continue; // Пропускаем, если карточка не дает секунд

        const count = Math.floor(remaining / cards[k].seconds);
        result += count * cards[k].cost;
        remaining -= count * cards[k].seconds;
    }

    return Math.min(monoCards, result);
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
    const m = readInt();
    const a = readArray();

    const result = internet(m, a);

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

module.exports = internet;
