import Dungeon from "./Dungeon";

describe("Dungeon constructor", () => {
  test("should use default config, if none specified", () => {
    const d = new Dungeon();
    expect(d.roomConfig).toMatchObject({
      width: { min: 5, max: 15, onlyOdd: false, onlyEven: false },
      height: { min: 5, max: 15, onlyOdd: false, onlyEven: false },
      maxArea: 150,
      maxRooms: 50
    });
    expect(d.width).toBe(50);
    expect(d.height).toBe(50);
  });

  test("should apply default config values for properties not specified", () => {
    const d = new Dungeon({
      width: 20,
      rooms: {
        width: { min: 2, onlyOdd: true },
        maxArea: 200
      }
    });
    expect(d.roomConfig).toMatchObject({
      width: { min: 2, max: 15, onlyOdd: true, onlyEven: false },
      height: { min: 5, max: 15, onlyOdd: false, onlyEven: false },
      maxArea: 200,
      maxRooms: 50
    });
    expect(d.width).toBe(20);
    expect(d.height).toBe(50);
  });

  test("should ignore maxArea if too small", () => {
    const d = new Dungeon({
      rooms: {
        width: { min: 10, max: 20 },
        height: { min: 10, max: 20 },
        maxArea: 20
      }
    });
    expect(d.roomConfig.maxArea).toBe(100);
  });
});
