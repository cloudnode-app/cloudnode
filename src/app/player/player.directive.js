'use strict';

/**
* cloudnode Module
*
* Description
*/
angular.module('cloudnode.directive.player')

.directive('player', function () {
  return {
    restrict: 'E',
    controller: 'PlayerCtrl',
    templateUrl: 'player/player.tmpl.html'
  };
});
