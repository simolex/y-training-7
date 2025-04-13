function solve() {
    const readline = require("readline");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let input = [];
    rl.on("line", (line) => {
        input.push(line);
    });

    rl.on("close", () => {
        const [firstLine, ...rest] = input;
        const [N, S] = firstLine.split(" ").map(Number);

        const items = [];
        for (let i = 0; i < N; i++) {
            const [v, c, p] = rest[i].split(" ").map(Number);
            items.push({ v, c, p, idx: i + 1 });
        }

        const maxU = items.reduce((sum, item) => sum + item.v, 0);
        let bestCost = -1;
        let bestU = -1;
        let bestSelection = [];

        for (let U = 0; U <= maxU; U++) {
            const P = Math.max(0, U - S);
            const filteredItems = items.filter((item) => item.p >= P);

            const dp = Array(U + 1).fill(-1);
            dp[0] = 0;
            const prev = Array.from({ length: U + 1 }, () => []);

            for (const item of filteredItems) {
                for (let u = U; u >= item.v; u--) {
                    if (dp[u - item.v] !== -1) {
                        if (dp[u] < dp[u - item.v] + item.c) {
                            dp[u] = dp[u - item.v] + item.c;
                            prev[u] = [...prev[u - item.v], item.idx];
                        }
                    }
                }
            }

            if (dp[U] > bestCost) {
                bestCost = dp[U];
                bestU = U;
                bestSelection = prev[U] || [];
            }
        }

        console.log(`${bestSelection.length} ${bestCost}`);
        if (bestSelection.length > 0) {
            console.log(bestSelection.join(" "));
        } else {
            console.log();
        }
    });
}

solve();
