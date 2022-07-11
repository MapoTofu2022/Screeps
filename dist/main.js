/* This header is placed at the beginning of the output file and defines the
	special `__require`, `__getFilename`, and `__getDirname` functions.
*/
(function() {
	/* __modules is an Array of functions; each function is a module added
		to the project */
var __modules = {},
	/* __modulesCache is an Array of cached modules, much like
		`require.cache`.  Once a module is executed, it is cached. */
	__modulesCache = {},
	/* __moduleIsCached - an Array of booleans, `true` if module is cached. */
	__moduleIsCached = {};
/* If the module with the specified `uid` is cached, return it;
	otherwise, execute and cache it first. */
function __require(uid, parentUid) {
	if(!__moduleIsCached[uid]) {
		// Populate the cache initially with an empty `exports` Object
		__modulesCache[uid] = {"exports": {}, "loaded": false};
		__moduleIsCached[uid] = true;
		if(uid === 0 && typeof require === "function") {
			require.main = __modulesCache[0];
		} else {
			__modulesCache[uid].parent = __modulesCache[parentUid];
		}
		/* Note: if this module requires itself, or if its depenedencies
			require it, they will only see an empty Object for now */
		// Now load the module
		__modules[uid].call(this, __modulesCache[uid], __modulesCache[uid].exports);
		__modulesCache[uid].loaded = true;
	}
	return __modulesCache[uid].exports;
}
/* This function is the replacement for all `__filename` references within a
	project file.  The idea is to return the correct `__filename` as if the
	file was not concatenated at all.  Therefore, we should return the
	filename relative to the output file's path.

	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getFilename(path) {
	return require("path").resolve(__dirname + "/" + path);
}
/* Same deal as __getFilename.
	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getDirname(path) {
	return require("path").resolve(__dirname + "/" + path + "/../");
}
/********** End of header **********/
/********** Start module 0: /Users/mapotofu/Desktop/master/src/main.js **********/
__modules[0] = function(module, exports) {
let creepLogic = __require(1,0);
let roomLogic = __require(2,0);
let prototypes = __require(3,0);


module.exports.loop = function () {
    Game.myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);
    _.forEach(Game.myRooms, r => roomLogic.spawning(r));
    _.forEach(Game.myRooms, r => roomLogic.roomdefense(r));                            
    for(var name in Memory.creeps) {
        let creep = Game.creeps[name];
        if(!creep) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }else {
            creepLogic[creep.memory.role].run(creep);
        }
    }

    
}
return module.exports;
}
/********** End of module 0: /Users/mapotofu/Desktop/master/src/main.js **********/
/********** Start module 1: /Users/mapotofu/Desktop/master/src/creeps/index.js **********/
__modules[1] = function(module, exports) {
let creepLogic = {
    harvester: __require(4,1),
    upgrader: __require(5,1),
    builder: __require(6,1),
    miner: __require(7,1),
    soldier: __require(8,1),
    carrier: __require(9,1),
    repairer: __require(10,1),
}

module.exports = creepLogic;
return module.exports;
}
/********** End of module 1: /Users/mapotofu/Desktop/master/src/creeps/index.js **********/
/********** Start module 2: /Users/mapotofu/Desktop/master/src/room/index.js **********/
__modules[2] = function(module, exports) {
let roomLogic = {
    spawning: __require(11,2),
    roomdefense: __require(12,2),
}

module.exports = roomLogic;
return module.exports;
}
/********** End of module 2: /Users/mapotofu/Desktop/master/src/room/index.js **********/
/********** Start module 3: /Users/mapotofu/Desktop/master/src/prototypes/index.js **********/
__modules[3] = function(module, exports) {
let files = {
    creep: __require(13,3),
    room: __require(14,3), 
    roomposition: __require(15,3),
}
return module.exports;
}
/********** End of module 3: /Users/mapotofu/Desktop/master/src/prototypes/index.js **********/
/********** Start module 4: /Users/mapotofu/Desktop/master/src/creeps/harvester.js **********/
__modules[4] = function(module, exports) {
var harvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store.getFreeCapacity() > 0) {
           creep.collectEnergy();
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER ||
                           structure.structureType == STRUCTURE_EXTENSION ||
                           structure.structureType == STRUCTURE_SPAWN) && 
                           structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    creep.say('Go store');
                }
            }
        }
    },
    spawn: function(room) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.room.name == room.name);

        if (harvesters.length < 3) {
            return true;
        }
    },
    spawnData: function(room) {
            let name = 'Harvester' + Game.time;
            let body = [WORK, CARRY, WORK, CARRY,MOVE];
            let memory = {role: 'harvester'};
        
            return {name, body, memory};
    }
};

module.exports = harvester;
return module.exports;
}
/********** End of module 4: /Users/mapotofu/Desktop/master/src/creeps/harvester.js **********/
/********** Start module 5: /Users/mapotofu/Desktop/master/src/creeps/upgrader.js **********/
__modules[5] = function(module, exports) {
var upgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('Go harvest');
        }
        if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('Go upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            creep.collectEnergy();
        }
    },
    spawn: function(room) {
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.room.name == room.name);

        if (upgraders.length < 8) {
            return true;
        }
    },
    spawnData: function(room) {
            let name = 'Upgrader' + Game.time;
            let body = [WORK, CARRY, WORK, CARRY, MOVE];
            let memory = {role: 'upgrader'};
        
            return {name, body, memory};
    }
};

module.exports = upgrader;
return module.exports;
}
/********** End of module 5: /Users/mapotofu/Desktop/master/src/creeps/upgrader.js **********/
/********** Start module 6: /Users/mapotofu/Desktop/master/src/creeps/builder.js **********/
__modules[6] = function(module, exports) {
var builder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('Go harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('Go build');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            creep.collectEnergy();
        }
    },
    spawn: function(room) {
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.room.name == room.name);
        if(room.find(FIND_CONSTRUCTION_SITES).length) {
            if (builders.length < 2) {
                return true;
            }
        }
        return false;
    },
    spawnData: function(room) {
            let name = 'Builder' + Game.time;
            let body = [WORK, CARRY, MOVE];
            let memory = {role: 'builder'};
        
            return {name, body, memory};
    }
};

module.exports = builder;
return module.exports;
}
/********** End of module 6: /Users/mapotofu/Desktop/master/src/creeps/builder.js **********/
/********** Start module 7: /Users/mapotofu/Desktop/master/src/creeps/miner.js **********/
__modules[7] = function(module, exports) {
var miner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.harvestEnergy();
    },
    spawn: function(room) {
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.room.name == room.name);

        if (miners.length < 5) {
            return true;
        }
    },
    spawnData: function(room) {
            let name = 'Miner' + Game.time;
            let body = [WORK, WORK, WORK, MOVE];
            let memory = {role: 'miner'};
        
            return {name, body, memory};
    }
};

module.exports = miner;
return module.exports;
}
/********** End of module 7: /Users/mapotofu/Desktop/master/src/creeps/miner.js **********/
/********** Start module 8: /Users/mapotofu/Desktop/master/src/creeps/soldier.js **********/
__modules[8] = function(module, exports) {
var soldier = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(!closestHostile && creep.memory.attackmode) {
            creep.memory.attackmode = false;
        }else {
            creep.memory.attackmode = true;
        }
        if(creep.attackmode) {
            if(creep.attack(closestHostile) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestHostile);
            }
        }
    },
    spawn: function(room) {
        var soldiers = _.filter(Game.creeps, (creep) => creep.memory.role == 'soldier' && creep.room.name == room.name);

        if (soldiers.length < 0) {
            return true;
        }
    },
    spawnData: function(room) {
            let name = 'Soldier' + Game.time;
            let body = [MOVE, ATTACK, ATTACK, MOVE];
            let memory = {role: 'soldier'};
        
            return {name, body, memory};
    }
};

module.exports = soldier;
return module.exports;
}
/********** End of module 8: /Users/mapotofu/Desktop/master/src/creeps/soldier.js **********/
/********** Start module 9: /Users/mapotofu/Desktop/master/src/creeps/carrier.js **********/
__modules[9] = function(module, exports) {
var carrier = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store.getFreeCapacity() > 0) {
            let targetContainer = creep.room.findBestContainer();
            if(targetContainer != -1) {
                if(creep.withdraw(targetContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetContainer);
                }
            }
        }else {
            var extensions = creep.room.find(FIND_STRUCTURES, {
                filter: {structureType: STRUCTURE_EXTENSION}
            });
            var emptyExtensions = _.filter(extensions, function(e) {
                return e.store.getFreeCapacity() > 0;
            });
            var spawns = creep.room.find(FIND_STRUCTURES, {
                filter: {structureType: STRUCTURE_SPAWN}
            });
            var emptySpawn = _.filter(spawns, function(s) {
                return s.store.getFreeCapacity() > 0;
            });
            if(emptySpawn.length > 0) {
                if(creep.transfer(emptySpawn[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(emptySpawn[0]);
                }
            }else if(emptyExtensions.length > 0) {
                if(creep.transfer(emptyExtensions[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(emptyExtensions[0]);
                }
            }else if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage);
            }
        }
    },
    spawn: function(room) {
        var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier' && creep.room.name == room.name);

        if (carriers.length < 6) {
            return true;
        }
    },
    spawnData: function(room) {
            let name = 'Carrier' + Game.time;
            let body = [MOVE, CARRY, CARRY, MOVE, CARRY, MOVE];
            let memory = {role: 'carrier'};
        
            return {name, body, memory};
    }
};

module.exports = carrier;
return module.exports;
}
/********** End of module 9: /Users/mapotofu/Desktop/master/src/creeps/carrier.js **********/
/********** Start module 10: /Users/mapotofu/Desktop/master/src/creeps/repairer.js **********/
__modules[10] = function(module, exports) {
var repairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store[RESOURCE_ENERGY] == 0) {
            creep.collectEnergy();
        }else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER ||
                           structure.structureType == STRUCTURE_EXTENSION ||
                           structure.structureType == STRUCTURE_CONTAINER ||
                           structure.structureType == STRUCTURE_ROAD) && 
                           structure.hits < structure.hitsMax;
                }
            });
            if(targets.length > 0) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
    },
    spawn: function(room) {
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer' && creep.room.name == room.name);
        var targets = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER ||
                       structure.structureType == STRUCTURE_EXTENSION ||
                       structure.structureType == STRUCTURE_CONTAINER ||
                       structure.structureType == STRUCTURE_ROAD) && 
                       structure.hits < structure.hitsMax;
            }
        });
        if (targets.length > 0 && repairers.length < 3) {
            return true;
        }
    },
    spawnData: function(room) {
            let name = 'Repairer' + Game.time;
            let body = [WORK, CARRY, WORK, CARRY, MOVE];
            let memory = {role: 'repairer'};
        
            return {name, body, memory};
    }
};

module.exports = repairer;
return module.exports;
}
/********** End of module 10: /Users/mapotofu/Desktop/master/src/creeps/repairer.js **********/
/********** Start module 11: /Users/mapotofu/Desktop/master/src/room/spawning.js **********/
__modules[11] = function(module, exports) {
let creepLogic = __require(1,11);
let creepTypes = _.keys(creepLogic);

function spawnCreeps(room) {
    let creepTypeNeeded = _.find(creepTypes, function(type) {
        return creepLogic[type].spawn(room);
    });
    let creepSpawnData = creepLogic[creepTypeNeeded] && creepLogic[creepTypeNeeded].spawnData(room);

    if (creepSpawnData) {
        let spawn = room.find(FIND_MY_SPAWNS)[0];
        let result = spawn.spawnCreep(creepSpawnData.body, creepSpawnData.name, {memory: creepSpawnData.memory});
    }
}

module.exports = spawnCreeps;
return module.exports;
}
/********** End of module 11: /Users/mapotofu/Desktop/master/src/room/spawning.js **********/
/********** Start module 12: /Users/mapotofu/Desktop/master/src/room/roomdefense.js **********/
__modules[12] = function(module, exports) {
function towerAttack(room) {
    let towers = room.find(FIND_MY_STRUCTURES, {
        filter: {structureType: STRUCTURE_TOWER}
    });
    if(towers.length > 0) {
        _.forEach(towers, function(tower) {
            let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                if(closestHostile.pos.inRangeTo(tower.pos,30)) {
                    tower.attack(closestHostile);
                }
            }
        });
    }
}
module.exports = towerAttack;
return module.exports;
}
/********** End of module 12: /Users/mapotofu/Desktop/master/src/room/roomdefense.js **********/
/********** Start module 13: /Users/mapotofu/Desktop/master/src/prototypes/creep.js **********/
__modules[13] = function(module, exports) {
Creep.prototype.sayhello = function sayhello() {
    this.say("hello", true);
}
Creep.prototype.findEnergySource = function findEnergySource() {
    let sources = this.room.find(FIND_SOURCES);
    if(sources.length) {
        let freeContainers = [];
        _.forEach(sources, function(s) {
            freeContainers = freeContainers.concat(s.pos.getFreeContainer());
        });
        if(freeContainers.length > 0) {
            this.memory.miningPos = freeContainers[0];
            console.log("harvest pos"+freeContainers[0]);
            return freeContainers;
        }
    }
}

Creep.prototype.harvestEnergy = function harvestEnergy() {
    let storedPos = null;
    if(!this.memory.miningPos) { 
        delete this.memory.miningPos;
        this.findEnergySource();
    }else {
        storedPos = new RoomPosition(this.memory.miningPos.x, this.memory.miningPos.y, this.room.name);
        let foundStructures = storedPos.lookFor(LOOK_STRUCTURES);
        let onContainer = false;
        _.forEach(foundStructures, function(f) {
            if(f instanceof StructureContainer) {
                onContainer = true;
            }
        });
        let sources = this.room.find(FIND_SOURCES);
        let occupied = storedPos.lookFor(LOOK_CREEPS).length > 0 && (!this.pos.isEqualTo(storedPos));
        let bySources = _.filter(sources, function(s) {
            return storedPos.isNearTo(s);
        }).length > 0;
        if(!(onContainer && bySources && (!occupied))) {
            console.log("hello");
            delete this.memory.miningPos;
            this.findEnergySource();
        }
    }   
    if(storedPos) {
        if(this.pos.isEqualTo(storedPos)) {
            let source = this.room.find(FIND_SOURCES);
            for(let x = 0; x < source.length; ++x) {
                if(this.pos.isNearTo(source[x])) {
                    this.harvest(source[x]);
                }
            }
        }else {
            this.moveTo(storedPos);
            this.say("moving");
        }
    }
}
Creep.prototype.collectEnergy = function collectEnergy() {
    let storage = this.room.storage;
    if(storage.store[RESOURCE_ENERGY] > 0) {
        if(this.pos.isNearTo(storage)) {
            this.withdraw(storage, RESOURCE_ENERGY);
        }else {
            this.moveTo(storage);
        }
    }
}
return module.exports;
}
/********** End of module 13: /Users/mapotofu/Desktop/master/src/prototypes/creep.js **********/
/********** Start module 14: /Users/mapotofu/Desktop/master/src/prototypes/room.js **********/
__modules[14] = function(module, exports) {
Room.prototype.findBestContainer = function findBestContainer() {
    let containers = this.find(FIND_STRUCTURES, {
        filter: {structureType: STRUCTURE_CONTAINER}
    });
    let index = -1;
    let maxStorage = -1;
    for(let x = 0; x < containers.length; ++x) {
        if(containers[x].store[RESOURCE_ENERGY] > maxStorage) {
            maxStorage = containers[x].store[RESOURCE_ENERGY];
            index = x;
        }
    }
    return index == -1 ? null : containers[index];
}

return module.exports;
}
/********** End of module 14: /Users/mapotofu/Desktop/master/src/prototypes/room.js **********/
/********** Start module 15: /Users/mapotofu/Desktop/master/src/prototypes/roomposition.js **********/
__modules[15] = function(module, exports) {
RoomPosition.prototype.getNeighbors = function getNeighbors() {
	var positions = [] 
 
	let startX = this.x - 1 || 1;
	let startY = this.y - 1 || 1;

	for(x = startX; x <= this.x + 1 && x < 49; ++x) {
		for(y = startY; y <= this.y + 1 && y < 49; ++y) {
			if(x != this.x || y != this.y) {
				positions.push(new RoomPosition(x, y, this.roomName));
			}
		}
	}
    return positions;
}

RoomPosition.prototype.getFreePosition = function getFreePosition() {
    let neighborPositions = this.getNeighbors();

    let terrain = Game.map.getRoomTerrain(this.roomName);

    let walkablePositions = _.filter(neighborPositions, function(pos) {
        return terrain.get(pos.x, pos.y) != TERRAIN_MASK_WALL;
    });

    let freePositions = _.filter(walkablePositions, function(pos) {
        return !pos.lookFor(LOOK_CREEPS).length;
    })

    return freePositions;
}
RoomPosition.prototype.getFreeContainer = function getFreeContainer() {
    let freePositions = this.getFreePosition();
    let freeContainers = _.filter(freePositions, function(pos) {
        let found = pos.lookFor(LOOK_STRUCTURES);
        let result = false;
        _.forEach(found, function(f) {
            if(f instanceof StructureContainer) {
                result = true;
            }
        })
        return result;
    });
    return freeContainers;
}
return module.exports;
}
/********** End of module 15: /Users/mapotofu/Desktop/master/src/prototypes/roomposition.js **********/
/********** Footer **********/
if(typeof module === "object")
	module.exports = __require(0);
else
	return __require(0);
})();
/********** End of footer **********/
