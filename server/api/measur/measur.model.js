'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MeasurSchema = new Schema({
  timestamp: Date,
  co2: Number,
  t: Number
});

module.exports = mongoose.model('Measur', MeasurSchema);
