'use strict';

/**
 * Get url vars out of a window.location.href
 * @param  {string} windowHref A window.location.href
 * @return {array}            array with the hashes
 */
function getUrlVars(windowHref) {
  var vars = [], hash;

  var hashes = windowHref.slice(windowHref.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++)
  {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
  }
  return vars;
}

module.exports = {
  getUrlVars: getUrlVars
};
