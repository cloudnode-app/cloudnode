'use strict';

var nwGui       = window.require('nw.gui');
var mainWindow  = nwGui.Window.get();

var Database        = require('./storage/database');
var Authentication  = require('./Authentication');
var _this;

function App() {
  this.request  = require('request');
  _this         = this;
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

// Starts the app
module.exports = new App();
