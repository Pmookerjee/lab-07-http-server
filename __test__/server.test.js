'use strict';
require('dotenv').config();

const chai = require('chai');
const request = require('superagent');
const server = require('../lib/_server.js');
const fs = require('fs');

const host = `localhost:${process.env.PORT}`;

let expect = chai.expect;

describe('http server', function() {

  before((done) => {
    server.start(process.env.PORT, () => {
      console.log('Server up at ', process.env.PORT);
      done();
    });
  });

  after((done) => {
    server.stop(() => done());
  });

  it('should respond to a GET request', function(done) {

    let html = fs.readFileSync('./lib/data/cowsay.html');

    request
      .get(`${host}/`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(res.text).to.have.string('Making http requests more amooooooosing');
        done();
      });
  });

  it('should process the query param', function(done) {

    request
      .get(`${host}/cowsay?text=thisIsNOTaMOOsing`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(res.text).to.have.string('thisIsNOTaMOOsing');
        done();
      });
  });

  it('should gracefully handle no given query param', function(done) {

    request
      .get(`${host}/cowsay?`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(res.text).to.have.string('I need something good to say!');
        done();
      });
  });

  it('should process POST to cowsay', function(done) {
    request
      .post(`${host}/api/cowsay`)
      .send({ text: 'I am feeling so moooorose'})
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(res.text).to.have.string('{ "content": "I am feeling so moooorose" }');
        done();
      });
  });

  it('should error on bad JSON', function(done) {
    request
      .post(`${host}/api/cowsay`)
      .send( '{text: absolute moonstrocity' )
      .end((err, res) => {
        expect(err).not.to.be.null;
        expect(res.status).to.equal(400);
        expect(res.text).to.have.string('{ "ERROR": "invalid request: text query required" }');
        done();
      });
  });

  it('should return a 404 on bad url', function(done) {
    request
      .get(`${host}/sheep`)
      .end((err, res) => {
        expect(err).not.to.be.null;
        expect(res.status).to.equal(404);
        expect(res.text).to.have.string('Resource not found');
        done();
      });
  });

});
