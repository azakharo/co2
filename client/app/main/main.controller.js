'use strict';

angular.module('projectsApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.measurs = [];

    $http.get('/api/measurs').success(function(measurs) {
      $scope.measurs = measurs;
      socket.syncUpdates('measur', $scope.measurs);
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('measur');
    });

  });
