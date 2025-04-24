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

    if (xCoords.size === N && yCoords.size === N && zCoords.size === N) {
        console.log("YES");
    } else {
        let missingX = null;
        for (let x = 1; x <= N; x++) {
            if (!xCoords.has(x)) {
                missingX = x;
                break;
            }
        }
        let missingY = null;
        for (let y = 1; y <= N; y++) {
            if (!yCoords.has(y)) {
                missingY = y;
                break;
            }
        }
        let missingZ = null;
        for (let z = 1; z <= N; z++) {
            if (!zCoords.has(z)) {
                missingZ = z;
                break;
            }
        }
        console.log("NO");
        console.log(
            `${missingX !== null ? missingX : 1} ${missingY !== null ? missingY : 1} ${
                missingZ !== null ? missingZ : 1
            }`
        );
    }
});
