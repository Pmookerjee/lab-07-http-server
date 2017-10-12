'use strict';

const http = require('http');
const parseRequest = require('./parseRequest.js');
const parseBody = require('./parseBody.js');
const cowsay = require('cowsay');
const fs = require('fs');

let read = (filename) => {

  return new Promise(function(resolve, reject) {

    fs.readFile(filename, (err, data) => {
      if(err) reject(err);
      resolve(data);
    });
  });
};


let sendResponse = function(type, res, status, body) {

  res.writeHead(status, {'Content-Type': `${type}`});
  res.write(body);
  res.end();
};

const server = module.exports = http.createServer((req, res) => {

  parseRequest.execute(req);

  if(req.method === 'GET' && req.url.pathname === '/'){
    try {

      read('./lib/data/cowsay.html')
      .then((data) => {
        sendResponse('text/html', res, 200, cowsay.say({ text: `${data}`}));
      })
      .catch((err) => {
        console.log(`error is ${err}`);
      });


    } catch(err) {
      console.log('err is catch is', err);
      sendResponse('text/plain', res, 400, cowsay.say({text: 'bad request'}));
    }
  }

  else if(req.method === 'GET' && req.url.pathname === '/cowsay') {

    try {

      if(Object.getOwnPropertyNames(req.url.query).length === 0){
        sendResponse('text/html', res, 200, cowsay.say({text: `I need something good to say!`}));
      }
      else {
        sendResponse('text/html', res, 200, cowsay.say({text: `${req.url.query.text}`}));
      }

    } catch(err) {
      console.log('err is catch is', err);
      sendResponse('text/html', res, 400, cowsay.say({text: 'bad request'}));
      throw err;
    }

  }

  else if(req.method === 'POST' && req.url.pathname === '/api/cowsay') {

    parseBody.execute(req)

    .then((req) => {

      res.writeHead(200, {'Content-Type': 'text/json'});
      res.statusMessage = 'OK';
      res.write(cowsay.say({text: `{ "content": ${JSON.stringify(req.body.text)} }`}));
      res.end();
      return;

    })

    .catch((err) => {
      console.log(`Error in POST: ${err}`);
      res.writeHead(400, {'Content-Type': 'text/json'});
      res.write(cowsay.say({text: '{ "ERROR": "invalid request: text query required" }'}));
      res.end();
      return;
    });

  } else {
    sendResponse('text/html', res, 404, 'Resource not found');
  }

});
