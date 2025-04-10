const solution = require(".");

describe("D. Рюкзак: наибольший вес", () => {
    test("test-1", () => {
        const result = solution(5968, [18]);
        expect(result).toBe(18);
    });
});
