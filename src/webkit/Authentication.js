'use strict';
var nwGui = window.require('nw.gui');
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
Authentication.prototype.openAuthenticationPopup = function openPopup(app) {

  var popUp = nwGui.Window.open('http://www.cloudnodeapp.com/redirect.html', {
        position: 'center',
        width: 500,
        height: 500,
        focus: true,
        toolbar: false
      });

  this.handlePopup(app, popUp);
};

Authentication.prototype.handlePopup = function(app, popUp) {
  var authToken = null;
  popUp.on('loaded', function() {
    if ((popUp.window.location.hostname + popUp.window.location.pathname) === 'www.cloudnodeapp.com/authcallback.html'){

      // Get the authentication token
      authToken = Utils.getUrlVars(popUp.window.location.href)['#access_token'];

      // Set authenticating view
      popUp.window.location.href = 'file://' + __dirname + '/authViews/authenticating.html';

      // Save the auth and start app
      _this.saveAuthAndStart(authToken, popUp, app);
    }
  });
};

Authentication.prototype.saveAuthAndStart = function(authToken, popUp, app) {
  var doc = {authToken: authToken, loggedIn: true};

  _this.saveAuthentication(doc).then(function (){
    popUp.close();
    app.startApp(authToken);
  }, function (err) {
    console.log(err);
    popUp.window.location.href = 'file://' + __dirname + '/authViews/authenticateFailed.html';
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
