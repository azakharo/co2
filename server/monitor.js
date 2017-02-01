'use strict';

const request = require("request");
const _ = require("lodash");
const Measur = require('./api/measur/measur.model');
const moment = require("moment");


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

let prevMonDt = null;

exports.monitorNewDay = function () {

  let curDt = moment();

  if (prevMonDt && curDt.date() !== prevMonDt.date()) { // if new day
    console.log("new day - clear the db");
    Measur.remove({}, function(err) {
      if (err) {
        console.log(err)
      } else {
        console.log('success');
      }
    });
  }

  prevMonDt = curDt;
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
