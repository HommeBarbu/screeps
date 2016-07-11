import Governor from './Governor'
import RoomManager from './RoomManager'
declare var module: any;

// This shouldn't have to be referenced after this.
// Place all logic changes in the governor.
let governor = new Governor();
let roomManager = new RoomManager();
let init = 0;
console.log(init);
init = init + 1;
console.log(Game.time);
governor.bootstrap();
module.exports.loop = function() {
    console.log(Game.time);
    governor.govern();
}