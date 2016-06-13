var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var Promise = require("bluebird");
var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');


// Connection URL
var urldb = 'mongodb://localhost:27017/conFusion';

var START_URL = "http://myanimelist.net/malappinfo.php?u=MikoRise&status=all&type=anime";
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;


var obj = {};



visitPage(START_URL)
.then(GetStats)
.then(function(array1){
	MongoClient.connect(urldb,function(err,db){
		assert.equal(err,null);
		console.log('Connected correctly to server');

		var collection = db.collection('mally');
		collection.insert(array1, function(err, result) {
				assert.equal(err,null);
				db.close();		
				console.timeEnd('function');	
				console.log(array1);				
			});
	});
});

function visitPage(url) {
	return new Promise(function(resolve, reject){
						
						// Make the request
						console.log("Visiting page " + url);
						request(url, function(error, response, body) {
						 // Check status code (200 is HTTP OK)
						 console.log("Status code: " + response.statusCode);
						 
						 // Parse the document body
						 var $ = cheerio.load(body, { xmlMode: true });
						 var meanScore = 0;
						 var L = 0;
						 var userName = $('user_name').text();
						 var userId = $('user_id').text();
						 obj.userName= userName;
						 obj._id = userId;
						 obj['anime']=[];
						 $('anime').each(function(i, element){
						 	var id = $(this).children('series_animedb_id');
						 	var allEpisodes = $(this).children('series_episodes').text();
						 	var watchedEp = $(this).children('my_watched_episodes').text();
						 	if(allEpisodes === watchedEp){
							 	obj.anime.push({ uri: baseUrl + '/anime/' + id.text(),
							 		id: id.text(),
							 		seriesTitle: $(this).children('series_title').text(),
							 		myScore: Number($(this).children('my_score').text()),
							 		tags: $(this).children('my_tags').text()
							 	});}
						 	if ((Number($(this).children('my_score').text()))!==0){
								meanScore = Number($(this).children('my_score').text()) + meanScore;
								console.log(meanScore);
								L = L+1;
							}


						});
						resolve(obj);
									
						 
						});
	
});
};


/*q или bluebird*/

function GetStats(obj) {
		console.time('function')
		var meanScore = 0;
		var L = 0;
		var m = obj.anime;
		var le= m.length-1;
		
		var l = 0;
		obj.anime.forEach(function(value){
			console.log(value.id,le);
			//setTimeout(function(){
						request('http://myanimelist.net/includes/ajax.inc.php?t=64&id='+value.id, function(error, response, body){
							console.log(response.statusCode)
							if (!error && response.statusCode == 200) {

					            var $ = cheerio.load('<body>' + body + '</body>');
					            var $body = $('body');

					            $('body div').children().empty();
					            var description = $('body div').text().trim();
					            var keys = $('body span').text().split(':');
					            keys.splice(-1, 1);
					            $body.children().empty();
					            var values = $body.text().trim().split('\n');

					            
					            value.description = description;
					           

					            for(var j = 0; j<keys.length; j++) {
					                value[(keys[j].toLowerCase().trim())] = (values[j].trim());
			            		}
			            		
					        }


					        console.log(value);
						});
				//},100*k)

		});
	
		return obj;
		

	};	

			
		









	var factorial = function(n){
			if (n === 0) {
		    return 1;
		  }
		  
		  // This is it! Recursion!!
		  return n *100 + factorial(n - 1);
		}














