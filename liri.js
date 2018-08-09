//This loads the .env file without exposing the keys in the public domain
require("dotenv").config();

//Do I need to debug?
var debug = true;

//grab the keys-import modules??
var keys = require("./keys.js");
//var twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");//movie
var fs = require("fs");

//create a command line node to take in two commands
//the first will be the operator(ie. twitter, spotify, request)
var operator = process.argv[2];
//the second will be 'operand' will be either the movieName, songName, twitter
var operand = process.argv[3];


//Add the code required to import the keys.js file and store it in a variable
var spotify = new Spotify(keys.spotify);
//var client = new Twitter(keys.twitter);
//to get info from the command line


//Make it so liri.js can take in one of the following commands:
//Create a switch-case statement.  The switch-case statement will determine which function gets run.
//like the bank activity and call the different functions
console.log(operator);
switch (operator) {
    case `my-tweets`:
        displayTweets();
        break;

    case `spotify-this-song`:
        spotifySong();
        break;

    case `movie-this`:
        movieThis();
        break;

    case `do-what-it-says`:
        dowhatitsays();
        break;

    default:
        console.log("I don't understand your command!  Please try again.");
}
/*If the displayTweets function is called.....
node liri.js my tweets

function displayTweets() {
    //This will show your last 20 tweets and when they were created at in your terminal/bash window.
    var client = new Twitter(keys.twitter);
}
**************************************************************************************/
//If the spotifySong function is called  node liri.js movie-this'<movie name here>'
//declare default as global variable
var song = "the sign";

function spotifySong() {
//If no song is provided then your program will default to "The Sign" by Ace of Base.


    if(process.argv.length > 3 && process.argv[3]) {
        song = process.argv[3];
        if(debug) console.log("song", song);
    }


}
spotify.search({ type: 'track', query: song }, function(err, data){
    if(err){
        console.log("Error occured" + err);
        if(err.status==401){
            console.log("Spotify package is no longer authorized by Spotify Web API");
        }
        return;
    }
    else{
        if(debug) console.log("data", data);
//This will show(console.log) the following information about the song in your terminal/bash window
        console.log("Song Name", data.tracks.items[0]);//The song's name
        console.log("Song Name", data.tracks.items[0].preview_url);//A preview link of the song from Spotify
        console.log("Song Name", data.tracks.items[0].album.name);//The album that the song is from
    }
      
    });
  
    


//If the movieThis function is called  node liri.js movie-this'<movie name here>'
function movieThis() {
    //If there is no movie input it will default to Mr. Nobody
    var movie = "Mr. Nobody";
    //do I need toadd  movieName.trim().replace(" ", "+"); trim for spaces around movie??????
    if (process.argv.length > 3 && process.argv[3]) {
        movie = process.argv[3];
        if (debug) console.log("movie", movie);
    }


    //You'll use the request package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use trilogy.
    var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    if (debug) console.log(queryURL);
    // If the request is successful (i.e. if the response status code is 200)
    request(queryURL, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            var bodyObj = JSON.parse(body)
    //This will output the following information to your terminal/bash window:

            console.log("Title:", bodyObj.Title);//Title of the movie.
            console.log("Released:", bodyObj.Released);//Year the movie came out.
            console.log("IMDB rating:", bodyObj.imdbRating);//IMDB Rating of the movie.
            console.log("Country:", bodyObj.Country);//Country where the movie was produced.
            console.log("Language:", bodyObj.Language);//Language of the movie.
            console.log("Plot:", bodyObj.Plot);//Plot of the movie.
            console.log("Actors:", bodyObj.Actors);//Actors in the movie.
        }
    });
    
    // Then run a request to the OMDB API with the movie specified????is this the same as line 91????
    //request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function (error, response) {




    // Parse the body of the site and recover just the imdbRating
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
    //console.log("The movie's rating is: " + JSON.parse(response.body).imdbRating);

    //end of request function
}
/*function dowhatitsays() {

    Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

    It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
    Feel free to change the text in that document to test out the feature for other commands.
    */



