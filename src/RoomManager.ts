import * as _ from 'lodash';

// The sole point of this class is to act as an array of RoomInfo, is that okay?
export default class RoomCollection{
    rooms: RoomInfo[];
    cachedRooms: Room[];
    constructor(){
        this.rooms = [];
        this.cachedRooms = [];
        this.update();
    }

    update(){
        console.log('Update room manager');
        // Throw new rooms in an array
        for (let name in Game.rooms){
            if (!_.includes(this.cachedRooms, Game.rooms[name])){
                console.log("new room!");
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

            // Build roads to sources
            for (let pathName in roomInfo.spawnSourcePath){
                let path = roomInfo.spawnSourcePath[pathName];
                for (let roomPosName in path.path){
                    let roomPos = path.path[roomPosName];
                    roomInfo.room.createConstructionSite(roomPos.x, roomPos.y, STRUCTURE_ROAD);
                    roomInfo.room.createConstructionSite(roomPos.x+1, roomPos.y+1, STRUCTURE_ROAD);
                    roomInfo.room.createConstructionSite(roomPos.x-1, roomPos.y-1, STRUCTURE_ROAD);
                    roomInfo.room.createConstructionSite(roomPos.x-1, roomPos.y+1, STRUCTURE_ROAD);
                    roomInfo.room.createConstructionSite(roomPos.x+1, roomPos.y-1, STRUCTURE_ROAD);
                }
            }

            // Build roads to Room Controller
            for (let pathName in roomInfo.roomControllerSourcePath){
                let path = roomInfo.roomControllerSourcePath[pathName];
                for (let roomPosName in path.path){
                    let roomPos = path.path[roomPosName];
                    roomInfo.room.createConstructionSite(roomPos.x, roomPos.y, STRUCTURE_ROAD);
                    roomInfo.room.createConstructionSite(roomPos.x+1, roomPos.y+1, STRUCTURE_ROAD);
                    roomInfo.room.createConstructionSite(roomPos.x-1, roomPos.y-1, STRUCTURE_ROAD);
                    roomInfo.room.createConstructionSite(roomPos.x-1, roomPos.y+1, STRUCTURE_ROAD);
                    roomInfo.room.createConstructionSite(roomPos.x+1, roomPos.y-1, STRUCTURE_ROAD);
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
    spawnSourcePath: Path[];
    roomControllerSourcePath: Path[];

    constructor(room: Room){
        this.room = room;
        this.sources = [];
        this.spawnSourcePath = [];
        this.roomControllerSourcePath = [];
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
            if (!_.includes(this.sources, source)){
                this.sources.push(source);
            }

            // Build paths
            let id = source.id;
            console.log('ssp', !(id in this.spawnSourcePath));
            console.log('rcsp', !(id in this.roomControllerSourcePath));
            if (!(id in this.spawnSourcePath)){
                this.spawnSourcePath[id] = new Path(this.spawn, source);
            }
            if (!(id in this.roomControllerSourcePath)){
                this.roomControllerSourcePath[id] = new Path(this.controller, source);
            }
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
            console.log("Starts at spawn");
            let spawn = <Spawn> start;
            this.start = start.pos;
        }
        else if (start instanceof Structure){
            console.log("Starts at structure");
            let structure = <Structure> start;
            this.start = structure.pos;
        }

        if (end instanceof Spawn){
            console.log("Ends at spawn");
            let spawn = <Spawn> end;
            this.end = end.pos;
        }
        else if (end instanceof Structure){
            console.log("Ends at structure");
            let spawn = <Structure> end;
            this.end = end.pos;
        }else{
            console.log("BOLD: Ends at source");
            let spawn = <Spawn> end;
            this.end = end.pos;
        }

        let path = PathFinder.search(this.start, this.end);
        this.path = path.path;
    }
}