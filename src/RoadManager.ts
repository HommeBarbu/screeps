import RoomManager from './RoomManager'

export default class RoadManager {
    roomManager: RoomManager;
    constructor(roomManager: RoomManager){
        this.roomManager = roomManager;
    }

    buildRoads(){
        let rooms = this.roomManager.rooms;
        for (let room in rooms){
        }
    }
}