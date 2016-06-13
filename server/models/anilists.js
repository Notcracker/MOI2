var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var animeSchema = new Schema({
	id: {
		type: String,
		required: true
	}, myFinishDate: {
		type: String,
		required: [true,"myFinishDate"]
	}, myStartDate: {
		type: String,
		required: [true,"myStartDate"]
	}, url: {
		type: String,
		required: [true,"url"]
	},myStatus:{
		type: String,
		required: [true,"myStatus"]
	}, myScore:{
		type: Number,
		min: 1,
        max: 10,
		required: [true,"myScore"]
	}, seriesTitle:{
		type: String,
		required: [true,"seriesTitle"]
	}, tags:{
		type: String,
		required: [true,"tags"]
	}, watchedEp:{
		type: Number,
		required: [true,"watchedEp"]
	}, allEp:{
		type: Number,
		required: [true,"allEp"]
	},description: {
		type: String,
		required: [true,"description"]
	},
	genres:{
		type: String,
		required: true
	},status: {
		type: String,
		required: [true,"status"]
	},type:{
		type: String,
		required: [true,"type"]
	},episodes: {
		type: String,
		required: [true,"episodes"]
	},score:{
		type: String,
		required: [true,"score"]
	},ranked:{
		type: String,
		required: [true,"ranked"]
	},popularity: {
		type: String,
		required: [true,"popularity"]
	},members: {
		type: String,
		required: [true,"members"]
	}
});


var animelistSchema = new Schema({
	_id : {type: String, required: true},
	anime: [],
	types: {
		type: Object,
		required: true
	},
	watchedEpsAll: {
		type: Number,
		required: true
	},
	meanScore: {
		type: Number,
		required: [true,"meanScore"]
	},
	uName: {
		type: String,
		required: [true,"uName"]
	},
	uWatching: {
		type: Number,
		required: [true,"uWatching"]
	},
	uCompleted: {
		type: Number,
		required: [true,"uCompleted"]
	},
	uOnhold: {
		type: Number,
		required: [true,"uOnhold"]
	},
	uDropped: {
		type: Number,
		required: [true,"uDropped"]
	},
	uPTW: {
		type: Number,
		required: [true,"uPTW"]
	},
	uDSW: {
		type: Number,
		required: [true,"uDSW"]
	}

});

//creating model

var Anilist = mongoose.model('Anilist',animelistSchema);
module.exports = Anilist;