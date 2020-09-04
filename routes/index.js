'use strict';

var express = require('express');
var mongoose = require('mongoose');
var path = require('path');

var router = express.Router();

var Meeting = mongoose.model('Meeting');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'meetingsch8@gmail.com',
    pass: 'Hello@123'
  }
});

router.get('/meetings', function(req, res, next) {
  Meeting.find(function(err, meetings){
    if(err) return next(err);
    res.json(meetings);
  });
});

router.post('/meetings', async function(req, res, next) {
  Meeting.create(req.body, function(err, meeting){
    if(err) return next(err);
    res.json(meeting);
  });
  for (var i = 0; i < req.body.invitees.length; i++) {
    var mailOptions = {
      from: 'meetingsch8@gmail.com',
      to: req.body.invitees[i],
      subject: 'New Meeting: ' + req.body.title,
      text: 'You have a new meeting regarding: '+ req.body.title + '!\n\n' + 'It will start at: ' + (new Date(req.body.start)) + ' and end at: ' + (new Date(req.body.end)) + '.\n\nThank you!'
    };
    await transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log("SUCCESS!");
      }
    });
  }
});

router.get('/meetings/:meeting', function(req, res, next) {
  Meeting.findById(req.params.meeting, req.body, function (err, meeting) {
    if (err) return next(err);
   res.json(meeting);
  });
});

router.put('/meetings/:meeting', async function(req, res, next) {
  Meeting.findByIdAndUpdate(req.params.meeting, req.body, function (err, meeting) {
    if (err) return next(err);
    res.json(meeting);
  });
  for (var i = 0; i < req.body.invitees.length; i++) {
    var mailOptions = {
      from: 'meetingsch8@gmail.com',
      to: req.body.invitees[i],
      subject: 'Updated Meeting: ' + req.body.title,
      text: 'Your meeting regarding: '+ req.body.title + ' has been updated!\n\n' + 'It will start at: ' + (new Date(req.body.start)) + ' and end at: ' + (new Date(req.body.end)) + '.\n\nThank you!'
    };
    await transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log("SUCCESS!");
      }
    });
  }
});

router.delete('/meetings/:meeting', async function(req, res, next) {
  Meeting.findByIdAndRemove(req.params.meeting, req.body, function (err, meeting) {
    if (err) return next(err);
    res.json(meeting);
  });
});

module.exports = router;
