'use strict';

var request = require("request");
var _ = require("lodash");
var Measur = require('./api/measur/measur.model');


exports.monitor = function() {

  getMeasurement('http://co2.corp.sarov-itc.ru/co2.json', function (err, data) {
    if (err) {
      return;
    }
    //console.log(data);

    // Create new measurement
    var newMeasur = {
      timestamp: new Date(),
      co2: data.co2,
      t: data.temp
    };
    Measur.create(newMeasur);

  });
};

function getMeasurement(url2req, callback) {
  request({
      url: url2req,
      json: true
    },
    function (error, response, body) {
      if (error) {
        console.log(error);
        return callback(error, null);
      }
      return callback(null, body);
    });
}
