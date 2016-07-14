export default class Governor {
    init = false;

    bootstrap(){
        console.log('init');
        this.init = true;

        // Oh god this is hackey, fix this.
        let spawnNames = [];
        let spawns = Game.spawns;
        for (let spawnName in spawns) {
            spawnNames.push(spawnName);
        }
    }

    govern() {
        let janitor = new Janitor();
        janitor.clean();

        let creeps = Game.creeps;

        let harvesterCount = 0;
        let upgraderCount = 0;
        let builderCount = 0;
        let repairerCount = 0;
        for (let name in creeps) {
            let creep = creeps[name];
            if (creep.memory.role == "harvester") {
                harvesterCount = harvesterCount + 1;
                let harvester = new Harvester(creep);
                harvester.harvest();
            }
            if (creep.memory.role == "upgrader") {
                upgraderCount = upgraderCount + 1;
                let upgrader = new Upgrader(creep);
                upgrader.upgrade();
            }
            if (creep.memory.role == "builder") {
                builderCount = builderCount + 1;
                let builder = new Builder(creep);
                builder.build();
            }
            if (creep.memory.role == "repairer") {
                repairerCount = repairerCount + 1;
                let repairer = new Repairer(creep);
                repairer.repair();
            }
        }

        let spawnNames = [];
        let spawns = Game.spawns;
        for (let spawnName in spawns) {
            spawnNames.push(spawnName);
        }
        let initialSpawn = <Spawn> spawns[spawnNames[0]];

        let body: string[] = [MOVE, MOVE, CARRY, WORK];
        let harvesterProperties: any = {
            role: 'harvester'
        }
        let upgraderProperties: any = {
            role: 'upgrader',
            upgrading: false
        }
        let builderProperties: any = {
            role: 'builder',
            building: false
        }
        let repairerProperties: any = {
            role: 'repairer',
            repairing: false
        }

        let name: string = null;
        if (harvesterCount <= 2) {
            console.log(initialSpawn.createCreep(body, name, harvesterProperties));
        }
        if (upgraderCount <= 3) {
            console.log(initialSpawn.createCreep(body, name, upgraderProperties));
        }
        if (builderCount <= 4) {
            console.log(initialSpawn.createCreep(body, name, builderProperties));
        }
        if (repairerCount <= 1) {
            console.log(initialSpawn.createCreep(body, name, repairerProperties));
        }
    }
}

interface BaseCreep {
    creep: Creep;
}

class Harvester implements BaseCreep {
    creep: Creep;
    constructor(creep: Creep) {
        this.creep = creep;
    }

    harvest() {
        // Go to the source and fill up
        if (this.creep.carry.energy < this.creep.carryCapacity) {
            let source = <Source>this.creep.room.find(FIND_SOURCES_ACTIVE)[0];
            //let source = (Source) sources[0];
            if (this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(source);
            }
        } else {
            // Otherwise, go fill up an extension or a spawn.
            let targets = this.creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN)
                }
            });

            if (targets.length > 0) {
                let target = <Structure> targets[0];
                if (this.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(target);
                }
            }
        }
    }
}

class Builder implements BaseCreep {
  creep: Creep
    constructor(creep: Creep) {
        this.creep = creep
    }

    build() {
            if (this.creep.memory.building && this.creep.carry.energy == 0) {
                this.creep.memory.building = false;
            }
            if (!this.creep.memory.building && this.creep.carry.energy == this.creep.carryCapacity) {
                this.creep.memory.building = true;
            }

            if (this.creep.memory.building) {
                let buildSites = this.creep.room.find(FIND_CONSTRUCTION_SITES);
                if (buildSites.length){
                    let closestSite = <ConstructionSite> buildSites[0];
                    if (this.creep.build(closestSite) == ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(closestSite);
                    }
                }
                

            } else {
                let source = <Source> this.creep.room.find(FIND_SOURCES_ACTIVE)[0];
                if (this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(source);
                }
            }
        }
}

class Repairer implements BaseCreep {
  creep: Creep
    constructor(creep: Creep) {
        this.creep = creep
    }

    repair() {
            if (this.creep.memory.repairing && this.creep.carry.energy == 0) {
                this.creep.memory.repairing = false;
            }
            if (!this.creep.memory.repairing && this.creep.carry.energy == this.creep.carryCapacity) {
                this.creep.memory.repairing = true;
            }

            if (this.creep.memory.repairing) {
                let roadToRepair = <Structure> this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: function(object){
                        return object.structureType === STRUCTURE_ROAD && (object.hits > object.hitsMax / 3);
                    } 
                });
                if (this.creep.repair(roadToRepair) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(roadToRepair);
                }

            } else {
                let source = <Source> this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)[0];
                if (this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(source);
                }
            }
        }
}

class Upgrader implements BaseCreep {
    creep: Creep
    constructor(creep: Creep) {
        this.creep = creep
    }

    upgrade() {
            if (this.creep.memory.upgrading && this.creep.carry.energy == 0) {
                this.creep.memory.upgrading = false;
            }
            if (!this.creep.memory.upgrading && this.creep.carry.energy == this.creep.carryCapacity) {
                this.creep.memory.upgrading = true;
            }

            if (this.creep.memory.upgrading) {
                let targets = this.creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTROLLER)
                    }
                });
                let controller = this.creep.room.controller;
                if (this.creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(controller);
                }

            } else {
                let source = <Source>this.creep.room.find(FIND_SOURCES_ACTIVE)[0];
                //let source = (Source) sources[0];
                if (this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(source);
                }
            }
        }
}

class Janitor {
    clean() {
        // Cleanup dead creeps
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }

        // Cleanup dead spawns
        for (let name in Memory.spawns) {
            if (!Game.spawns[name]) {
                delete Memory.spawns[name];
            }
        }
    }
}