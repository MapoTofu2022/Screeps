Creep.prototype.sayhello = function sayhello() {
    this.say("hello", true);
}

//return empty containers position in this room
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

//Collect energy from storage in the room
Creep.prototype.collectEnergy = function collectEnergy() {
    let storage = this.room.storage;
    //Go collect if storage has energy even if it is less than creeps' capacity
    if(storage.store[RESOURCE_ENERGY] > 0) {
        if(this.pos.isNearTo(storage)) {
            this.withdraw(storage, RESOURCE_ENERGY);
        }else {
            this.moveTo(storage);
        }
    }
}