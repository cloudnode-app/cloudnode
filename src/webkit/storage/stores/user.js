'use strict';

var Datastore = null;

function Users(datastore) {
  Datastore = datastore;
}

Users.prototype.getAuthenticatedUser = function() {
  return Datastore.findOneAsync({ loggedIn: true});
};

Users.prototype.saveAuthentication = function(authToken) {
  return Datastore.insertAsync(authToken);
};

Users.prototype.saveUser = function(user) {
  return Datastore.updateAsync({ loggedIn: true}, user, {});
};

Users.prototype.logOut = function() {
  return Datastore.updateAsync({loggedIn: true}, { $set: { loggedIn: false }}, {});
};

module.exports = Users;
