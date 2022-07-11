var miner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.harvestEnergy();
    },
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.room.name == room.name);
        //console.log('Miner: ' + miners.length, room.name);

        if (miners.length < 5) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Miner' + Game.time;
            let body = [WORK, WORK, WORK, MOVE];
            let memory = {role: 'miner'};
        
            return {name, body, memory};
    }
};

module.exports = miner;