import TILES from "./tiles";

// Debug by dumping a table to the console where each element in the map is the number of rooms in
// that location
export function debugRoomGrid(dungeon) {
  const table = dungeon.roomGrid.map(row => row.map(elem => `${elem.length}`.padStart(2)));
  console.log(table.map(row => row.join(" ")).join("\n"));
}

// Debug by returning a colored(!) table string where each tile in the map is represented with an
// ASCII string
export function debugMap(dungeon, config = {}) {
  config = Object.assign(
    {},
    {
      empty: " ",
      emptyColor: "rgb(0, 0, 0)",
      wall: "#",
      wallColor: "rgb(255, 0, 0)",
      floor: "_",
      floorColor: "rgb(210, 210, 210)",
      door: ".",
      doorColor: "rgb(0, 0, 255)",
      fontSize: "15px"
    },
    config
  );

  let string = "";
  let styles = [];
  for (let y = 0; y < dungeon.height; y += 1) {
    for (let x = 0; x < dungeon.width; x += 1) {
      const tile = dungeon.tiles[y][x];
      if (tile === TILES.EMPTY) {
        string += `%c${config.empty}`;
        styles.push(`color: ${config.emptyColor}; font-size: ${config.fontSize}`);
      } else if (tile === TILES.WALL) {
        string += `%c${config.wall}`;
        styles.push(`color: ${config.wallColor}; font-size: ${config.fontSize}`);
      } else if (tile === TILES.FLOOR) {
        string += `%c${config.floor}`;
        styles.push(`color: ${config.floorColor}; font-size: ${config.fontSize}`);
      } else if (tile === TILES.DOOR) {
        string += `%c${config.door}`;
        styles.push(`color: ${config.doorColor}; font-size: ${config.fontSize}`);
      }
      string += " ";
    }
    string += "\n";
  }
  console.log(string, ...styles);
}
