import * as _ from 'lodash';

// The sole point of this class is to act as an array of RoomInfo, is that okay?
export default class RoomManager{
    rooms: RoomInfo[];
    cachedRooms: Room[];
    constructor(){
        this.rooms = [];
        this.cachedRooms = [];
        this.update();
    }

    update(){
        console.log('Update room manager');
        for (let name in Game.rooms){
            if (!_.includes(this.cachedRooms, Game.rooms[name])){
                this.cachedRooms.push(Game.rooms[name]);
                this.rooms.push(new RoomInfo(Game.rooms[name]));
            }
        }
        console.log('Room manager.update');
        console.log(this.rooms.length)
        for (let room in this.rooms){
            console.log(this.rooms);
            let roomInfo = <RoomInfo> this.rooms[room];
            roomInfo.update();

            console.log('Building Road');
            for (let pathName in roomInfo.spawnSourcePath){
                console.log(roomInfo.roomControllerSourcePath[pathName]);
                console.log(roomInfo.roomControllerSourcePath[pathName].length);
                let path = roomInfo.roomControllerSourcePath[pathName].path;
                console.log(path.length);
                for (let coordName in path){
                    let coord = <RoomPosition> path[coordName];
                    console.log(coord.createConstructionSite(STRUCTURE_ROAD));
                }
            }
        }
    }
}

interface BasePath{
    
}

// This class will contain a room and hopefully all the relevant info, including paths.
class RoomInfo{
    room: Room;
    spawn: Spawn;
    controller: Controller;
    sources: Source[];
    spawnSourcePath: [property: string] = RoomPosition[];
    roomControllerSourcePath: {property: string} = RoomPosition[];;

    constructor(room: Room){
        this.room = room;
        this.sources = [];
        this.spawnSourcePath = {};
        this.roomControllerSourcePath = {path: Path};
        this.update();

    }

    update() {
        console.log("Update room info");
        // Get spawn in room
        for (let spawnName in Game.spawns){
            let spawn = Game.spawns[spawnName];
            if (spawn.room == this.room){
                this.spawn = Game.spawns[spawnName];
                break;
            }
        }

        // Get room controller
        this.controller = this.room.controller;


        // Get sources
        for (let activeSource of this.room.find(FIND_SOURCES_ACTIVE)){
            let source = <Source> activeSource;
            this.sources.push(source);

            // Build paths
            let id = source.id;
            this.spawnSourcePath[id] = new Path(this.spawn, source);
            this.roomControllerSourcePath[id] = new Path(this.spawn, source);
        }
    }
}

class Path{
    start: RoomPosition
    end: RoomPosition
    path: RoomPosition[]

    constructor(start, end){
        console.log("creating path");
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
        if (end instanceof Structure){
            let spawn = <Structure> end;
            this.end = end.pos;
        }

        let path = PathFinder.search(this.start, this.end);
        this.path = path.path;
        console.log('path', this.path);
    }
}