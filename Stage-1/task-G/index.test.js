const solution = require(".");

describe("G. Две стены", () => {
    test("test-1", () => {
        const result = solution(4, 6, [2, 4, 1, 2], [7, 2, 5, 1]);
        expect(result).toEqual([1, 3, 4]);
    });
});
