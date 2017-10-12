
To run: `npm test`
To test: `mocha ./__test__`

_server.js_  Starts the server by calling start() in \_server.js and referencing port as defined in .env

_lib/_server.js_ Main module, has the following routes off localhost:

GET /
  reads in a local file containing html
  returns said html for the cowsay and a 200

If a bad route is entered, a 404 and error message will be returned

GET /cowsay
   returns the provided query, or if none provided: "I need something good to say!"
   returns a 200

POST /api/cowsay
   expects a json key:value object
   if it receives valid json, it returns a 200, along with json containing the sent value

   If json is invalid, returns a 400 with a custom json object


*Helper functions*

_sendResponse()_: takes in content-type as string, response object, status code, and body.
 sends response and closes connection

 
