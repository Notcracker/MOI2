var express = require('express');
var bodyParser = require('body-parser');

var	assert = require('assert');

var animelist = express.Router();
var Anilists = require('../models/anilists');

animelist.use(bodyParser.json());
animelist.route('/:userName')
.get(function(req,res,next){
	console.log(req.params.userName);
	res.sendFile('/home/miri/moi1/server/public/found.html');

})

animelist.route('/details/:userName')
.get(function(req,res,next){
	
			

		Anilists.find({'uName':req.params.userName},function(err,list){
			assert.equal(err,null);
			res.send(JSON.stringify({alist:list}));
		});
	
})

module.exports = animelist;