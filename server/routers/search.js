var express = require('express');
var bodyParser = require('body-parser');
var assert = require('assert');
var Promise = require("bluebird");
var URL = require('url-parse');
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
//var tr = require('tor-request');	

var Anilist = require('../models/anilists');

var obj = {};
var START_URL = null;
var url = null;
var baseUrl = null;
var search = express.Router();
var m = null;

search.use(bodyParser.json());
search.route('/')
.get(function(req,res,nex){
	res.sendFile('/home/miri/moi1/server/public/index.html')
})
.post(function(req,res,next){
	console.time('function');	
		console.log(req.body.userName);
		START_URL = "http://myanimelist.net/malappinfo.php?u="+req.body.userName+"&status=all&type=anime";
		url = new URL(START_URL);
		baseUrl = url.protocol + "//" + url.hostname;
		Anilist.find({'uName':req.body.userName},function (err, list) {
			assert.equal(err,null);
			
			if (!list[0]) {

				visitPage(START_URL)
				.then(GetStats)
				.then(function(){
					
						
						Anilist.create(obj, function(err, result) {
							assert.equal(null,err);		
								
								var name = req.body.userName;
								
									res.send(JSON.stringify({userName2:req.body.userName}));
										
							});
										

							});
					
				
			} else {
				console.log('Already exist!');
				console.timeEnd('function');
				res.send(JSON.stringify({userName2:req.body.userName}));
			}
		})


      
});

module.exports = search;




//helpers

function visitPage(url) {
	return new Promise(function(resolve, reject){
						
				// Make the request
				console.log("Visiting page " + url);
				request(url, function(error, response, body) {
					 // Check status code (200 is HTTP OK)
					 console.log("Status code: " + response.statusCode);
					 
					 // Parse the document body
					 var $ = cheerio.load(body, { xmlMode: true });
					// var uName = $('user_name').text();
					// var userId = $('user_id').text();
					// var uWatching = Number($('user_watching').text());
					// var uCompleted = Number($('user_completed').text());
					// var uOnhold = Number($('user_onhold').text());
					// var uDropped = Number($('user_dropped').text());
					// var uPTW = Number($('user_plantowatch').text());
					// var uDSW = Number($('user_days_spent_watching').text());
					

					 obj.uName= $('user_name').text();
					 obj._id = $('user_id').text();
					 //m = obj._id;
					 obj.meanScore = 0;
					 obj.uWatching = Number($('user_watching').text());
					 obj.uCompleted = Number($('user_completed').text());
					 obj.uOnhold = Number($('user_onhold').text());
					 obj.uDropped = Number($('user_dropped').text());
					 obj.uPTW = Number($('user_plantowatch').text());
					 obj.uDSW = Number($('user_days_spent_watching').text());
					 obj.watchedEpsAll = 0;
					
					 obj['anime']=[];
					 console.log($('anime').length);
					 $('anime').each(function(i, element){
					 	var myStatus;
					 	if ( $(this).children('my_status').text()=== '6') {
			                myStatus = "ptw";
			            }
			            else if ($(this).children('my_status').text() === '1') {
			                myStatus = "watching";
			            } 
			            else if ($(this).children('my_status').text() === '2') {
			                myStatus = "completed";
			            }
			            else if ($(this).children('my_status').text() === '3') {
			                myStatus = "onhold";
			            }
			            else if ($(this).children('my_status').text() === '4') {
			                myStatus = "dropped";
			            
			            }
					 	var id = $(this).children('series_animedb_id');
					 	var allEp = Number($(this).children('series_episodes').text());
					 	var watchedEp = Number($(this).children('my_watched_episodes').text());
					 	var myScore = Number($(this).children('my_score').text());
					 	obj.watchedEpsAll = obj.watchedEpsAll + Number($(this).children('my_watched_episodes').text());
					 	obj.anime.push({ url: baseUrl + '/anime/' + id.text(),
					 		_id: id.text(),
					 		seriesTitle: $(this).children('series_title').text(),
					 		myScore: myScore,
					 		tags: $(this).children('my_tags').text(),
					 		myStartDate: $(this).children('my_start_date').text(),
					 		myFinishDate: $(this).children('my_finish_date').text(),
					 		myStatus: myStatus,
					 		allEp: allEp,
					 		watchedEp: watchedEp
					 	});

						if ($('anime').length===(i+1)){
							console.log('watchedepsAll',obj.watchedEpsAll)
							console.log('RESOLVE')
							resolve(obj);
						}

					});
					
					
					
					
				 
				});
	
		});
};

function GetStats(obj) {
	
	return new Promise(function(resolve){
				var L = 1;
				obj.types = {
					'TV':0,
					'Movie':0,
					'OVA':0,
					'Special':0,
					'ONA':0
				};
					for (var i = 0; i<obj.anime.length; i++){
						(function(i){

					 	if (obj.anime[i].myScore!==0){
					 		L = L+1;
							obj.meanScore = (obj.anime[i].myScore + obj.meanScore);
							console.log(L);
						
							}
							setTimeout(function(){
									
								request('http://myanimelist.net/includes/ajax.inc.php?t=64&id='+obj.anime[i]._id,
												//method: "GET",
												//proxy:'http://51.254.106.69:80'
												//timeout:10000
											//},
											
											function(error, response, body){
												
												
												/*if (response.statusCode==429){
													console.log(JSON.stringify(response.headers, response.body));
												};*/
												//console.log(response.statusCode);
												if (!error && response.statusCode == 200) {

										            var $ = cheerio.load('<body>' + body + '</body>');
										            var $body = $('body');

										            $('body div').children().empty();
										            var description = $('body div').text().trim();
										            var keys = $('body span').text().split(':');
										            keys.splice(-1, 1);
										            $body.children().empty();
										            var values = $body.text().trim().split('\n');

										            
										            obj.anime[i].description = description;
										            
										            
										            for(var j = 0; j<keys.length; j++) {
										            	if (keys[j].toLowerCase().trim()==='type'){

										            		switch(values[j].trim()) {
															    case 'TV':
															        obj.types['TV'] = obj.types['TV'] + 1;
															        break;
															    case 'Movie':
															        obj.types['Movie'] = obj.types['Movie'] + 1;
															        break;
															    case 'OVA':
															        obj.types['OVA'] = obj.types['OVA'] + 1;
															        break;
															    case 'Special':
															        obj.types['Special'] = obj.types['Special'] + 1;
															        break;
															    case 'ONA':
															        obj.types['ONA'] = obj.types['ONA'] + 1;
															        break;
															 };
															 obj.anime[i][(keys[j].toLowerCase().trim())] = (values[j].trim());

															} else if (keys[j].toLowerCase().trim()==='genres'){
																obj.anime[i][(keys[j].toLowerCase().trim())] = (values[j].trim()).split(', ');
															} else {
																obj.anime[i][(keys[j].toLowerCase().trim())] = (values[j].trim());
															}
																
														
																									          
								            		}
								            		
								            		//console.log(l, le);

								            		
							            		
									        }
									        //l = l +1;
									      // console.log(l, le);
									        if (i===obj.anime.length-1){
									        	
									        		obj.meanScore = obj.meanScore/(L-1);
									        		console.log(obj.meanScore);
									        
									    
												resolve(obj);
											}
											

										});
							},100*i);
						})(i);
					};
				
			
		
	
	});
};	
		

