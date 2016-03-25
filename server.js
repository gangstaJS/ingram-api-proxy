const httpntlm = require('httpntlm');
const connect = require('connect');
const colors = require('colors');
const bodyParser = require('body-parser');
const config = require('./config');

const
    username = config.username, 
    password = config.password, 
    target = config.target, 
    domain = config.domain,
    port = 3800,
    app = connect();

app
.use(bodyParser.json())
.use(function(request, response) {

  var options = {
      url: target+request.url,
      username: username,
      password: password,
      workstation: '',
      domain: domain
  };

  if(request.method != 'GET' && request.method != 'OPTIONS') {
    options.json = request.body;
  }

  httpntlm[request.method.toLowerCase()](options, function (err, res){
      if(err) return err;
      response.setHeader('Access-Control-Allow-Origin', 'http://lvh.me:8765');
      response.setHeader('Access-Control-Allow-Credentials', 'true');
      response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
      response.setHeader('Access-Control-Allow-Headers', 'content-type, accept, authorization');

      
      response.write(res.body);
      response.end();

      console.log(request.method + ' proxy ingram API:'.green + request.url.yellow);
  });

});

// --

app.listen(port);
console.log(("Server is listening at port: "+port).bgGreen.white.bold);