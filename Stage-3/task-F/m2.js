const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = [];
let ptr = 0;
let N, K;
let xyPairs = new Set();
let xzPairs = new Set();
let yzPairs = new Set();
let allRooks = new Set();

rl.on("line", (line) => {
    input.push(line);
});

rl.on("close", () => {
    const data = input
        .join(" ")
        .split(/\s+/)
        .filter((x) => x)
        .map(Number);
    ptr = 0;
    N = data[ptr++];
    K = data[ptr++];

    for (let i = 0; i < K; i++) {
        const x = data[ptr++];
        const y = data[ptr++];
        const z = data[ptr++];
        xyPairs.add(`${x},${y}`);
        xzPairs.add(`${x},${z}`);
        yzPairs.add(`${y},${z}`);
        allRooks.add(`${x},${y},${z}`);
    }

    // Проверяем, покрыты ли все точки
    let allCovered = true;
    let missingX, missingY, missingZ;

    outer: for (let x = 1; x <= N; x++) {
        for (let y = 1; y <= N; y++) {
            for (let z = 1; z <= N; z++) {
                // Проверяем, покрыта ли клетка (x, y, z)
                if (!xyPairs.has(`${x},${y}`) && !xzPairs.has(`${x},${z}`) && !yzPairs.has(`${y},${z}`)) {
                    console.log("NO");
                    console.log(`${x} ${y} ${z}`);
                    return;
                }
            }
        }
    }

    // Если все точки покрыты
    console.log("YES");
});
