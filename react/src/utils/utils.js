'use strict'

function durationStringToSeconds(duration) {
    const components = duration.split(':');
    return (+components[0]) * 60 * 60 + (+components[1]) * 60 + (+components[2]);
}
module.exports.durationStringToSeconds = durationStringToSeconds;

function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}
module.exports.getFromLS = getFromLS;

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl-8",
      JSON.stringify({
        [key]: value
      })
    );
  }
}
module.exports.saveToLS = saveToLS;
