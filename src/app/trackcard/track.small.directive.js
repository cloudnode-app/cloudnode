'use strict';

/**
* cloudnode.directive.trackcard
*
* The trackcard directive
*/

angular.module('cloudnode.directive.trackcard').

directive('trackCardSmall', function(){
  // Runs during compile
  return {
    controller: 'TrackCtrl',
    restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
    scope: {
      item: '=track',
      repostUser: '=',
      type: '=',
      context: '=',
      uuid: '=',
      simpleStyle: '='
    },
    templateUrl: 'trackcard/track.small.tmpl.html',
    link: function preLink(scope) {
      scope.isMini = true;

      if (scope.simpleStyle === null)
        scope.simpleStyle = false;

      if (!angular.isUndefined(scope.item) && scope.item.hasOwnProperty('artwork_url') && scope.item.artwork_url !== null)
        scope.item.artwork_url = scope.item.artwork_url.replace('large', 't300x300');
      else 
        scope.item.artwork_url = '';

      if (!angular.isUndefined(scope.item.user) && scope.item.user.hasOwnProperty('avatar_url') && scope.item.user.avatar_url !== null)
        scope.item.user.avatar_url = scope.item.user.avatar_url.replace('large', 't50x50');
      else
        scope.item.user.avatar_url= 'assets/artwork_placeholder.png';

      if ((scope.repostUser !== '' || scope.repostUser !== null) &&
          (scope.type === 'track-repost' || scope.type === 'playlist-repost')) {
        scope.isStreamRepost = true;
      }
    }
  };
});
