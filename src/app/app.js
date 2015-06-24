'use strict';

/**
* cloudnode Module
*
* Description
*/
angular.module('cloudnode', [
  'ui.router',
  'ngMaterial',
  'ngMdIcons',
  'ngResource',
  'templates-app',

  'cloudnode.sidebar',
  'cloudnode.service.api',
  'cloudnode.directive.player'
])

.config(function ($urlRouterProvider, $locationProvider, $mdThemingProvider) {
  // Send unmatched routes to root
  $urlRouterProvider.otherwise('/');

  $locationProvider.hashPrefix('!');

  $mdThemingProvider.theme('default')
      .primaryPalette('orange', {
        'default': '800'
      })
      .dark();
})

.controller('AppCtrl', function($scope, ApiService) {
  $scope.appLoaded  = false;
  $scope.meUser     = null;

  $scope.initCloudNode = function () {
    ApiService.getMe().then(function(me) {
      $scope.meUser    = me;
      $scope.appLoaded = true;
    }, function(err){
      console.warn(err);
    });
  };

});

angular.element(document).ready(function() {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') window.location.hash = '#!';
});
