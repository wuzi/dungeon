import TILES from "./tiles";

// Debug by dumping a table to the console where each element in the map is the number of rooms in
// that location
export function debugRoomGrid(dungeon) {
  const table = dungeon.roomGrid.map(row => row.map(elem => `${elem.length}`.padStart(2)));
  console.log(table.map(row => row.join(" ")).join("\n"));
}

// Debug by dumping the dungeon into an HTML string that can be inserted into HTML. The structure
// is:
//  <pre>
//    <span>#</span> <span>.</span> <span>#</span> <span>#</span>
//    <span>#</span> <span> </span> <span> </span> <span>#</span>
//    <span>#</span> <span> </span> <span> </span> <span>.</span>
//    <span>#</span> <span> </span> <span> </span> <span>#</span>
//    <span>#</span> <span>#</span> <span>#</span> <span>#</span>
//  </pre>
export function debugHtmlMap(dungeon, config = {}) {
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

  const tiles = dungeon.getMappedTiles({
    empty: `<span style="color: ${config.emptyColor}">${config.empty}</span>`,
    floor: `<span style="color: ${config.floorColor}">${config.floor}</span>`,
    door: `<span style="color: ${config.doorColor}">${config.door}</span>`,
    wall: `<span style="color: ${config.wallColor}">${config.wall}</span>`
  });
  const pre = document.createElement("pre");
  pre.innerHTML = tiles.map(row => row.join(" ")).join("\n");
  return pre;
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

  // First line in the browser console window has console line mapping (e.g. "dungeon.js:724") which
  // throws off the table. Kill two birds by displaying a guide on the first two lines.
  string += `Dungeon: the console window should be big enough to see all of the guide on the next line:\n`;
  string += `%c|${"=".repeat(dungeon.width * 2 - 2)}|\n\n`;
  styles.push(`font-size: ${config.fontSize}`);

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
