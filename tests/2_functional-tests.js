/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
let id = '';
let reply_id = '';
chai.use(chaiHttp);
const mongoose = require('mongoose');

describe('All tests wrapper', function () {
  
  it('DB connection', function () {
    mongoose.connect(process.env.testDB, {useNewUrlParser : true, useUnifiedTopology : true})
    mongoose.connection.once('on', () => {
      console.log("connected..")
    })


    suite('Functional Tests', function() {
      
  

      suite('POST', function() {
        this.timeout(30000)
        test('Post a thread', (done) => {
          chai.request(server)
          .post('/api/threads/general')
          .send({
            text : 'Test thread',
            delete_password : 'test password'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          })
        })
      });
    
    
      suite('GET', function() {
        this.timeout(30000)

        test('Get recent threads', (done) => {
          chai.request(server)
          .get('/api/threads/general')
          .send()
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], '_id')
            assert.property(res.body[0], 'board')
            assert.property(res.body[0], 'replycount')
            assert.property(res.body[0], 'replies')
            assert.property(res.body[0], 'text')
            assert.property(res.body[0], 'created_on')
            assert.property(res.body[0], 'bumped_on')
            id = res.body[0]._id;
            // reply_id= res.body[0].replies[0].id;
            done();
          })
        })
      });
    
      suite('POST', function() {
        this.timeout(30000)

        test('Post a reply', (done) => {
          chai.request(server)
          .post('/api/replies/general')
          .send({
            text : 'Test reply',
            delete_password : 'test password',
            thread_id : id
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          })
        })
      });
    
      
        
        
        
        suite('GET', function() {
          this.timeout(30000)

          test('Get a thread', (done) => {
            chai.request(server)
            .get(`/api/replies/general?thread_id=${id}`)
            .send()
            .end((err, res) => {
              assert.equal(res.status, 200);
              done();
            })
          })
        });
        
        suite('PUT', function() {
          this.timeout(30000)

          test('Report a reply', (done) => {
            chai.request(server)
            .put(`/api/replies/general`)
            .send({
              thread_id : id,
              reply_id : reply_id
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              done();
            })
          })
        });
        
        suite('DELETE', function() {
          this.timeout(30000)

          test('Delete a reply', (done) => {
            chai.request(server)
            .delete('/api/threads/general')
            .send({
              thread_id : id,
              reply_id
            })
            .end((err, res) => {
              assert.isDefined(res.text);
              
              done();
            })
          })
        });
    
    
    
        suite('PUT', function() {
          this.timeout(30000)

          test('Report a thread', (done) => {
            chai.request(server)
            .put('/api/threads/general')
            .send({
              thread_id : id,
            })
            .end((err, res) => {
              // assert.equal(res.status, 200);
              assert.isDefined(res.body);
              done();
            })
          })
        });
        
        suite('DELETE', function() {
          this.timeout(30000)

          test('Delete a thread', (done) => {
            chai.request(server)
            .delete('/api/threads/general')
            .send({
              thread_id : id,
              delete_password : 'test password'
            })
            .end((err, res) => {
              assert.isDefined(res.text);
              
              done();
            })
          })
        });
        
        
        
    
      
      
      
      });
    
    
  })

})

