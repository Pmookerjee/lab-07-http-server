'use strict';

// const http = require('http');
const http = require('http');
const PORT = process.env || 3000;


 let sendResponse = function(res, status, body) {
   res.writeHead(status, {'Content-Type': 'text/plain'});
   res.write(body);
   res.end();
 }

const server = http.createServer((req, res) => {



  if(req.method === 'GET' && req.url === '/'){
    sendResponse(res, 200, 'wow, so much get');
  }

  else if(req.method === 'POST' && req.url === '/') {

    let body = '';
    req.on('data', function(data){
      body += data.toString();
    });

    req.on('end', function() {
      let json;
      try {
        json = JSON.parse(body);
      } catch(e) {
        return sendResponse(res, 400, 'bad json');
      }
      console.log(json);
      sendResponse(res, 200, 'Got the JSON');
    });
  } else {
    sendResponse(res, 400, 'bad request');
  }
});

server.listen(3000);
