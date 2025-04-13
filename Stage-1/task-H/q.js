const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = [];
let lineCount = 0;
let N = 0;
let orders = [];

rl.on("line", (line) => {
    if (lineCount === 0) {
        N = parseInt(line);
        lineCount++;
    } else {
        orders.push(line);
        lineCount++;
        if (orders.length === N) {
            rl.close();
        }
    }
}).on("close", () => {
    // Функция для вычисления s_vasya и s_masha при заданном total_days
    function calculate(order, total_days) {
        let s_vasya = 0;
        let s_masha = 0;
        for (let j = 0; j < order.length; j++) {
            if (order[j] === "S") {
                if ((total_days + j + 1) % 2 === 1) {
                    s_vasya++;
                } else {
                    s_masha++;
                }
            }
        }
        return { s_vasya, s_masha };
    }

    // Изначальная сортировка заказов по s_vasya - s_masha (предполагая total_days = 0)
    let ordersInfo = orders.map((order) => {
        const { s_vasya, s_masha } = calculate(order, 0);
        return { order, s_vasya, s_masha, diff: s_vasya - s_masha, length: order.length };
    });

    // Сортируем заказы по убыванию diff, затем по нечетной длине
    ordersInfo.sort((a, b) => b.diff - a.diff || (b.length % 2) - (a.length % 2));

    let total_vasya = 0;
    let total_days = 0;

    for (const info of ordersInfo) {
        const { order } = info;
        const { s_vasya } = calculate(order, total_days);
        total_vasya += s_vasya;
        total_days += order.length;
    }

    console.log(total_vasya);
});
