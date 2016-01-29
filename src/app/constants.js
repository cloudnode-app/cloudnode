'use strict';

/**
* cloudnode Module constants
*
* Description
*/
angular.module('cloudnode.constants', [])

.constant('APP', {

  'LIKES_STRING':{
  false: 'Like track',
  true: 'Unlike track'
  },
  'COLORS':{
    true: '#EF6C00',
    orange: '#EF6C00',
    false: '#fff',
    white: '#fff'
  },
  'REPOST_STRING': {
    false: 'Repost track',
    true: 'Unrepost track'
  },
  'MISC_STRINGS': {
    queue: 'Add to queue'
  },

  'PLAY_ICON_SMALL': {
    true: 'pause',
    false: 'play_arrow'
  }
});
