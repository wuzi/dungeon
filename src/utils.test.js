import { randomInteger } from "./utils";

describe("randomInteger", () => {
  test("should return a number between min and max", () => {
    Array(100)
      .map(() => randomInteger(3, 5))
      .forEach(r => {
        expect(r).toBeGreaterThanOrEqual(3);
        expect(r).toBeLessThanOrEqual(5);
      });
  });

  test("should return a number between min and max when min > max", () => {
    Array(100)
      .map(() => randomInteger(5, 3))
      .forEach(r => {
        expect(r).toBeGreaterThanOrEqual(3);
        expect(r).toBeLessThanOrEqual(5);
      });
  });

  test("should return an even number when isEven option is used", () => {
    Array(100)
      .map(() => randomInteger(2, 30, { isEven: true }))
      .forEach(r => {
        expect(r % 2).toBe(0);
      });
  });

  test("should return an even number when isEven option is used and parameters are odd", () => {
    Array(100)
      .map(() => randomInteger(3, 31, { isEven: true }))
      .forEach(r => {
        expect(r % 2).toBe(0);
      });
  });

  test("should return an odd number when isOdd option is used", () => {
    Array(100)
      .map(() => randomInteger(3, 31, { isOdd: true }))
      .forEach(r => {
        expect(r % 2).toBe(1);
      });
  });

  test("should return an odd number when isOdd option is used and parameters are even", () => {
    Array(100)
      .map(() => randomInteger(2, 30, { isOdd: true }))
      .forEach(r => {
        expect(r % 2).toBe(1);
      });
  });
});
