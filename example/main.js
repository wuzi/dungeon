const dungeon = new Dungeon({
  width: 50,
  height: 50,
  rooms: {
    width: {
      min: 5,
      max: 15,
      onlyOdd: true // or onlyEven: true
    },
    height: {
      min: 5,
      max: 15,
      onlyOdd: true // or onlyEven: true
    },
    maxArea: 150,
    maxRooms: 50
  }
});

dungeon.drawToConsole({
  empty: " ",
  emptyColor: "rgb(0, 0, 0)",
  wall: "#",
  wallColor: "rgb(255, 0, 0)",
  floor: "0",
  floorColor: "rgb(210, 210, 210)",
  door: "x",
  doorColor: "rgb(0, 0, 255)",
  fontSize: "15px"
});

dungeon.rooms; // Array of Room instances
dungeon.tiles; // 2D array of tile IDs - see Tile.js for types

// Get a 2D array of tiles where each tile type is remapped to a custom value. Useful if you are
// using this in a tilemap.
const mappedTiles = dungeon.getMappedTiles({
  empty: 0,
  floor: 1,
  door: 2,
  wall: 3
});
