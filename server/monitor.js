'use strict';

var request = require("request");
var _ = require("lodash");

exports.monitor = function() {

  getMeasurement('http://co2.corp.sarov-itc.ru/co2.json', function (err, data) {
    if (err) {
      return;
    }
    console.log(data);
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
