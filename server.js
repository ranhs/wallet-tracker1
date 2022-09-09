// const path = require('path');
const fs = require('fs');
const express = require('express');
// //const plugins = require('./src/server/plugin');
// var cors = require('cors');

// const port = process.env.PORT || 8080;

var app = express();
// // If an incoming request uses
// // a protocol other than HTTPS,
// // redirect that request to the
// // same url but with HTTPS
// const forceSSL = function() {
//   return function (req, res, next) {
//     if (req.headers['x-forwarded-proto'] !== 'https') {
//       return res.redirect(
//       ['https://', req.get('Host'), req.url].join('')
//       );
//     }
//     next();
//   }
// }

// // Instruct the app
// // to use the forceSSL
// // middleware
// if ( port == 8080 )
//   app.use(cors());
// else
//   app.use(forceSSL());

// // Run the app by serving the static files
// // in the dist directory
// app.use(express.static(__dirname + '/dist/wallet-tracker1/'));


// // plugins.plugin(app);

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/', function(req, res) {
  const s = path.join(__dirname + '/dist/wallet-tracker1/index.html');
  res.send('Hi' + " trying to read file from " + s + "does file exists? " + fs.existsSync(s));
  //res.sendFile(path.join(__dirname + '/dist/wallet-tracker1/index.html'));
});


// app.get('/login', function(req, res) {
//     res.sendFile(path.join(__dirname + '/dist/wallet-tracker1/index.html'));
//   });

// // Start the app by listening on the default port
app.listen(process.env.PORT || 3000)
// app.listen(port);
// console.log(`listenning on port ${port}`);
  