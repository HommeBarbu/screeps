
// The sole point of this class is to act as an array of RoomInfo, is that okay?
export default class RoomManager{
    rooms: RoomInfo[]

    constructor(){
        for (let name in Game.rooms){
            this.rooms.push(new RoomInfo(Game.rooms[name]));
        }
    }
}

// This class will contain a room and hopefully all the relevant info, including paths.
class RoomInfo{
    room: Room;
    spawns: Spawn[];
    controller: Controller;
    sources: Source[];

    spawnSource: Path

    constructor(room: Room){
        this.room = room;

        // Get spawn in room
        for (let spawnName in Game.spawns){
            let spawn = Game.spawns[spawnName];
            if (spawn.room == this.room){
                this.spawns.push(Game.spawns[spawnName]);
            }
        }

        // Get room controller
        this.controller = this.room.controller;

        // Get sources
        for (let activeSource of this.room.find(FIND_SOURCES_ACTIVE)){
            let source = <Source> activeSource;
            this.sources.push(source)
        }
    }

    // TODO Add an update function to update these values.

}

class Path{
    start: RoomPosition
    end: RoomPosition
    path: any

    constructor(start, end){
        this.start = start;
        this.end = end;
        if (start instanceof Spawn){
            let spawn = <Spawn> start;
            this.start = start.pos;
        }
        if (start instanceof Structure){
            let structure = <Structure> start;
            this.start = structure.pos;
        }
        if (end instanceof Spawn){
            let spawn = <Spawn> end;
            this.end = end.pos;
        }
        if (end instanceof end){
            let structure = <Structure> end;
            this.end = structure.pos;
        }
        let path = PathFinder.search(start, end);
        this.path = path.path;
    }


}