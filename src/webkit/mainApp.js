'use strict';
var electronApp   = require('app');
var browserWindow = require('browser-window');
var mainWindow    = null;

var Database        = require('./storage/database');
var Authentication  = require('./Authentication');
var _this;

function CloudNodeApp() {
  this.request      = require('request');
  this.electronApp  = electronApp;
  _this             = this;
}

CloudNodeApp.prototype.init = function() {
  this.initDatabase();
  Authentication = new Authentication(Database);

  this.isAuthenticated();
};

CloudNodeApp.prototype.initDatabase = function() {
  Database.setup();
};

CloudNodeApp.prototype.isAuthenticated = function() {
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

CloudNodeApp.prototype.startApp = function(authToken) {
  this.authToken = authToken;

  mainWindow.openDevTools();

  mainWindow.loadUrl('file://' + __dirname + '/../index.html');
  mainWindow.show();
};

CloudNodeApp.prototype.getAuthToken = function() {
  return this.authToken;
};

CloudNodeApp.prototype.logOut = function() {
  Authentication.logOut();
  mainWindow.hide();
  this.isAuthenticated();
};

electronApp.on('ready', function() {
  mainWindow = new browserWindow({height: 700, width: 1115, show: false});
  mainWindow.loadUrl('file://' + __dirname + '/authViews/authenticating.html');

  var mainApp = new CloudNodeApp();
  mainWindow.mainApp = mainApp;
  mainApp.init();
});

