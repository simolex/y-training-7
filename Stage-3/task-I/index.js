/**
 * Каждому по компьютеру
 */

class BIT3D {
    constructor(sizeX, sizeY, sizeZ) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.sizeZ = sizeZ;

        // Инициализируем трехмерный массив нулями
        this.tree = Array.from({ length: sizeX + 1 }, () =>
            Array.from({ length: sizeY + 1 }, () => new Array(sizeZ + 1).fill(0))
        );
    }

    // Обновление значения в точке (x, y, z)
    update(x, y, z, delta) {
        for (let i = x; i <= this.sizeX; i += i & -i) {
            for (let j = y; j <= this.sizeY; j += j & -j) {
                for (let k = z; k <= this.sizeZ; k += k & -k) {
                    this.tree[i][j][k] += delta;
                }
            }
        }
    }

    // Сумма от (1,1,1) до (x,y,z)
    query(x, y, z) {
        let res = 0;

        for (let i = x; i > 0; i -= i & -i) {
            for (let j = y; j > 0; j -= j & -j) {
                for (let k = z; k > 0; k -= k & -k) {
                    res += this.tree[i][j][k];
                }
            }
        }

        return res;
    }

    // Сумма в диапазоне от (x1,y1,z1) до (x2,y2,z2)
    rangeQuery(x1, y1, z1, x2, y2, z2) {
        return (
            this.query(x2, y2, z2) -
            this.query(x1 - 1, y2, z2) -
            this.query(x2, y1 - 1, z2) -
            this.query(x2, y2, z1 - 1) +
            this.query(x1 - 1, y1 - 1, z2) +
            this.query(x1 - 1, y2, z1 - 1) +
            this.query(x2, y1 - 1, z1 - 1) -
            this.query(x1 - 1, y1 - 1, z1 - 1)
        );
    }
}

function sumOnSegments(n, queries) {
    const cube = new BIT3D(n, n, n);

    return queries
        .map(([operation, ...params]) => {
            switch (operation) {
                case 1:
                    let [x, y, z, diff] = params;
                    cube.update(x + 1, y + 1, z + 1, diff);
                    break;
                case 2:
                    let [x1, y1, z1, x2, y2, z2] = params;
                    return [cube.rangeQuery(x1 + 1, y1 + 1, z1 + 1, x2 + 1, y2 + 1, z2 + 1)];
            }
        })
        .filter(Boolean)
        .map((r) => r.join(""));
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
    const n = readInt();

    let query;
    const queries = [];

    while ((query = readArray()) && query[0] !== 3) {
        queries.push(query);
    }
    const result = sumOnSegments(n, queries);
    console.log(result.join("\n"));
}

function readInt() {
    const n = Number(_inputLines[_curLine]);
    _curLine++;
    return n;
}

function readBigInt() {
    const n = BigInt(_inputLines[_curLine]);
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

function readStringArray() {
    var arr = _inputLines[_curLine]
        .trim(" ")
        .split(" ")
        .filter((str) => str && str.length > 0);
    _curLine++;
    return arr;
}

module.exports = sumOnSegments;
