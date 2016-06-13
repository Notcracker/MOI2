var express = require('express');
var path = require('path');
var morgan = require('morgan');
var mongoose = require('mongoose');

	
var urldb = 'mongodb://localhost:27017/mal';

var hostname = '0.0.0.0';
var port = 3000;



mongoose.connect(urldb);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");
});

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use('/',require('./routers/search.js'))
app.use('/aList',require('./routers/animelist.js'))
app.use(express.static(path.join(__dirname, 'public')));
app.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});