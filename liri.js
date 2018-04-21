// This Reads and sets the variables with the dotenv package
require("dotenv").config();

// Access twitter API keys information 
var Twitter = require('twitter');

// Access spotify API keys information
var Spotify = require('node-spotify-api');

// Importing the request npm package.
var request = require("request");

// Importing the FS package for read/write.
var fs = require("fs");

// Importing the API keys
var keys = require('./keys');

// Initialize the spotify API client using our client id and secret
// var spotify = new Spotify(keys.spotify);

//Variables for user commands
var input = process.argv;
var userInput = process.argv[2];
var movieTitle = process.argv[3];
var songTitle = process.argv[3];

//Output function
getOutput();

// Function for determining which command is executed
function getOutput(){
	console.log('We are live on twitter');

	switch (userInput) {
	case "my-tweets":
	  retrieveTweets();
	  break;

	case "spotify-this-song":
	  spotifySong();
	  break;

	case "movie-this":
	  retrieveMovie();
	  break;

	case "do-what-it-says":
	  fetchRandom();
	  break;

	default:
	  console.log("LIRI is so smart!");
	}
  };

// Spotify function 
	function spotifySong() {
		var spotify = new Spotify(keys.spotify);
		 		const params = {
			 	type: 'track',
				 query: songTitle		 
		 };

		 	spotify.search(params, function(err, data) {
			if(err) {
			console.log(err);
			} else {
				
				 var songArtist =data.tracks.items[0].artists[0].name;
				 var songAlbum =data.tracks.items[0].album.name;
				 var songTitle =data.tracks.items[0].name;
			
				 console.log("artists(s): " + songArtist);
				 console.log("album: " + songAlbum);
				 console.log("title: " + songTitle);
			 }
			 });
		 }
  

// Twitter function  
function retrieveTweets() {
  var client = new Twitter(keys.twitter);
  var params = {
    screen_name: "Kassandrasty3"
  };
  client.get("statuses/user_timeline", params, function(error, tweets, response) {
    if (error) {
		return console.log("error: " + JSON.stringify(error));
	}
	if(tweets){
      for (var i = 0; i < tweets.length; i++) {
		console.log("==================");
		console.log(tweets[i].created_at);
        console.log(tweets[i].text);
      }
    }
  });
};

// Movie(OMDb) Function 
function retrieveMovie() {
  var movie = {
	  method: 'GET',
	  url: "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=full&tomatoes=tt3896198&apikey=8c9a1e05"
	//   "http://www.omdbapi.com/?t=" + movieName + "tt3896198&apikey=8c9a1e05";

  };

  request(movie, function(error, response, body) {
      body = JSON.parse(body);

      console.log("Title: " + body.Title);
      console.log("Year: " + body.Year);
      console.log("Rated: " + body.Rated);
      console.log("IMDB Rating: " + body.imdbRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      console.log("Rotten Tomatoes Rating: " + body.Ratings[1].Value);
    
  });
};

// Do what it says function 
function fetchRandom(){
	fs.readFile('random.txt','utf8',function(err,data){
			data = data.split(",");
			userInput = data[0];
			songTitle = data[1];
		
			if(userInput === "spotify-this-song" && songTitle === "undefined"){
					spotifySong("Hello")
			} else if (userInput === "spotify-this-song"){
					spotifySong(songTitle);
			}
	});
};


