'use strict';
var browserWindow = require('browser-window');
var Utils = require('./Utils.js');

var Database = null;
var _this;

function Authentication(database) {
  Database  = database;
  _this     = this;
}

/**
 * Function to open the soundcloud authenticate popup
 * If successful, save token and show app
 * @return {void}
 */
Authentication.prototype.openAuthenticationPopup = function openPopup(mainApp) {
  var popUp = new browserWindow({height: 500, width: 500, show: true, });
  popUp.loadUrl('http://www.cloudnodeapp.com/redirect.html');

  this.handlePopup(mainApp, popUp);
};

Authentication.prototype.handlePopup = function(mainApp, popUp) {
  var authToken = null;
  popUp.openDevTools();

  var popUpContent = popUp.webContents;
  popUpContent.on('did-finish-load', function() {
    var url = popUpContent.getUrl();
    var baseUrl = url.split('?')[0];
    if (baseUrl === 'http://www.cloudnodeapp.com/authcallback.html'){

      // Get the authentication token
      authToken = Utils.getUrlVars(url)['#access_token'];

      // Set authenticating view
      popUp.loadUrl('file://' + __dirname + '/authViews/authenticating.html');

      // Save the auth and start app
      _this.saveAuth(mainApp, popUp, authToken);
    }
  });
};

Authentication.prototype.saveAuth = function(mainApp, popUp, authToken) {
  var doc = {authToken: authToken, loggedIn: true};

  _this.saveAuthentication(doc).then(function (){
    popUp.close();
    mainApp.startApp(authToken);
  }, function (err) {
    console.log(err);
    popUp.loadUrl('file://' + __dirname + '/authViews/authenticateFailed.html');
  });
};

/**
 * Authenticate the user
 * Use the localstorage to look for a key
 * @return {boolean}
 */
Authentication.prototype.isAuthenticated = function() {
  return Database.stores.users.getAuthenticatedUser();
};

Authentication.prototype.saveAuthentication = function(authToken) {
  return Database.stores.users.saveAuthentication(authToken);
};

Authentication.prototype.saveUser = function(user) {
  return Database.stores.users.saveUser(user);
};

Authentication.prototype.logOut = function() {
  return Database.stores.users.logOut();
};

module.exports = Authentication;
