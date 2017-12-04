import { randomInteger, randomPick } from "./utils.js";
import Room from "./Room.js";
import TILES from "./tiles.js";
import { debugMap, debugRoomGrid } from "./debug";

const defaultConfig = {
  width: 50,
  height: 50,
  rooms: {
    width: { min: 5, max: 15, onlyOdd: false, onlyEven: false },
    height: { min: 5, max: 15, onlyOdd: false, onlyEven: false },
    maxArea: 150,
    maxRooms: 50
  }
};

export default class Dungeon {
  constructor(config = {}) {
    const roomConfig = config.rooms || {};
    roomConfig.width = Object.assign({}, defaultConfig.rooms.width, roomConfig.width);
    roomConfig.height = Object.assign({}, defaultConfig.rooms.height, roomConfig.height);
    roomConfig.maxArea = roomConfig.maxArea || defaultConfig.rooms.maxArea;
    roomConfig.maxRooms = roomConfig.maxRooms || defaultConfig.rooms.maxRooms;

    // Avoid an impossibly small maxArea
    const minArea = roomConfig.width.min * roomConfig.height.min;
    if (roomConfig.maxArea < minArea) roomConfig.maxArea = minArea;

    this.width = config.width || defaultConfig.width;
    this.height = config.height || defaultConfig.height;
    this.roomConfig = roomConfig;
    this.rooms = [];

    // 2D grid matching map dimensions where every element contains an array of all the rooms in
    // that location
    this.roomGrid = [];

    this.generate();
    this.tiles = this.getTiles();
  }

  drawToConsole(config) {
    debugMap(this, config);
  }

  generate() {
    this.rooms = [];
    this.roomGrid = [];

    for (let y = 0; y < this.height; y++) {
      this.roomGrid.push([]);
      for (let x = 0; x < this.width; x++) {
        this.roomGrid[y].push([]);
      }
    }

    // Seed the map with a starting randomly sized room in the center of the map
    const room = this.createRandomRoom();
    room.setPosition(
      Math.floor(this.width / 2) - Math.floor(room.width / 2),
      Math.floor(this.height / 2) - Math.floor(room.height / 2)
    );
    this.addRoom(room);

    // Continue generating rooms until we hit our cap or have hit our maximum iterations (generally
    // due to not being able to fit any more rooms in the map)
    let i = this.roomConfig.maxRooms * 5;
    while (this.rooms.length < this.roomConfig.maxRooms && i > 0) {
      this.generateRoom();
      i -= 1;
    }

    // Now we want to randomly add doors between some of the rooms and other rooms they touch
    for (let i = 0; i < this.rooms.length; i++) {
      // Find all rooms that we could connect with this one
      const targets = this.getPotentiallyTouchingRooms(this.rooms[i]);
      for (let j = 0; j < targets.length; j++) {
        // Make sure the rooms aren't already connected with a door
        if (!this.rooms[i].isConnectedTo(targets[j])) {
          // 20% chance we add a door connecting the rooms
          if (Math.random() < 0.2) {
            const [door1, door2] = this.findNewDoorLocation(this.rooms[i], targets[j]);
            this.addDoor(door1);
            this.addDoor(door2);
          }
        }
      }
    }
  }

  getRoomAt(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return null;
    else return this.roomGrid[y][x][0]; // Assumes 1 room per tile, which is valid for now
  }

  getMappedTiles(tileMapping = {}) {
    tileMapping = Object.assign({}, { empty: 0, wall: 1, floor: 2, door: 3 }, tileMapping);
    return this.tiles.map(row =>
      row.map(tile => {
        if (tile === TILES.EMPTY) return tileMapping.empty;
        else if (tile === TILES.WALL) return tileMapping.wall;
        else if (tile === TILES.FLOOR) return tileMapping.floor;
        else if (tile === TILES.DOOR) return tileMapping.door;
      })
    );
  }

  addRoom(room) {
    // if the room won't fit, we don't add it
    if (!this.canFitRoom(room)) return false;

    this.rooms.push(room);

    // Update all tiles in the roomGrid to indicate that this room is sitting on them
    for (let y = room.top; y <= room.bottom; y++) {
      for (let x = room.left; x <= room.right; x++) {
        this.roomGrid[y][x].push(room);
      }
    }

    return true;
  }

  canFitRoom(room) {
    // Make sure the room fits inside the dungeon
    if (room.x < 0 || room.x + room.width > this.width - 1) return false;
    if (room.y < 0 || room.y + room.height > this.height - 1) return false;

    // Make sure this room doesn't intersect any existing rooms
    for (let i = 0; i < this.rooms.length; i++) {
      if (room.overlaps(this.rooms[i])) return false;
    }

    return true;
  }

  createRandomRoom() {
    let width = 0;
    let height = 0;
    let area = 0;

    // Find width and height using min/max sizes while keeping under the maximum area
    const config = this.roomConfig;
    do {
      width = randomInteger(config.width.min, config.width.max, {
        onlyEven: config.width.onlyEven,
        onlyOdd: config.width.onlyOdd
      });
      height = randomInteger(config.height.min, config.height.max, {
        onlyEven: config.height.onlyEven,
        onlyOdd: config.height.onlyOdd
      });
      area = width * height;
    } while (area > config.maxArea);

    return new Room(width, height);
  }

  generateRoom() {
    const room = this.createRandomRoom();

    // Only allow 150 tries at placing the room
    let i = 150;
    while (i > 0) {
      // Attempt to find another room to attach this one to
      const result = this.findRoomAttachment(room);

      room.setPosition(result.x, result.y);
      // Try to add it. If successful, add the door between the rooms and break the loop.
      if (this.addRoom(room)) {
        const [door1, door2] = this.findNewDoorLocation(room, result.target);
        this.addDoor(door1);
        this.addDoor(door2);
        break;
      }

      i -= 1;
    }
  }

  getTiles() {
    // Create the full map for the whole dungeon
    const tiles = Array(this.height);
    for (let y = 0; y < this.height; y++) {
      tiles[y] = Array(this.width);
      for (let x = 0; x < this.width; x++) {
        tiles[y][x] = TILES.EMPTY;
      }
    }

    // Fill in the map with details from each room
    for (let i = 0; i < this.rooms.length; i++) {
      const r = this.rooms[i];
      for (let y = 0; y < r.height; y++) {
        for (let x = 0; x < r.width; x++) {
          tiles[y + r.y][x + r.x] = r.tiles[y][x];
        }
      }
    }

    return tiles;
  }

  getPotentiallyTouchingRooms(room) {
    const touchingRooms = [];

    // function that checks the list of rooms at a point in our grid for any potential touching
    // rooms
    const checkRoomList = function(x, y, rg) {
      const r = rg[y][x];
      for (let i = 0; i < r.length; i++) {
        // make sure this room isn't the one we're searching around and that it isn't already in the
        // list
        if (r[i] != room && touchingRooms.indexOf(r[i]) < 0) {
          // make sure this isn't a corner of the room (doors can't go into corners)
          const lx = x - r[i].x;
          const ly = y - r[i].y;
          if ((lx > 0 && lx < r[i].width - 1) || (ly > 0 && ly < r[i].height - 1)) {
            touchingRooms.push(r[i]);
          }
        }
      }
    };

    // iterate the north and south walls, looking for other rooms in those tile locations
    for (let x = room.x + 1; x < room.x + room.width - 1; x++) {
      checkRoomList(x, room.y, this.roomGrid);
      checkRoomList(x, room.y + room.height - 1, this.roomGrid);
    }

    // iterate the west and east walls, looking for other rooms in those tile locations
    for (let y = room.y + 1; y < room.y + room.height - 1; y++) {
      checkRoomList(room.x, y, this.roomGrid);
      checkRoomList(room.x + room.width - 1, y, this.roomGrid);
    }

    return touchingRooms;
  }

  findNewDoorLocation(room1, room2) {
    const door1 = { x: -1, y: -1 };
    const door2 = { x: -1, y: -1 };

    if (room1.y === room2.y - room1.height) {
      // North
      door1.x = door2.x = randomInteger(
        Math.floor(Math.max(room2.left, room1.left) + 1),
        Math.floor(Math.min(room2.right, room1.right) - 1)
      );
      door1.y = room1.y + room1.height - 1;
      door2.y = room2.y;
    } else if (room1.x == room2.x - room1.width) {
      // West
      door1.x = room1.x + room1.width - 1;
      door2.x = room2.x;
      door1.y = door2.y = randomInteger(
        Math.floor(Math.max(room2.top, room1.top) + 1),
        Math.floor(Math.min(room2.bottom, room1.bottom) - 1)
      );
    } else if (room1.x == room2.x + room2.width) {
      // East
      door1.x = room1.x;
      door2.x = room2.x + room2.width - 1;
      door1.y = door2.y = randomInteger(
        Math.floor(Math.max(room2.top, room1.top) + 1),
        Math.floor(Math.min(room2.bottom, room1.bottom) - 1)
      );
    } else if (room1.y == room2.y + room2.height) {
      // South
      door1.x = door2.x = randomInteger(
        Math.floor(Math.max(room2.left, room1.left) + 1),
        Math.floor(Math.min(room2.right, room1.right) - 1)
      );
      door1.y = room1.y;
      door2.y = room2.y + room2.height - 1;
    }

    return [door1, door2];
  }

  findRoomAttachment(room) {
    const r = randomPick(this.rooms);

    let x = 0;
    let y = 0;

    // Randomly position this room on one of the sides of the random room
    switch (randomInteger(0, 3)) {
      // north
      case 0:
        x = randomInteger(r.x - room.width + 3, r.x + r.width - 2);
        y = r.y - room.height;
        break;
      // west
      case 1:
        x = r.x - room.width;
        y = randomInteger(r.y - room.height + 3, r.y + r.height - 2);
        break;
      // east
      case 2:
        x = r.x + r.width;
        y = randomInteger(r.y - room.height + 3, r.y + r.height - 2);
        break;
      // south
      case 3:
        x = randomInteger(r.x - room.width + 3, r.x + r.width - 2);
        y = r.y + r.height;
        break;
    }

    // Return the position for this new room and the target room
    return {
      x: x,
      y: y,
      target: r
    };
  }

  addDoor(doorPos) {
    // Get all the rooms at the location of the door
    const rooms = this.roomGrid[doorPos.y][doorPos.x];
    for (let i = 0; i < rooms.length; i++) {
      const r = rooms[i];

      // convert the door position from world space to room space
      const x = doorPos.x - r.x;
      const y = doorPos.y - r.y;

      // set the tile to be a door
      r.tiles[y][x] = TILES.DOOR;
    }
  }
}
