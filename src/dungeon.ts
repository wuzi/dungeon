import Random from "./random";
import Room from "./room";
import TILES, { DebugTileMap } from "./tiles";
import { debugMap, debugHtmlMap } from "./debug";
import { create2DArray } from "./create-2d-array";
import Point from "./point";

type DimensionConfig = { min: number; max: number; onlyOdd?: boolean; onlyEven?: boolean };
type DimensionConfigOptional = Partial<DimensionConfig>;
type RoomConfig = {
  width: DimensionConfig;
  height: DimensionConfig;
  maxArea: number;
  maxRooms: number;
};
type RoomConfigOptional = {
  width?: DimensionConfigOptional;
  height?: DimensionConfigOptional;
  maxArea?: number;
  maxRooms?: number;
};
type DungeonConfig = {
  width: number;
  height: number;
  randomSeed: string | undefined;
  doorPadding: number;
  rooms: RoomConfig;
};
type DungeonConfigOptional = {
  width?: number;
  height?: number;
  randomSeed?: string | undefined;
  doorPadding?: number;
  rooms?: RoomConfigOptional;
};

export default class Dungeon {
  public height: number;
  public width: number;
  public tiles: TILES[][];
  public roomConfig: RoomConfig;
  public rooms: Room[] = [];
  private doorPadding: number;
  private r: Random;
  // 2D grid matching map dimensions where every element contains an array of all the rooms in
  // that location.
  public roomGrid: Room[][][] = [];

  constructor(config?: DungeonConfigOptional) {
    const rooms = config?.rooms;
    const roomWidth = rooms?.width;
    const roomHeight = rooms?.height;
    this.roomConfig = {
      width: {
        min: roomWidth?.min ?? 5,
        max: roomWidth?.max ?? 15,
        onlyOdd: roomWidth?.onlyOdd ?? false,
        onlyEven: roomWidth?.onlyEven ?? false
      },
      height: {
        min: roomHeight?.min ?? 5,
        max: roomHeight?.max ?? 15,
        onlyOdd: roomHeight?.onlyOdd ?? false,
        onlyEven: roomHeight?.onlyEven ?? false
      },
      maxArea: rooms?.maxArea ?? 150,
      maxRooms: rooms?.maxRooms ?? 50
    };

    // Validate the room width and height settings.
    if (this.roomConfig.width.min < 3 || this.roomConfig.height.min < 3) {
      throw new Error("Room width and height must be >= 3.");
    }
    if (
      this.roomConfig.width.min > this.roomConfig.width.max ||
      this.roomConfig.height.min > this.roomConfig.height.max
    ) {
      throw new Error("Room width and height max must be >= min.");
    }

    // Validate the max area based on min dimensions.
    const minArea = this.roomConfig.width.min * this.roomConfig.height.min;
    if (this.roomConfig.maxArea < minArea) {
      throw new Error("The minimum dimensions specified exceeds the given maxArea.");
    }

    this.doorPadding = config?.doorPadding ?? 1;
    this.width = config?.width ?? 50;
    this.height = config?.height ?? 50;
    this.rooms = [];
    this.r = new Random(config?.randomSeed);

    this.generate();
    this.tiles = this.getTiles();
  }

  public drawToConsole(config: any) {
    debugMap(this, config);
  }

  public drawToHtml(config: any) {
    return debugHtmlMap(this, config);
  }

  getMappedTiles(tileMapping: DebugTileMap = {}) {
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

  public getCenter(): Point {
    return {
      x: Math.floor(this.width / 2),
      y: Math.floor(this.height / 2)
    };
  }

  public generate() {
    this.rooms = [];
    this.roomGrid = [];

    for (let y = 0; y < this.height; y++) {
      this.roomGrid.push([]);
      for (let x = 0; x < this.width; x++) {
        this.roomGrid[y].push([]);
      }
    }

    // Seed the map with a starting randomly sized room in the center of the map.
    const mapCenter = this.getCenter();
    const room = this.createRandomRoom();
    room.setPosition(
      mapCenter.x - Math.floor(room.width / 2),
      mapCenter.y - Math.floor(room.height / 2)
    );
    this.addRoom(room);

    // Continue generating rooms until we hit our cap or have hit our maximum iterations (generally
    // due to not being able to fit any more rooms in the map).
    let i = this.roomConfig.maxRooms * 5;
    while (this.rooms.length < this.roomConfig.maxRooms && i > 0) {
      this.generateRoom();
      i -= 1;
    }

    // // Now we want to randomly add doors between some of the rooms and other rooms they touch
    // for (let i = 0; i < this.rooms.length; i++) {
    //   // Find all rooms that we could connect with this one
    //   const targets = this.getPotentiallyTouchingRooms(this.rooms[i]);
    //   for (let j = 0; j < targets.length; j++) {
    //     // Make sure the rooms aren't already connected with a door
    //     if (!this.rooms[i].isConnectedTo(targets[j])) {
    //       // 20% chance we add a door connecting the rooms
    //       if (Math.random() < 0.2) {
    //         const [door1, door2] = this.findNewDoorLocation(this.rooms[i], targets[j]);
    //         this.addDoor(door1);
    //         this.addDoor(door2);
    //       }
    //     }
    //   }
    // }
  }

  public hasRoomAt(x: number, y: number) {
    return x < 0 || y < 0 || x >= this.width || y >= this.height || this.roomGrid[y][x].length > 0;
  }

  public getRoomAt(x: number, y: number): Room | null {
    if (this.hasRoomAt(x, y)) {
      // Assumes 1 room per tile, which is valid for now
      return this.roomGrid[y][x][0];
    } else {
      return null;
    }
  }

  /**
   * Attempt to add a room and return true/false based on whether it was successful.
   * @param room
   */
  private addRoom(room: Room): Boolean {
    if (!this.canFitRoom(room)) return false;
    this.rooms.push(room);
    // Update all tiles in the roomGrid to indicate that this room is sitting on them.
    for (let y = room.top; y <= room.bottom; y++) {
      for (let x = room.left; x <= room.right; x++) {
        this.roomGrid[y][x].push(room);
      }
    }
    return true;
  }

  private canFitRoom(room: Room) {
    // Make sure the room fits inside the dungeon.
    if (room.x < 0 || room.x + room.width > this.width - 1) return false;
    if (room.y < 0 || room.y + room.height > this.height - 1) return false;

    // Make sure this room doesn't intersect any existing rooms.
    for (let i = 0; i < this.rooms.length; i++) {
      if (room.overlaps(this.rooms[i])) return false;
    }

    return true;
  }

  private createRandomRoom(): Room {
    let width = 0;
    let height = 0;
    let area = 0;

    // Find width and height using min/max sizes while keeping under the maximum area.
    const config = this.roomConfig;
    do {
      width = this.r.randomInteger(config.width.min, config.width.max, {
        onlyEven: config.width.onlyEven,
        onlyOdd: config.width.onlyOdd
      });
      height = this.r.randomInteger(config.height.min, config.height.max, {
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
    const tiles = create2DArray<TILES>(this.width, this.height, TILES.EMPTY);
    this.rooms.forEach(room => {
      room.forEachTile((point, tile) => {
        tiles[room.y + point.y][room.x + point.x] = tile;
      });
    });
    return tiles;
  }

  getPotentiallyTouchingRooms(room: Room) {
    const touchingRooms: Room[] = [];

    // function that checks the list of rooms at a point in our grid for any potential touching
    // rooms
    const checkRoomList = (x: number, y: number) => {
      const r = this.roomGrid[y][x];
      for (let i = 0; i < r.length; i++) {
        // make sure this room isn't the one we're searching around and that it isn't already in the
        // list
        if (r[i] != room && touchingRooms.indexOf(r[i]) === -1) {
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
      checkRoomList(x, room.y);
      checkRoomList(x, room.y + room.height - 1);
    }

    // iterate the west and east walls, looking for other rooms in those tile locations
    for (let y = room.y + 1; y < room.y + room.height - 1; y++) {
      checkRoomList(room.x, y);
      checkRoomList(room.x + room.width - 1, y);
    }

    return touchingRooms;
  }

  findNewDoorLocation(room1: Room, room2: Room): [Point, Point] {
    const door1 = { x: -1, y: -1 };
    const door2 = { x: -1, y: -1 };

    if (room1.y === room2.y - room1.height) {
      // North
      door1.x = door2.x = this.r.randomInteger(
        Math.floor(Math.max(room2.left, room1.left) + this.doorPadding),
        Math.floor(Math.min(room2.right, room1.right) - this.doorPadding)
      );
      door1.y = room1.y + room1.height - 1;
      door2.y = room2.y;
    } else if (room1.x == room2.x - room1.width) {
      // West
      door1.x = room1.x + room1.width - 1;
      door2.x = room2.x;
      door1.y = door2.y = this.r.randomInteger(
        Math.floor(Math.max(room2.top, room1.top) + this.doorPadding),
        Math.floor(Math.min(room2.bottom, room1.bottom) - this.doorPadding)
      );
    } else if (room1.x == room2.x + room2.width) {
      // East
      door1.x = room1.x;
      door2.x = room2.x + room2.width - 1;
      door1.y = door2.y = this.r.randomInteger(
        Math.floor(Math.max(room2.top, room1.top) + this.doorPadding),
        Math.floor(Math.min(room2.bottom, room1.bottom) - this.doorPadding)
      );
    } else if (room1.y == room2.y + room2.height) {
      // South
      door1.x = door2.x = this.r.randomInteger(
        Math.floor(Math.max(room2.left, room1.left) + this.doorPadding),
        Math.floor(Math.min(room2.right, room1.right) - this.doorPadding)
      );
      door1.y = room1.y;
      door2.y = room2.y + room2.height - 1;
    }

    return [door1, door2];
  }

  findRoomAttachment(room: Room) {
    const r = this.r.randomPick(this.rooms);

    let x = 0;
    let y = 0;
    const pad = 2 * this.doorPadding; // 2x padding to account for the padding both rooms need

    // Randomly position this room on one of the sides of the random room.
    switch (this.r.randomInteger(0, 3)) {
      // north
      case 0:
        // x = r.left - (room.width - 1) would have rooms sharing exactly 1x tile
        x = this.r.randomInteger(r.left - (room.width - 1) + pad, r.right - pad);
        y = r.top - room.height;
        break;
      // west
      case 1:
        x = r.left - room.width;
        y = this.r.randomInteger(r.top - (room.height - 1) + pad, r.bottom - pad);
        break;
      // east
      case 2:
        x = r.right + 1;
        y = this.r.randomInteger(r.top - (room.height - 1) + pad, r.bottom - pad);
        break;
      // south
      case 3:
        x = this.r.randomInteger(r.left - (room.width - 1) + pad, r.right - pad);
        y = r.bottom + 1;
        break;
    }

    // Return the position for this new room and the target room
    return {
      x: x,
      y: y,
      target: r
    };
  }

  addDoor(doorPos: Point) {
    // Get all the rooms at the location of the door
    const rooms = this.roomGrid[doorPos.y][doorPos.x];
    rooms.forEach(room => {
      room.setTileAt(doorPos.x - room.x, doorPos.y - room.y, TILES.DOOR);
    });
  }
}
