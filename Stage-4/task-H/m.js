const fs = require("fs");
const input = fs.readFileSync(0, "utf-8").trim().split("\n");

function main() {
    let ptr = 0;
    const [n, m, k] = input[ptr++].trim().split(" ").map(Number);
    const edges = new Map();

    // Считываем рёбра графа
    for (let i = 0; i < m; i++) {
        const [u, v] = input[ptr++].trim().split(" ").map(Number);
        const key = u < v ? `${u} ${v}` : `${v} ${u}`;
        edges.set(key, false); // false означает, что ребро ещё не удалено
    }

    const operations = [];
    const askIndices = [];

    // Считываем операции
    for (let i = 0; i < k; i++) {
        const parts = input[ptr++].trim().split(" ");
        const op = parts[0];
        let u = parseInt(parts[1], 10);
        let v = parseInt(parts[2], 10);
        if (u > v) [u, v] = [v, u];
        const key = `${u} ${v}`;

        if (op === "cut") {
            operations.push({ type: "cut", u, v });
            edges.set(key, true); // помечаем ребро как удалённое
        } else {
            operations.push({ type: "ask", u, v });
            askIndices.push(i);
        }
    }

    // Инициализация DSU
    const parent = Array(n + 1)
        .fill(0)
        .map((_, i) => i);
    const rank = Array(n + 1).fill(1);

    function find(u) {
        while (parent[u] !== u) {
            parent[u] = parent[parent[u]]; // Path compression
            u = parent[u];
        }
        return u;
    }

    function union(u, v) {
        const uRoot = find(u);
        const vRoot = find(v);
        if (uRoot === vRoot) return;

        // Union by rank
        if (rank[uRoot] > rank[vRoot]) {
            parent[vRoot] = uRoot;
            rank[uRoot] += rank[vRoot];
        } else {
            parent[uRoot] = vRoot;
            rank[vRoot] += rank[uRoot];
        }
    }

    // Добавляем все рёбра, которые не были удалены
    for (const [key, deleted] of edges) {
        if (!deleted) {
            const [u, v] = key.split(" ").map(Number);
            union(u, v);
        }
    }

    // Обрабатываем операции в обратном порядке
    const reversedAnswers = [];
    for (let i = operations.length - 1; i >= 0; i--) {
        const op = operations[i];
        if (op.type === "ask") {
            const uRoot = find(op.u);
            const vRoot = find(op.v);
            reversedAnswers.push(uRoot === vRoot ? "YES" : "NO");
        } else {
            const key = `${op.u} ${op.v}`;
            union(op.u, op.v);
        }
    }

    // Ответы на ask шли в обратном порядке, поэтому разворачиваем
    reversedAnswers.reverse();

    // Выводим ответы в исходном порядке ask
    let askCount = 0;
    const output = [];
    for (const op of operations) {
        if (op.type === "ask") {
            output.push(reversedAnswers[askCount++]);
        }
    }

    console.log(output.join("\n"));
}

main();
