/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const control = require('../controller/controller');
const mongoose = require('mongoose');
const db = mongoose.connection;

mongoose.connect(process.env.DB,{useNewUrlParser : true, useUnifiedTopology : true,useFindAndModify : false})


db.once('open',(err) => console.log("Connected to the database..."))
module.exports = function (app) {
  //Thread operations
  app.route('/api/threads/:board')
  .get(control.getRecent)
  .post(control.postThread)
  .put(control.reportThread)
  .delete(control.deleteThread)
    
  // Reply operations
  app.route('/api/replies/:board')
  .get(control.getAll)
  .post(control.postReply)
  .put(control.reportReply)
  .delete(control.deleteReply)

};
