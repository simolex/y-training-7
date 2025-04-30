/**
 * Каждому по компьютеру
 */

var Node = function (key, value, next = null, prev = null) {
    this.key = key;
    this.value = value;
    this.prev = prev;
    this.next = next;
};

var LRUCache = function (capacity) {
    this.capacity = capacity;
    this.hash = new Map();
    this.head = new Node(-1, -1, new Node(-1, -1));
    this.tail = this.head.next;
    this.tail.prev = this.head;
    this.size = 0;
};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function (key) {
    if (!this.hash.has(key)) return -1;

    const node = this.hash.get(key);
    const prevNode = node.prev;
    const nextNode = node.next;
    prevNode.next = nextNode;
    nextNode.prev = prevNode;

    const firstNode = this.head.next;
    this.head.next = node;
    node.prev = this.head;
    node.next = firstNode;
    firstNode.prev = node;

    return this.hash.get(key).value;
};

LRUCache.prototype.getByIndex = function (index) {
    let i = ((index - 1) % this.size) + 1;

    let node = this.head;

    while (i) {
        node = node.next;
        i--;
    }

    const prevNode = node.prev;
    const nextNode = node.next;
    prevNode.next = nextNode;
    nextNode.prev = prevNode;

    const firstNode = this.head.next;
    this.head.next = node;
    node.prev = this.head;
    node.next = firstNode;
    firstNode.prev = node;

    return node.value;
};

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function (key, value) {
    const next = this.head.next;
    this.head.next = new Node(key, value, next, this.head);
    this.hash.set(key, this.head.next);
    next.prev = this.head.next;
    this.size++;
};

function switchingWindows(n, commands) {
    const lru = new LRUCache(1000);

    return commands.map((cmd, i) => {
        let fn = cmd.substring(0, 3);
        let params = cmd.substring(4);
        switch (fn.toLowerCase()) {
            case "run":
                lru.put(i, params);
                return params;
            // break;
            case "alt":
                // console.log(params.split("+").length);
                return lru.getByIndex(params.split("+").length + 1);
        }
    });
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
    const n = readBigInt();
    const commands = [];

    for (let i = 0; i < n; i++) {
        commands.push(readString());
    }

    const result = switchingWindows(n, commands);

    console.log(result.join("\n"));
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

module.exports = switchingWindows;
