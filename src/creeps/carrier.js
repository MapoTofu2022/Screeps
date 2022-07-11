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
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier' && creep.room.name == room.name);
        //console.log('Carrier: ' + carriers.length, room.name);

        if (carriers.length < 6) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Carrier' + Game.time;
            let body = [MOVE, CARRY, CARRY, MOVE, CARRY, MOVE];
            let memory = {role: 'carrier'};
        
            return {name, body, memory};
    }
};

module.exports = carrier;