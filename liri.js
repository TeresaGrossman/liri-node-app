//This loads the .env file without exposing the keys in the public domain
require("dotenv").config();

//Do I need to debug?
var debug = true;

//grab the keys-import modules??
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
//var moment = require("moment");
var fs = require("fs");

//create a command line node to take in two commands-NO NEED TO CREATE A COMM LINE JUST USE argv's
//the first will be the operator(ie. twitter, spotify, request)
//var operator = process.argv[2];
//the second will be 'operand' will be either the movieName, songName, twitter
//var operand = process.argv[3];


//Add the code required to import the keys.js file and store it in a variable
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
//to get info from the command line


//Make it so liri.js can take in one of the following commands:
//Create a switch-case statement.  The switch-case statement will determine which function gets run.
//like the bank activity and call the different functions
console.log(process.argv[2]);
switch (process.argv[2]) {
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
        doIt();
        break;

    default:
        console.log("I don't understand your command!  Please try again.");
}
//If the displayTweets function is called  node liri.js my-tweets '<tweets here 20>'

function displayTweets() {
    //This will show your last 20 tweets and when they were created at in your terminal/bash window.
    var client = new Twitter(keys.twitterKeys);

    var params = { user_id: 'Teresa08758622', count: '20' };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log("Tweet #" + (i + 1) + "--" + tweets[i].created_at + "--" + tweets[i].text);
            }
        }
        else {
            if (debug) console.log("error", error);
            //if debug console.log("response", response);
        }
    });
}
//If the spotifySong function is called  node liri.js movie-this'<movie name here>'
//declare default as global variable
var song = "the sign";

function spotifySong() {
    //If no song is provided then your program will default to "The Sign" by Ace of Base.


    if (process.argv.length > 3 && process.argv[3]) {
        song = process.argv[3];
        if (debug) console.log("song", song);
    }

    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            console.log("Error occured" + err);
            if (err.status == 401) {
                console.log("Spotify package is no longer authorized by Spotify Web API");
            }
            return;
        }
        else {
            if (debug) console.log("data", data);
            //This will show(console.log) the following information about the song in your terminal/bash window
            console.log("Song Name", data.tracks.items[0]);//The song's name
            console.log("Song Name", data.tracks.items[0].preview_url);//A preview link of the song from Spotify
            console.log("Song Name", data.tracks.items[0].album.name);//The album that the song is from
        }
    
    });


}





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


    //end of request function
}
//node liri.js do-what-it-says
function doIt() {
    //Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
    //It should run spotify-this-song for "The Sign," as follows the text in random.txt.
    //Feel free to change the text in that document to test out the feature for other commands.
    //read bank file
    fs.readFile("random.txt", "utf8", function (error, data) {
        //call back function once file is read

        //if error, console log it and return
        if (error) return console.log(error);

        //otherwise process instructions (#'s) in file
        else {

            //console.log("DEBUG", data);
            //split string of numbers by ", " to remove extra space and add to array
            var instructions = data.split(",");
            if (debug) console.log("instructions", instructions);

            if (instructions.length > 1) process.argv[3] = instructions[1];

            switch (instructions[0]) {
                case 'my-tweets':
                    displayTweets();
                    break;
                case 'spotify-this-song':
                    spotifySong();
                    break;
                case 'movie-this':
                    movieDetails();
                    break;
                default:
                    console.log("I don't understand your command!  Please try again.");
            }

        }
    });
}