'use strict'

function durationStringToSeconds(duration) {
    const components = duration.split(':');
    return (+components[0]) * 60 * 60 + (+components[1]) * 60 + (+components[2]);
}
module.exports.durationStringToSeconds = durationStringToSeconds;
