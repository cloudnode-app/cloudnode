'use strict';

//var isWin = /^win/.test(process.platform);
var isMac = /^darwin/.test(process.platform);
//var isLinux32 = /^linux/.test(process.platform);
//var isLinux64 = /^linux64/.test(process.platform);

var nwGui       = window.require('nw.gui');
var mainWindow  = nwGui.Window.get();

var Database        = require('./storage/database');
var Authentication  = require('./Authentication');
var _this;

function App() {
  this.request  = require('request');
  _this         = this;

  if (isMac) {
    var mb = new nwGui.Menu({type:'menubar'});
    mb.createMacBuiltin('CloudNode');
    nwGui.Window.get().menu = mb;
  }
}

App.prototype.init = function() {
  mainWindow.showDevTools();

  this.initDatabase();
  Authentication = new Authentication(Database);

  this.isAuthenticated();
};

App.prototype.initDatabase = function() {
  Database.setup();
};

App.prototype.isAuthenticated = function() {
  Authentication.isAuthenticated().then(function (doc) {
    if (doc !== null) {
      _this.startApp(doc.authToken);
    } else {
      Authentication.openAuthenticationPopup(_this);
    }
  }, function (err) {
    console.log(err);
  });
};

App.prototype.startApp = function(authToken) {
  window.authToken = authToken;

  window.angular.bootstrap(window.document, ['cloudnode']);
  mainWindow.show();
};

App.prototype.logOut = function() {
  Authentication.logOut();
  mainWindow.hide();
  this.isAuthenticated();
};

// Starts the app
module.exports = new App();
