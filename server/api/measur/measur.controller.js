'use strict';

const _ = require('lodash');
const moment = require('moment');
const Measur = require('./measur.model');

// Get list of measurs
exports.index = function (req, res) {
  Measur.find({
    timestamp: {
      $gte: moment().startOf('day') // today only
    }
  }, function (err, measurs) {
    if (err) {
      return handleError(res, err);
    }
    // Sort by timestamp ascending
    measurs = _.sortBy(measurs, function (m) {
      return m.timestamp.getTime();
    });

    return res.status(200).json(measurs);
  });
};

// Get a single measur
exports.show = function(req, res) {
  Measur.findById(req.params.id, function (err, measur) {
    if(err) { return handleError(res, err); }
    if(!measur) { return res.status(404).send('Not Found'); }
    return res.json(measur);
  });
};

// Creates a new measur in the DB.
exports.create = function(req, res) {
  Measur.create(req.body, function(err, measur) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(measur);
  });
};

// Updates an existing measur in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Measur.findById(req.params.id, function (err, measur) {
    if (err) { return handleError(res, err); }
    if(!measur) { return res.status(404).send('Not Found'); }
    var updated = _.merge(measur, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(measur);
    });
  });
};

// Deletes a measur from the DB.
exports.destroy = function(req, res) {
  Measur.findById(req.params.id, function (err, measur) {
    if(err) { return handleError(res, err); }
    if(!measur) { return res.status(404).send('Not Found'); }
    measur.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
