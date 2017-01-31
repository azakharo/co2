/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Measur = require('./measur.model');

exports.register = function(socket) {
  Measur.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Measur.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('measur:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('measur:remove', doc);
}