'use strict';

angular.module('projectsApp')
  .controller('MainCtrl', function ($scope, $http, $timeout, socket) {
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


    ///////////////////////////////////////////////////////////////////////////
    // Chart

    $scope.chartConfig = {
      options: {
        title: {
          text: 'Monthly Average Temperature',
          x: -20 //center
        },
        subtitle: {
          text: 'Source: WorldClimate.com',
          x: -20
        },
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
          title: {
            text: 'Temperature (°C)'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        tooltip: {
          valueSuffix: '°C'
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
        }
      },
      series: [{
        name: 'Tokyo',
        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
      }, {
        name: 'New York',
        data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
      }, {
        name: 'Berlin',
        data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
      }, {
        name: 'London',
        data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
      }],
      size: {
        width: getChartW(),
        height: getChartH()
      }
    };

    function updateChartSize() {
      $scope.chartConfig.size.width = getChartW();
      $scope.chartConfig.size.height = getChartH();
    }

    function getChartW() {
      const windowW = window.innerWidth;
      const chartW = windowW - 20;
      return chartW;
    }

    function getChartH() {
      const parentH = $('.chart-section').height();
      const chartH = parentH - 20;
      return chartH;
    }

    window.onresize = debounce(function () {
      $timeout(updateChartSize, 0);
    }, 500);
    $timeout(updateChartSize, 500);

    // Chart
    ///////////////////////////////////////////////////////////////////////////

  });
