/**
* cloudnode.api.endpoints Module
*
* Description
*/
angular.module('cloudnode.api.endpoints', [])

.constant('END_POINTS', {

  authorizationFlow : 'https://soundcloud.com/connect?scope=non-expiring&client_id=%s&response_type=%s&redirect_uri=%s',
  userAgentFlow     : 'https://soundcloud.com/connect?client_id=%s&response_type=token&redirect_uri=%s',

  me                : 'https://api.soundcloud.com/me.json',
  meStream          : 'https://api-v2.soundcloud.com/stream',
  meRepostIds       : 'https://api.soundcloud.com/e1/me/track_reposts/ids?linked_partitioning=1&limit=5000',
  meRepost          : 'https://api.soundcloud.com/e1/me/track_reposts/%s',
  meTracks          : 'https://api.soundcloud.com/me/tracks.json',
  meComments        : 'https://api.soundcloud.com/me/comments.json',
  meFollowing       : 'https://api.soundcloud.com/me/followings.json',
  meFollowers       : 'https://api.soundcloud.com/me/followers.json',
  meFavorites       : 'https://api.soundcloud.com/me/favorites.json',
  meFavoritesIds    : 'https://api.soundcloud.com/e1/me/track_likes/ids?linked_partitioning=1&limit=5000',
  meFavoriteTrack   : 'https://api.soundcloud.com/me/favorites/%s',
  meGroups          : 'https://api.soundcloud.com/me/groups.json',
  mePlaylists       : 'https://api.soundcloud.com/me/playlists.json',
  meConnections     : 'https://api.soundcloud.com/me/connections.json',

  users             : 'https://api.soundcloud.com/users.json',
  user              : 'https://api.soundcloud.com/users/%s.json',
  userActivity      : 'https://api-v2.soundcloud.com/profile/soundcloud:users:%s?limit=15',
  userTracks        : 'https://api.soundcloud.com/users/%s/tracks.json?linked_partitioning=1&limit=30',
  userRepost        : 'https://api.soundcloud.com/e1/%s/track_reposts?linked_partitioning=1&limit=30',
  userComments      : 'https://api.soundcloud.com/users/%s/comments.json',
  userFollowing     : 'https://api.soundcloud.com/users/%s/followings.json',
  userFollowers     : 'https://api.soundcloud.com/users/%s/followers.json',
  userFavorites     : 'https://api.soundcloud.com/users/%s/favorites.json',
  userGroups        : 'https://api.soundcloud.com/users/%s/groups.json',
  userPlaylists     : 'https://api.soundcloud.com/users/%s/playlists.json?linked_partitioning=1&limit=30',
  userSpotlight     : 'https://api-v2.soundcloud.com/users/%s/spotlight?limit=10&offset=0&linked_partitioning=1',
  userVisual        : 'https://visuals.soundcloud.com/visuals?urn=soundcloud%3Ausers%3A%s',

  tracks            : 'https://api.soundcloud.com/tracks.json',
  track             : 'https://api.soundcloud.com/tracks/%s.json',
  trackComments     : 'https://api.soundcloud.com/tracks/%s/comments.json',
  trackPermissions  : 'https://api.soundcloud.com/tracks/%s/permissions.json',
  trackSecretToken  : 'https://api.soundcloud.com/tracks/%s/secret-token.json',
  trackShare        : 'https://api.soundcloud.com/tracks/%s/shared-to/connections.json',

  comment           : 'https://api.soundcloud.com/comments/%s.json',

  groups            : 'https://api.soundcloud.com/groups.json',
  group             : 'https://api.soundcloud.com/groups/%s.json',
  groupUsers        : 'https://api.soundcloud.com/groups/%s/users.json',
  groupModerators   : 'https://api.soundcloud.com/groups/%s/moderators.json',
  groupMembers      : 'https://api.soundcloud.com/groups/%s/members.json',
  groupContributers : 'https://api.soundcloud.com/groups/%s/contibuters.json',
  groupTracks       : 'https://api.soundcloud.com/groups/%s/tracks.json',

  playlists         : 'https://api.soundcloud.com/playlists.json',
  playlist          : 'https://api.soundcloud.com/playlists/%s',

  exploreCategories : 'https://api-v2.soundcloud.com/explore/categories',
  explore           : 'https://api-v2.soundcloud.com/explore/%s',

  resolve           : 'https://api.soundcloud.com/resolve.json?url=%s'

});
