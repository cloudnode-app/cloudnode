'use strict';

// Node libraries
var BPromise  = require('bluebird');
var Datastore = require('nedb');
var path      = require('path');

var UserStore = require('./stores/user.js');

/**
 * The database class
 */
function Database() {
  this.stores = {};
}

Database.prototype.setup = function() {
  console.log(window.require('nw.gui').App.dataPath);
  var userStore = new Datastore({ filename: path.join(window.require('nw.gui').App.dataPath, 'users.db'), autoload: true });
  this.stores.users  = new UserStore(BPromise.promisifyAll(userStore));
};

Database.prototype.stores = function() {
  return this.stores;
};

module.exports = new Database();
