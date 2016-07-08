import {Governor} from './Governor.ts';

declare var module: any;

// TODO: Those clever skeleton guys had a cool init function here...

// This shouldn't have to be referenced after this.
// Place all logic changes in the governor.
module.exports.loop = function() {
    let governor = new Governor();
    governor.govern();
}