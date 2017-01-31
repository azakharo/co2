'use strict';

angular.module('projectsApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.measurs = [];

    $http.get('/api/measurs').success(function(measurs) {
      $scope.measurs = measurs;
      if (measurs.length > 0) {
        $scope.latestMeasur = measurs[measurs.length - 1];
      }
      socket.syncUpdates('measur', $scope.measurs, onNewMeasur);
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('measur');
    });

    function onNewMeasur(socketEvent, measur) {
      if (socketEvent == 'created') {
        $scope.latestMeasur = measur;
      }
    }

  });
