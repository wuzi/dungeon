import Dungeon from "./dungeon";
import TILES from "./tiles";

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
        width: { min: 3, onlyOdd: true },
        maxArea: 200
      }
    });
    expect(d.roomConfig).toMatchObject({
      width: { min: 3, max: 15, onlyOdd: true, onlyEven: false },
      height: { min: 5, max: 15, onlyOdd: false, onlyEven: false },
      maxArea: 200,
      maxRooms: 50
    });
    expect(d.width).toBe(20);
    expect(d.height).toBe(50);
  });

  test("should throw error if maxArea too small", () => {
    expect(() => {
      const d = new Dungeon({
        rooms: {
          width: { min: 10, max: 20 },
          height: { min: 10, max: 20 },
          maxArea: 20
        }
      });
    }).toThrowError(/exceeds the given maxArea/);
  });

  test("should not allow rooms smaller than 3 x 3", () => {
    expect(() => {
      const d = new Dungeon({
        rooms: {
          width: { min: 0, max: 20 },
          height: { min: -2, max: 20 }
        }
      });
    }).toThrowError(/width and height must be >= 3/);
  });

  test("should not allow room size min less than max", () => {
    expect(() => {
      const d = new Dungeon({
        rooms: {
          width: { min: 5, max: 4 },
          height: { min: 3, max: 1 }
        }
      });
    }).toThrowError(/width and height max must be >= min/);
  });
});

describe("A dungeon", () => {
  test("should not have doors in the corners of rooms", () => {
    const d = new Dungeon({
      width: 500,
      height: 500,
      rooms: {
        width: { min: 3, max: 11 },
        height: { min: 3, max: 11 },
        maxRooms: 1000
      }
    });
    for (const room of d.rooms) {
      expect(room.getTileAt(0, 0)).not.toBe(TILES.DOOR);
      expect(room.getTileAt(0, room.height - 1)).not.toBe(TILES.DOOR);
      expect(room.getTileAt(room.width - 1, 0)).not.toBe(TILES.DOOR);
      expect(room.getTileAt(room.width - 1, room.height - 1)).not.toBe(TILES.DOOR);
    }
  });
});
