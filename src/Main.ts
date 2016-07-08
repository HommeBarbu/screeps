import Governor from './Governor'
declare var module: any;

// This shouldn't have to be referenced after this.
// Place all logic changes in the governor.
module.exports.loop = function() {
    let governor = new Governor();
    governor.govern();
}