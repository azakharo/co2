'use strict';

// Disable chart animation
Highcharts.setOptions({
  plotOptions: {
    series: {
      animation: false
    }
  }
});

angular.module('projectsApp')
  .controller('MainCtrl', function ($scope, $http, $timeout, $interval, socket) {
    /////////////////////////////////////////////
    // Startup

    init();
    $timeout(updateChartSize, 500);

    // Monitor new day
    let prevMonDt = null;
    let newDayMon = $interval(function () {
      let curDt = moment();

      if (prevMonDt && curDt.date() !== prevMonDt.date()) { // if new day
        socket.unsyncUpdates('measur');
        init();
      }

      prevMonDt = curDt;
    }, 7000);

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('measur');
      $interval.cancel(newDayMon);
    });

    // Startup
    /////////////////////////////////////////////


    function init() {
      $scope.measurs = [];
      $scope.chartTimeVals = [];
      $scope.chartTempVals = [];
      $scope.chartCo2Vals = [];

      $http.get('/api/measurs').success(function(measurs) {
        $scope.measurs = measurs;
        if (measurs.length > 0) {
          $scope.latestMeasur = measurs[measurs.length - 1];
          updateMinMax();
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
    }


    function onNewMeasur(socketEvent, measur) {
      if (socketEvent == 'created') {
        $scope.latestMeasur = measur;
        $scope.chartTimeVals.push(moment(measur.timestamp).format('HH:mm'));
        $scope.chartCo2Vals.push(measur.co2);
        $scope.chartTempVals.push(measur.t);
        updateMinMax();
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

    // Chart
    ///////////////////////////////////////////////////////////////////////////


    //*****************************************************
    // Calc min, avg, max

    function updateMinMax() {
      const measurs = $scope.measurs;

      $scope.tMin = _.minBy(measurs, 't').t;
      $scope.tAvg = _.meanBy(measurs, 't');
      $scope.tMax = _.maxBy(measurs, 't').t;

      $scope.co2Min = _.minBy(measurs, 'co2').co2;
      $scope.co2Avg = _.meanBy(measurs, 'co2');
      $scope.co2Max = _.maxBy(measurs, 'co2').co2;
    }

    // Calc min, avg, max
    //*****************************************************

    //===============================================================
    // Limits

    $scope.getCo2Class = function (co2) {
      if (co2 <= 600) {
        return "val-normal";
      }
      else if (co2 > 600 && co2 < 1000) {
        return "val-warn";
      }
      else {
        return "val-danger";
      }
    };

    // Limits
    //===============================================================

  });
