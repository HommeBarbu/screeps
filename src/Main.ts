import Governor from './Governor'
declare var module: any;

// This shouldn't have to be referenced after this.
// Place all logic changes in the governor.
let governor = new Governor();
governor.bootstrap();
module.exports.loop = function() {
    governor.govern();
}