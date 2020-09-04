'use strict';

var mongoose = require('mongoose');

var MeetingSchema = new mongoose.Schema({
  title: String,
  start: { type: Date },
  type: String,
  end: { type: Date },
  invitees: [{
  	type: String
  }]
});

mongoose.model('Meeting', MeetingSchema);
