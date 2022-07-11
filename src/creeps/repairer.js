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
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer' && creep.room.name == room.name);
        //console.log('Repairer: ' + repairers.length, room.name);
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
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Repairer' + Game.time;
            let body = [WORK, CARRY, WORK, CARRY, MOVE];
            let memory = {role: 'repairer'};
        
            return {name, body, memory};
    }
};

module.exports = repairer;