const solution = require(".");

describe("E. Рюкзак: наибольшая стоимость", () => {
    test("test-1", () => {
        const result = solution(1, 597, [18], [16]);
        expect(result).toBe(16);
    });
    test("test-2", () => {
        const result = solution(2, 789, [45, 44], [51, 41]);
        expect(result).toBe(92);
    });
});
