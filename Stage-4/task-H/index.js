/**
 * Каждому по компьютеру
 */

class DSU {
    parent;
    weight;
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.weight = Array(n).fill(1);
    }

    find(v) {
        return this.parent[v] === v ? v : (this.parent[v] = this.find(this.parent[v]));
    }

    union(a, b) {
        a = this.find(a);
        b = this.find(b);
        if (a !== b) {
            if (this.weight[a] > this.weight[b]) {
                [a, b] = [b, a];
            }
            this.weight[b] += this.weight[a];
            this.parent[a] = b;
        }
    }

    size(v) {
        v = this.find(v);
        return this.weight[v];
    }
}

function cutGraph(n, m, k, edges, commands) {
    const dsu = new DSU(n + 1);
    const graph = new Map();

    for (let i = 0; i < m; i++) {
        const [u, v] = edges[i];

        if (!graph.has(u)) {
            graph.set(u, new Set());
        }
        graph.get(u).add(v);

        if (!graph.has(v)) {
            graph.set(v, new Set());
        }
        graph.get(v).add(u);
    }

    const result = [];

    for (let i = k - 1; i >= 0; i--) {
        const [operation, u, v] = commands[i];
        switch (operation) {
            case "ask":
                result.push(dsu.find(u) === dsu.find(v) ? "YES" : "NO");
                break;
            case "cut":
                if (graph.has(u) && graph.get(u).has(v)) {
                    dsu.union(u, v);
                }
                break;
        }
    }

    result.reverse();
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
    const [n, m, k] = readArray();

    const edges = [];
    for (let i = 0; i < m; i++) {
        edges.push(readArray());
    }

    const commands = [];
    for (let i = 0; i < k; i++) {
        commands.push(
            readString()
                .split(" ")
                .map((str, i) => (i > 0 ? Number(str) : str))
        );
    }

    const result = cutGraph(n, m, k, edges, commands);
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

module.exports = cutGraph;
