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

//return empty positions where there existing a container by the source in the room
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