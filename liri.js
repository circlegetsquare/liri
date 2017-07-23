var request = require("request");
var inquirer = require("inquirer");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var keys = require("./keys.js");

var command = process.argv[2];
var txtLogCommand = "\rCommand: ";

for (var i = 2; i < process.argv.length; i++) {
    txtLogCommand += process.argv[i] + " "; 
}

//Based on command function is selected
if (command === 'my-tweets'){
    getTweets();
    logCommand(txtLogCommand);
    }
else if (command === 'spotify-this-song'){
    getSpotify();
    logCommand(txtLogCommand);
    }
else if (command === 'movie-this'){
    getOMDB();
    logCommand(txtLogCommand);
    }
else if (command === 'do-what-it-says'){
    doWhatItSays();
    logCommand(txtLogCommand);
    }

else {console.log("I'm sorry. I don't recognize that command. Please try again.");}

//my-tweets
function getTweets(){
    var twitterKeys = keys.twitterKeys;

    var client = new Twitter({
    consumer_key: twitterKeys.consumer_key,
    consumer_secret: twitterKeys.consumer_secret,
    access_token_key: twitterKeys.access_token_key,
    access_token_secret: twitterKeys.access_token_secret
    })

    var params = {screen_name: 'cgs_robot'};

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    console.log("--------------------------");
    console.log("+++++++TWITTER FEED+++++++");
    console.log("--------------------------");
    if (!error) {
        for (var i = 0; i < 20; i++) {
            console.log((i+1) + ". " + tweets[i].text + " (Posted: " + tweets[i].created_at + ")");    
        }
    }
    console.log("--------------------------");
    })
}

//spotify-this-song
function getSpotify(songName){

    if (process.argv[3] !=null){
        songName = process.argv[3];
    }
    else if (songName === undefined) {
        songName = "ace sign";
    }

var spotifyKeys = keys.spotifyKeys;    
 
var spotify = new Spotify({
  id: spotifyKeys.id,
  secret: spotifyKeys.secret,
});
 
spotify
  .search({ type: 'track', query: songName, limit: 3})
  .then(function(response) {
    console.log("--------------------------");
    console.log("++SPOTIFY SEARCH RESULTS++");
    for (var i = 0; i < (response.tracks.items.length); i++) {
        console.log("--------------------------");
        for (var j = 0; j < response.tracks.items[i].artists.length; j++) {
            if (j === 0){
                var artistList = response.tracks.items[i].artists[j].name;
            }
            else {artistList += ", " + response.tracks.items[i].artists[j].name;}    
        }
        console.log("Artist(s): " + artistList);
        console.log("Song Name: " + response.tracks.items[i].name);
        console.log("Album Name: " + response.tracks.items[i].album.name);
        console.log("Preview Link: " + response.tracks.items[i].preview_url);
    }
  })
  .catch(function(err) {
    console.log(err);
  });
}
//movie-this
function getOMDB(){
    if (process.argv[3] === undefined) {
        movieName = "Mr. Nobody";
        }
    else {var movieName = process.argv[3];}

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

    if (movieName === "") {
    movieName = "Mr. Nobody";
    } 

    request(queryUrl, function(error, response, body){
        if (!error && response.statusCode === 200) {
        console.log("--------------------------");
        console.log("+++MOVIE SEARCH RESULTS+++");
        console.log("--------------------------");
        console.log("Title: " + JSON.parse(body).Title);
        console.log("Year: " + JSON.parse(body).Year);
        console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[2].Value);
        console.log("Country: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
        console.log("--------------------------");
        }
    })
}

// do-what-it-says

function doWhatItSays(){

    fs.readFile("random.txt", "utf8", function(error, data){
   // console.log(data);
    var dataArr = data.split(",");
    var commandInternal = dataArr[0];
    var songName = dataArr[1];

    getSpotify(songName);
    
    })
}

function logCommand(txtLogCommand){
    fs.appendFile("log.txt", txtLogCommand, function(err) {
        if (err) {
            console.log(err);
        };
    });
};