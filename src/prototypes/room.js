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
