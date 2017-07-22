var request = require("request");
var inquirer = require("inquirer");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var keys = require("./keys.js");

var command = process.argv[2];

//Based on command function is selected
if (command === 'my-tweets'){
    console.log("Run my tweets");
    getTweets();
    }
else if (command === 'spotify-this-song'){
    console.log("Run Spotify");
    getSpotify();
    }
else if (command === 'movie-this'){
    console.log("Run OMDB");
    getOMDB();
    logCommand(command);
    }
else if (command === 'do-what-it-says'){
    console.log("Run do what it says");
    doWhatItSays();
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
    if (!error) {
        for (var i = 0; i < 20; i++) {
            console.log((i+1) + ". " + tweets[i].text);    
        }
    }
    })
}

//spotify-this-song
function getSpotify(){
    var songName = process.argv[3];

    if (songName === null) {
        songName = "The Sign";
    }

 
var spotify = new Spotify({
  id: '15ff7a7cb240490794fa1a00cf847879',
  secret: '018c8d910c6648a99e53788acb9e1612'
});
 
spotify
  .search({ type: 'track', query: songName })
  .then(function(response) {
    console.log("--------------------------");
    console.log("Artist Name: " + response.tracks.items[0].artists[0].name);
    console.log("Song Name: " + response.tracks.items[0].name);
    console.log("Album Name: " + response.tracks.items[0].album.name);
    console.log("Preview Link: " + response.tracks.items[0].preview_url);
    console.log("--------------------------");

  })
  .catch(function(err) {
    console.log(err);
  });
}
//movie-this
function getOMDB(){
    var movieName = process.argv[3];
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

   // if (movieName === null) {
     //   movieName = "Mr. Nobody";
    //}

    request(queryUrl, function(error, response, body){
        if (!error && response.statusCode === 200) {
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

    console.log(commandInternal);
    console.log(songName);
    
    /*for (var i = 0; i < dataArr.length; i++) {
        //var string = dataArr[i];
        console.log(dataArr[i].trim());        
        } */
    
    })
}

function logCommand(command){
    fs.appendFile("log.txt", "utf8", command);
}