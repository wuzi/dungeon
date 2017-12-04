(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Dungeon"] = factory();
	else
		root["Dungeon"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var TILES = {
  EMPTY: 0,
  WALL: 1,
  FLOOR: 2,
  DOOR: 3
};

exports.default = TILES;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(2).default;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(3);

var _Room = __webpack_require__(4);

var _Room2 = _interopRequireDefault(_Room);

var _tiles = __webpack_require__(0);

var _tiles2 = _interopRequireDefault(_tiles);

var _debug = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultConfig = {
  width: 50,
  height: 50,
  rooms: {
    width: { min: 5, max: 15, onlyOdd: false, onlyEven: false },
    height: { min: 5, max: 15, onlyOdd: false, onlyEven: false },
    maxArea: 150,
    maxRooms: 50
  }
};

var Dungeon = function () {
  function Dungeon() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Dungeon);

    var roomConfig = config.rooms || {};
    roomConfig.width = Object.assign({}, defaultConfig.rooms.width, roomConfig.width);
    roomConfig.height = Object.assign({}, defaultConfig.rooms.height, roomConfig.height);
    roomConfig.maxArea = roomConfig.maxArea || defaultConfig.rooms.maxArea;
    roomConfig.maxRooms = roomConfig.maxRooms || defaultConfig.rooms.maxRooms;

    // Avoid an impossibly small maxArea
    var minArea = roomConfig.width.min * roomConfig.height.min;
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

  _createClass(Dungeon, [{
    key: "drawToConsole",
    value: function drawToConsole(config) {
      (0, _debug.debugMap)(this, config);
    }
  }, {
    key: "generate",
    value: function generate() {
      this.rooms = [];
      this.roomGrid = [];

      for (var y = 0; y < this.height; y++) {
        this.roomGrid.push([]);
        for (var x = 0; x < this.width; x++) {
          this.roomGrid[y].push([]);
        }
      }

      // Seed the map with a starting randomly sized room in the center of the map
      var room = this.createRandomRoom();
      room.setPosition(Math.floor(this.width / 2) - Math.floor(room.width / 2), Math.floor(this.height / 2) - Math.floor(room.height / 2));
      this.addRoom(room);

      // Continue generating rooms until we hit our cap or have hit our maximum iterations (generally
      // due to not being able to fit any more rooms in the map)
      var i = this.roomConfig.maxRooms * 5;
      while (this.rooms.length < this.roomConfig.maxRooms && i > 0) {
        this.generateRoom();
        i -= 1;
      }

      // Now we want to randomly add doors between some of the rooms and other rooms they touch
      for (var _i = 0; _i < this.rooms.length; _i++) {
        // Find all rooms that we could connect with this one
        var targets = this.getPotentiallyTouchingRooms(this.rooms[_i]);
        for (var j = 0; j < targets.length; j++) {
          // Make sure the rooms aren't already connected with a door
          if (!this.rooms[_i].isConnectedTo(targets[j])) {
            // 20% chance we add a door connecting the rooms
            if (Math.random() < 0.2) {
              var _findNewDoorLocation = this.findNewDoorLocation(this.rooms[_i], targets[j]),
                  _findNewDoorLocation2 = _slicedToArray(_findNewDoorLocation, 2),
                  door1 = _findNewDoorLocation2[0],
                  door2 = _findNewDoorLocation2[1];

              this.addDoor(door1);
              this.addDoor(door2);
            }
          }
        }
      }
    }
  }, {
    key: "getRoomAt",
    value: function getRoomAt(x, y) {
      if (x < 0 || y < 0 || x >= this.width || y >= this.height) return null;else return this.roomGrid[y][x][0]; // Assumes 1 room per tile, which is valid for now
    }
  }, {
    key: "getMappedTiles",
    value: function getMappedTiles() {
      var tileMapping = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      tileMapping = Object.assign({}, { empty: 0, wall: 1, floor: 2, door: 3 }, tileMapping);
      return this.tiles.map(function (row) {
        return row.map(function (tile) {
          if (tile === _tiles2.default.EMPTY) return tileMapping.empty;else if (tile === _tiles2.default.WALL) return tileMapping.wall;else if (tile === _tiles2.default.FLOOR) return tileMapping.floor;else if (tile === _tiles2.default.DOOR) return tileMapping.door;
        });
      });
    }
  }, {
    key: "addRoom",
    value: function addRoom(room) {
      // if the room won't fit, we don't add it
      if (!this.canFitRoom(room)) return false;

      this.rooms.push(room);

      // Update all tiles in the roomGrid to indicate that this room is sitting on them
      for (var y = room.top; y <= room.bottom; y++) {
        for (var x = room.left; x <= room.right; x++) {
          this.roomGrid[y][x].push(room);
        }
      }

      return true;
    }
  }, {
    key: "canFitRoom",
    value: function canFitRoom(room) {
      // Make sure the room fits inside the dungeon
      if (room.x < 0 || room.x + room.width > this.width - 1) return false;
      if (room.y < 0 || room.y + room.height > this.height - 1) return false;

      // Make sure this room doesn't intersect any existing rooms
      for (var i = 0; i < this.rooms.length; i++) {
        if (room.overlaps(this.rooms[i])) return false;
      }

      return true;
    }
  }, {
    key: "createRandomRoom",
    value: function createRandomRoom() {
      var width = 0;
      var height = 0;
      var area = 0;

      // Find width and height using min/max sizes while keeping under the maximum area
      var config = this.roomConfig;
      do {
        width = (0, _utils.randomInteger)(config.width.min, config.width.max, {
          onlyEven: config.width.onlyEven,
          onlyOdd: config.width.onlyOdd
        });
        height = (0, _utils.randomInteger)(config.height.min, config.height.max, {
          onlyEven: config.height.onlyEven,
          onlyOdd: config.height.onlyOdd
        });
        area = width * height;
      } while (area > config.maxArea);

      return new _Room2.default(width, height);
    }
  }, {
    key: "generateRoom",
    value: function generateRoom() {
      var room = this.createRandomRoom();

      // Only allow 150 tries at placing the room
      var i = 150;
      while (i > 0) {
        // Attempt to find another room to attach this one to
        var result = this.findRoomAttachment(room);

        room.setPosition(result.x, result.y);
        // Try to add it. If successful, add the door between the rooms and break the loop.
        if (this.addRoom(room)) {
          var _findNewDoorLocation3 = this.findNewDoorLocation(room, result.target),
              _findNewDoorLocation4 = _slicedToArray(_findNewDoorLocation3, 2),
              door1 = _findNewDoorLocation4[0],
              door2 = _findNewDoorLocation4[1];

          this.addDoor(door1);
          this.addDoor(door2);
          break;
        }

        i -= 1;
      }
    }
  }, {
    key: "getTiles",
    value: function getTiles() {
      // Create the full map for the whole dungeon
      var tiles = Array(this.height);
      for (var y = 0; y < this.height; y++) {
        tiles[y] = Array(this.width);
        for (var x = 0; x < this.width; x++) {
          tiles[y][x] = _tiles2.default.EMPTY;
        }
      }

      // Fill in the map with details from each room
      for (var i = 0; i < this.rooms.length; i++) {
        var r = this.rooms[i];
        for (var _y = 0; _y < r.height; _y++) {
          for (var _x3 = 0; _x3 < r.width; _x3++) {
            tiles[_y + r.y][_x3 + r.x] = r.tiles[_y][_x3];
          }
        }
      }

      return tiles;
    }
  }, {
    key: "getPotentiallyTouchingRooms",
    value: function getPotentiallyTouchingRooms(room) {
      var touchingRooms = [];

      // function that checks the list of rooms at a point in our grid for any potential touching
      // rooms
      var checkRoomList = function checkRoomList(x, y, rg) {
        var r = rg[y][x];
        for (var i = 0; i < r.length; i++) {
          // make sure this room isn't the one we're searching around and that it isn't already in the
          // list
          if (r[i] != room && touchingRooms.indexOf(r[i]) < 0) {
            // make sure this isn't a corner of the room (doors can't go into corners)
            var lx = x - r[i].x;
            var ly = y - r[i].y;
            if (lx > 0 && lx < r[i].width - 1 || ly > 0 && ly < r[i].height - 1) {
              touchingRooms.push(r[i]);
            }
          }
        }
      };

      // iterate the north and south walls, looking for other rooms in those tile locations
      for (var x = room.x + 1; x < room.x + room.width - 1; x++) {
        checkRoomList(x, room.y, this.roomGrid);
        checkRoomList(x, room.y + room.height - 1, this.roomGrid);
      }

      // iterate the west and east walls, looking for other rooms in those tile locations
      for (var y = room.y + 1; y < room.y + room.height - 1; y++) {
        checkRoomList(room.x, y, this.roomGrid);
        checkRoomList(room.x + room.width - 1, y, this.roomGrid);
      }

      return touchingRooms;
    }
  }, {
    key: "findNewDoorLocation",
    value: function findNewDoorLocation(room1, room2) {
      var door1 = { x: -1, y: -1 };
      var door2 = { x: -1, y: -1 };

      if (room1.y === room2.y - room1.height) {
        // North
        door1.x = door2.x = (0, _utils.randomInteger)(Math.floor(Math.max(room2.left, room1.left) + 1), Math.floor(Math.min(room2.right, room1.right) - 1));
        door1.y = room1.y + room1.height - 1;
        door2.y = room2.y;
      } else if (room1.x == room2.x - room1.width) {
        // West
        door1.x = room1.x + room1.width - 1;
        door2.x = room2.x;
        door1.y = door2.y = (0, _utils.randomInteger)(Math.floor(Math.max(room2.top, room1.top) + 1), Math.floor(Math.min(room2.bottom, room1.bottom) - 1));
      } else if (room1.x == room2.x + room2.width) {
        // East
        door1.x = room1.x;
        door2.x = room2.x + room2.width - 1;
        door1.y = door2.y = (0, _utils.randomInteger)(Math.floor(Math.max(room2.top, room1.top) + 1), Math.floor(Math.min(room2.bottom, room1.bottom) - 1));
      } else if (room1.y == room2.y + room2.height) {
        // South
        door1.x = door2.x = (0, _utils.randomInteger)(Math.floor(Math.max(room2.left, room1.left) + 1), Math.floor(Math.min(room2.right, room1.right) - 1));
        door1.y = room1.y;
        door2.y = room2.y + room2.height - 1;
      }

      return [door1, door2];
    }
  }, {
    key: "findRoomAttachment",
    value: function findRoomAttachment(room) {
      var r = (0, _utils.randomPick)(this.rooms);

      var x = 0;
      var y = 0;

      // Randomly position this room on one of the sides of the random room
      switch ((0, _utils.randomInteger)(0, 3)) {
        // north
        case 0:
          x = (0, _utils.randomInteger)(r.x - room.width + 3, r.x + r.width - 2);
          y = r.y - room.height;
          break;
        // west
        case 1:
          x = r.x - room.width;
          y = (0, _utils.randomInteger)(r.y - room.height + 3, r.y + r.height - 2);
          break;
        // east
        case 2:
          x = r.x + r.width;
          y = (0, _utils.randomInteger)(r.y - room.height + 3, r.y + r.height - 2);
          break;
        // south
        case 3:
          x = (0, _utils.randomInteger)(r.x - room.width + 3, r.x + r.width - 2);
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
  }, {
    key: "addDoor",
    value: function addDoor(doorPos) {
      // Get all the rooms at the location of the door
      var rooms = this.roomGrid[doorPos.y][doorPos.x];
      for (var i = 0; i < rooms.length; i++) {
        var r = rooms[i];

        // convert the door position from world space to room space
        var x = doorPos.x - r.x;
        var y = doorPos.y - r.y;

        // set the tile to be a door
        r.tiles[y][x] = _tiles2.default.DOOR;
      }
    }
  }]);

  return Dungeon;
}();

exports.default = Dungeon;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomInteger = randomInteger;
exports.randomEvenInteger = randomEvenInteger;
exports.randomOddInteger = randomOddInteger;
exports.randomPick = randomPick;
function randomInteger(min, max) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$onlyOdd = _ref.onlyOdd,
      onlyOdd = _ref$onlyOdd === undefined ? false : _ref$onlyOdd,
      _ref$onlyEven = _ref.onlyEven,
      onlyEven = _ref$onlyEven === undefined ? false : _ref$onlyEven;

  if (onlyOdd) return randomOddInteger(min, max);else if (onlyEven) return randomEvenInteger(min, max);else return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomEvenInteger(min, max) {
  if (min % 2 !== 0 && min < max) min++;
  if (max % 2 !== 0 && max > min) max--;
  var range = (max - min) / 2;
  return Math.floor(Math.random() * (range + 1)) * 2 + min;
}

function randomOddInteger(min, max) {
  if (min % 2 === 0) min++;
  if (max % 2 === 0) max--;
  var range = (max - min) / 2;
  return Math.floor(Math.random() * (range + 1)) * 2 + min;
}

function randomPick(array) {
  return array[randomInteger(0, array.length - 1)];
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tiles = __webpack_require__(0);

var _tiles2 = _interopRequireDefault(_tiles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Room = function () {
  function Room(width, height) {
    _classCallCheck(this, Room);

    this.width = width;
    this.height = height;

    this.setPosition(0, 0);

    this.doors = [];
    this.tiles = [];

    // Surround the room with walls, and fill the rest with floors.
    for (var y = 0; y < this.height; y++) {
      var row = [];
      for (var x = 0; x < this.width; x++) {
        if (y == 0 || y == this.height - 1 || x == 0 || x == this.width - 1) {
          row.push(_tiles2.default.WALL);
        } else {
          row.push(_tiles2.default.FLOOR);
        }
      }
      this.tiles.push(row);
    }
  }

  _createClass(Room, [{
    key: "setPosition",
    value: function setPosition(x, y) {
      this.x = x;
      this.y = y;
      this.left = x;
      this.right = x + (this.width - 1);
      this.top = y;
      this.bottom = y + (this.height - 1);
      this.centerX = x + Math.floor(this.width / 2);
      this.centerY = y + Math.floor(this.height / 2);
    }
  }, {
    key: "getDoorLocations",
    value: function getDoorLocations() {
      var doors = [];

      // find all the doors and add their positions to the list
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          if (this.tiles[y][x] == _tiles2.default.DOOR) {
            doors.push({ x: x, y: y });
          }
        }
      }

      return doors;
    }
  }, {
    key: "overlaps",
    value: function overlaps(otherRoom) {
      if (this.right < otherRoom.left) return false;else if (this.left > otherRoom.right) return false;else if (this.bottom < otherRoom.top) return false;else if (this.top > otherRoom.bottom) return false;else return true;
    }
  }, {
    key: "isConnectedTo",
    value: function isConnectedTo(otherRoom) {
      // iterate the doors in room1 and see if any are also a door in room2
      var doors = this.getDoorLocations();
      for (var i = 0; i < doors.length; i++) {
        var d = doors[i];

        // move the door into "world space" using room1's position
        d.x += this.x;
        d.y += this.y;

        // move the door into room2 space by subtracting room2's position
        d.x -= otherRoom.x;
        d.y -= otherRoom.y;

        // make sure the position is valid for room2's tiles array
        if (d.x < 0 || d.x > otherRoom.width - 1 || d.y < 0 || d.y > otherRoom.height - 1) {
          continue;
        }

        // see if the tile is a door; if so this is a door from room1 to room2 so the rooms are connected
        if (otherRoom.tiles[d.y][d.x] == _tiles2.default.DOOR) {
          return true;
        }
      }

      return false;
    }
  }]);

  return Room;
}();

exports.default = Room;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debugRoomGrid = debugRoomGrid;
exports.debugMap = debugMap;

var _tiles = __webpack_require__(0);

var _tiles2 = _interopRequireDefault(_tiles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Debug by dumping a table to the console where each element in the map is the number of rooms in
// that location
function debugRoomGrid(dungeon) {
  var table = dungeon.roomGrid.map(function (row) {
    return row.map(function (elem) {
      return ("" + elem.length).padStart(2);
    });
  });
  console.log(table.map(function (row) {
    return row.join(" ");
  }).join("\n"));
}

// Debug by returning a colored(!) table string where each tile in the map is represented with an
// ASCII string
function debugMap(dungeon) {
  var _console;

  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  config = Object.assign({}, {
    empty: " ",
    emptyColor: "rgb(0, 0, 0)",
    wall: "#",
    wallColor: "rgb(255, 0, 0)",
    floor: "_",
    floorColor: "rgb(210, 210, 210)",
    door: ".",
    doorColor: "rgb(0, 0, 255)",
    fontSize: "15px"
  }, config);

  var string = "";
  var styles = [];
  for (var y = 0; y < dungeon.height; y += 1) {
    for (var x = 0; x < dungeon.width; x += 1) {
      var tile = dungeon.tiles[y][x];
      if (tile === _tiles2.default.EMPTY) {
        string += "%c" + config.empty;
        styles.push("color: " + config.emptyColor + "; font-size: " + config.fontSize);
      } else if (tile === _tiles2.default.WALL) {
        string += "%c" + config.wall;
        styles.push("color: " + config.wallColor + "; font-size: " + config.fontSize);
      } else if (tile === _tiles2.default.FLOOR) {
        string += "%c" + config.floor;
        styles.push("color: " + config.floorColor + "; font-size: " + config.fontSize);
      } else if (tile === _tiles2.default.DOOR) {
        string += "%c" + config.door;
        styles.push("color: " + config.doorColor + "; font-size: " + config.fontSize);
      }
      string += " ";
    }
    string += "\n";
  }
  (_console = console).log.apply(_console, [string].concat(styles));
}

/***/ })
/******/ ]);
});