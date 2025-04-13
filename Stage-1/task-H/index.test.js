const solution = require(".");

describe("H. Распределение задач*", () => {
    test("test-1", () => {
        const result = solution([
            [1, 3, 3, 3, 2],
            [1, 9, 8, 7, 6, 7, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [7, 2, 3, 4, 3, 2, 7]
        ]);
        expect(result).toEqual([
            [1, 3, 1],
            [1, 6, 9],
            [2, 3, 2]
        ]);
    });
});
