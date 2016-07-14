import Governor from './Governor'
import RoomCollection from './RoomManager'
import * as _ from 'lodash';
declare var module: any;

// This shouldn't have to be referenced after this.
// Place all logic changes in the governor.
let governor = new Governor();
let roomCollection = new RoomCollection();
console.log('init');
governor.bootstrap();
module.exports.loop = function() {
  /*  if (_.endsWith(Game.time.toString(),'1')){
        roomCollection.update();
    }*/
    governor.govern();
}