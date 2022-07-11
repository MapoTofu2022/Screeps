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