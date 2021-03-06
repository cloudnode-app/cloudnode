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
      item: '=track',
      repostUser: '=',
      type: '=',
      context: '=',
      uuid: '='
    },
    templateUrl: 'trackcard/track.tmpl.html',
    link: function postCompile(scope) {
      scope.isMini = false;

      if (!angular.isUndefined(scope.item) && scope.item.hasOwnProperty('artwork_url') && scope.item.artwork_url !== null)
        scope.item.artwork_url = scope.item.artwork_url.replace('large', 't300x300');
      else
        scope.item.artwork_url = 'assets/artwork_placeholder.png';

      if ((scope.repostUser !== '' || scope.repostUser !== null) &&
          (scope.type === 'track-repost' || scope.type === 'playlist-repost')) {
        scope.isStreamRepost = true;
      }
    }
  };
});
