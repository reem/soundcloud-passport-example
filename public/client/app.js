/* globals angular */

angular.module('soundTiles', [])

.factory('soundCloudService', ['$http', function ($http) {
  var getSongs = function () {
    return $http({
      method: 'GET',
      url: '/popular'
    });
  };

  return {
    getSongs: getSongs
  };
}])

.controller('tilesController', ['$scope', 'soundCloudService',
  function ($scope, soundCloudService) {
    soundCloudService.getSongs().then(function (songs) {
      $scope.tiles = JSON.parse(songs);
    });
  }
]);
