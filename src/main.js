let creepLogic = require('./creeps');
let roomLogic = require('./room');
let prototypes = require('./prototypes');


module.exports.loop = function () {
    // make a list of all of our rooms
    Game.myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);

    // run spwan logic for each room in our empire
    _.forEach(Game.myRooms, r => roomLogic.spawning(r));
    //run tower attack logic
    _.forEach(Game.myRooms, r => roomLogic.roomdefense(r));                            
    // run each creep role see /creeps/index.js
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