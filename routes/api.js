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
