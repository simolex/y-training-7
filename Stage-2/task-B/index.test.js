const solution = require(".");

describe("A. Количество максимумов на отрезке", () => {
    test("test-1", () => {
        const result = solution([-1, -2, 5, 3], [-4, 6]);
        expect(result).toBe("NW");
    });

    test("test-18", () => {
        const result = solution([-99, -100, 100, 100], [-100, -59]);
        expect(result).toBe("W");
    });
});
