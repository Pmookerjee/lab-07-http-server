'use strict';

const expect = require('expect');
const request = require('superagent');
const server = require('../_server');
const cowsay = require('cowsay');

const PORT = 4000;
const host = `localhost:${PORT}`;

describe('http server', function() {

  before(function(done) {
    server.listen(PORT, done);
  });

  after(function(done) {
    server.close(done);
  });

  it('should respond to a GET request', function(done) {
    request
      .get(`${host}/`)
      .end((err, res) => {
        expect(err).toBe(null);
        expect(res.text).toBe('wow, so much get');
        done();
      });
  });

  it('should process query params', function(done) {

    request
      .get(`${host}/query?testing=123`)
      .end((err, res) => {
        expect(err).toBe(null);
        expect(res.text).toBe('testing=123');
        done();
      });
  });

  it('should process JSON', function(done) {
    request
      .post(`${host}/`)
      .send({ test: 'hello world!'})
      .end((err, res) => {
        expect(err).toBe(null);
        expect(res.text).toBe('Got the JSON');
        done();
      });
  });

  it('should error on bad JSON', function(done) {
    request
      .post(`${host}/`)
      .send( '{test: bad json' )
      .end((err, res) => {
        expect(err).not.toBe(null);
        expect(res.text).toBe('bad json');
        done();
      });
  });
});
