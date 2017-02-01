'use strict';

angular.module('projectsApp')
  .controller('MainCtrl', function ($scope, $http, $timeout, socket) {
    $scope.measurs = [];
    $scope.chartTimeVals = [];
    $scope.chartTempVals = [];
    $scope.chartCo2Vals = [];

    $http.get('/api/measurs').success(function(measurs) {
      $scope.measurs = measurs;
      if (measurs.length > 0) {
        $scope.latestMeasur = measurs[measurs.length - 1];
      }

      // Prepare chart data
      $scope.chartTimeVals = _.map(measurs, function(m){
        return moment(m.timestamp).format('HH:mm');
      });
      $scope.chartCo2Vals = _.map(measurs, 'co2');
      $scope.chartTempVals = _.map(measurs, 't');
      drawChart();

      socket.syncUpdates('measur', $scope.measurs, onNewMeasur);
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('measur');
    });

    function onNewMeasur(socketEvent, measur) {
      if (socketEvent == 'created') {
        $scope.latestMeasur = measur;
        $scope.chartTimeVals.push(moment(measur.timestamp).format('HH:mm'));
        $scope.chartCo2Vals.push(measur.co2);
        $scope.chartTempVals.push(measur.t);
      }
    }


    ///////////////////////////////////////////////////////////////////////////
    // Chart

    function drawChart() {
      $scope.chartConfig = {
        options: {
          title: {
            text: '',
            x: -20 //center
          },
          credits: {
            enabled: false
          },
          xAxis: {
            categories: $scope.chartTimeVals,
            crosshair: true
          },
          yAxis: [
            { // co2 yAxis
              labels: {
                format: '{value}'
              },
              title: {
                text: 'CO2, ppm'
              },
              allowDecimals: false
            },
            { // Temp yAxis
              title: {
                text: 'Температура, град.Цельсия'
              },
              labels: {
                format: '{value}'
              },
              allowDecimals: true,
              opposite: true,
              min: 18,
              max: 30,
              gridLineWidth: 0
            }
          ],
          tooltip: {
            shared: true
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
          }
        },
        series: [{
          name: 'CO2',
          data: $scope.chartCo2Vals,
          yAxis: 0,
          tooltip: {
            valueSuffix: ' ppm'
          }
        }, {
          name: 'temp',
          data: $scope.chartTempVals,
          yAxis: 1,
          tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:.1f} C</b><br/>',
            valueSuffix: ' С'
          }
          }],
        size: {
          width: getChartW(),
          height: getChartH()
        }
      };
    }

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
