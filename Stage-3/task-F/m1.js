const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = [];
let ptr = 0;
let N, K;
let xCoords = new Set();
let yCoords = new Set();
let zCoords = new Set();

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
        xCoords.add(x);
        yCoords.add(y);
        zCoords.add(z);
    }

    // Проверяем, покрыты ли все точки
    let allCovered = true;
    let missingX, missingY, missingZ;

    // Проверяем, есть ли хотя бы одна ладья с каждой координатой X, Y, Z
    if (xCoords.size === N && yCoords.size === N && zCoords.size === N) {
        console.log("YES");
        return;
    }

    // Если нет, ищем непокрытую точку
    for (let x = 1; x <= N; x++) {
        for (let y = 1; y <= N; y++) {
            for (let z = 1; z <= N; z++) {
                if (!xCoords.has(x) && !yCoords.has(y) && !zCoords.has(z)) {
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
