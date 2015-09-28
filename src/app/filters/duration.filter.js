'use strict';

/**
 * The duration filter
 *
 * Makes the millisecond duration human readable
 */

angular.module('cloudnode.filters.duration', [
])

.filter('durationToHuman', function(){
  return function(input){
    return moment.duration(input, 'ms').format('h:mm:ss');
  };
});
