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
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var soldiers = _.filter(Game.creeps, (creep) => creep.memory.role == 'soldier' && creep.room.name == room.name);
        //console.log('Soldier: ' + soldiers.length, room.name);

        if (soldiers.length < 0) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Soldier' + Game.time;
            let body = [MOVE, ATTACK, ATTACK, MOVE];
            let memory = {role: 'soldier'};
        
            return {name, body, memory};
    }
};

module.exports = soldier;