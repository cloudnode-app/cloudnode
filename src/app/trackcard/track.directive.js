'use strict';

/**
* cloudnode.directive.trackcard
*
* The trackcard directive
*/

angular.module('cloudnode.directive.trackcard').

directive('trackCard', function(){
  // Runs during compile
  return {
    controller: 'TrackCtrl',
    restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
    scope: {
      track: '=',
      user: '=',
      type: '=',
      context: '=',
      uuid: '='
    },
    templateUrl: 'trackcard/track.tmpl.html',
    link: function postCompile(scope) {
      if (!angular.isUndefined(scope.track) && scope.track.hasOwnProperty('artwork_url'))
        scope.track.artwork_url = scope.track.artwork_url.replace('large', 't300x300');
      else
        scope.track.artwork_url = 'assets/artwork_placeholder.png';
    }
  };
});
