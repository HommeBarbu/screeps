export default class Governor {
    init = false;

    bootstrap(){
        console.log('init');
        this.init = true;
        let roadBuilder = new RoadBuilder();

        // Oh god this is hackey, fix this.
        let spawnNames = [];
        let spawns = Game.spawns;
        for (let spawnName in spawns) {
            spawnNames.push(spawnName);
        }
        console.log(spawnNames[0]);
        let initialSpawn = <Spawn>spawns[spawnNames[0]];

        let roadSource = initialSpawn;
        let roadDest = <Source> initialSpawn.room.find(FIND_SOURCES_ACTIVE)[0];

        // Build roads
        let roadbuilder = new RoadBuilder();
        roadbuilder.buildBetweenSpawnAndSource(roadSource, roadDest);
    }

    govern() {
        let janitor = new Janitor();
        janitor.clean();

        let creeps = Game.creeps;

        let harvesterCount = 0;
        let upgraderCount = 0;
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
        }

        let spawnNames = [];
        let spawns = Game.spawns;
        for (let spawnName in spawns) {
            spawnNames.push(spawnName);
        }
        console.log(spawnNames[0]);
        let initialSpawn = <Spawn>spawns[spawnNames[0]];

        let body: string[] = [MOVE, MOVE, CARRY, WORK];
        let harvesterProperties: any = {
            role: 'harvester'
        }
        let upgraderProperties: any = {
            role: 'upgrader',
            upgrading: false
        }

        let name: string = null;
        console.log(initialSpawn);
        if (harvesterCount <= 3) {
            console.log(initialSpawn.createCreep(body, name, harvesterProperties));
        }
        if (upgraderCount <= 2) {
            console.log(initialSpawn.createCreep(body, name, upgraderProperties));
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
        if (this.creep.carry.energy < this.creep.carryCapacity) {
            console.log("Harvest");
            let source = <Source>this.creep.room.find(FIND_SOURCES_ACTIVE)[0];
            //let source = (Source) sources[0];
            if (this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(source);
            }
        } else {
            let targets = this.creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN)
                }
            });
            console.log(targets);
            if (targets.length > 0) {
                let target = <Structure>targets[0];
                console.log("Return");
                if (this.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(target);
                }
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
                console.log("Done upgrading.");
                this.creep.memory.upgrading = false;
            }
            if (!this.creep.memory.upgrading && this.creep.carry.energy == this.creep.carryCapacity) {
                console.log("Start upgrading.");
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

class RoadBuilder {
    buildBetweenSpawnAndSource(source: Spawn, dest: Source){
        var path = source.room.findPath(source.pos, dest.pos);
        for (var coord in path){
            console.log("Creating road, I promise.")
            let x = coord['x']
            let y = coord['y']
            source.room.createConstructionSite(x, y, STRUCTURE_ROAD);
        }

    }
}