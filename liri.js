require("dotenv").config()
var axios = require("axios")
var keys = require("./keys.js")
var Spotify = require("node-spotify-api")
var fs = require("fs")

var spotify = new Spotify(keys.spotify)
var chooseAPI = process.argv[2]
var returnResult = process.argv.slice(3).join(" ")

var first = fs.readFileSync("random.txt", "utf8")
var thisThing = first.split(",").join(" ").split('"')

if(!chooseAPI) {

    chooseApi = thisThing[0]
    returnResult = thisThing[1]
    var theSong = returnResult
    spotify.search({ type: "track", query: theSong }, function (err, data) {
        if (err) {
            return console.log("error has occured" + err)
        }
        var differentSongs = data.tracks.items
        differentSongs.forEach(function (eachSong) {
            console.log("song name: " + eachSong.name +
                "\nsong artist: " + eachSong.artists[0].name +
                "\nsong preview: " + eachSong.preview_url +
                "\nsong album: " + JSON.stringify(eachSong.album.name) + "\n")
        })
    })

} else if (chooseAPI === "concert-this") {
    if (!!returnResult) {
        console.log('You must enter an artist')
    } else {
        var artist = returnResult
        axios
            .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
            .then(function (response) {
                response.data.forEach(function (theBand) {

                    var theDate = theBand.datetime.split("T")[0].split("-")
                    var correctDate = theDate[1] + "/" + theDate[2] + "/" + theDate[0]

                    var theVenue = theBand.venue
                    console.log("Venue name: " + theVenue.name + "\nVenue Location: " +
                        theVenue.country + ", " + theVenue.region + ", " + theVenue.city + "\nVenue Date: " +
                        correctDate + "\n\n")
                })
            })
    }

} else if (chooseAPI === "movie-this") {

    var key = "trilogy"
    var movie = returnResult
    axios
        .get("http://www.omdbapi.com/?t=" + movie + "&apikey=" + key)
        .then(function (response) {
            var theMovie = response.data
            console.log("\nMovie title: " + theMovie.Title + "\nMovie release date: " + theMovie.Released +
                "\nMovie rating: " + theMovie.Rated + "\nRotten Tomatoes rating: " + theMovie.Ratings[2].Value +
                "\nCountry produced: " + theMovie.Country + "\nMovie plot: " + theMovie.Plot + "\nActors: " + theMovie.Actors)
        })

} else if (chooseAPI === "spotify-this-song") {
    var theSong = returnResult
    spotify.search({ type: "track", query: theSong }, function (err, data) {
        if (err) {
            return console.log("error has occured" + err)
        }
        var differentSongs = data.tracks.items
        var number = -1
        differentSongs.forEach(function (eachSong) {
            if(eachSong.album.name.toLowerCase() === differentSongs[0].name.toLowerCase() || 
            eachSong.album.name.split(" ")[0].toLowerCase() === "the") {

            } else {
                console.log("\nsong name: " + eachSong.name +
                "\nsong artist: " + eachSong.artists[0].name +
                "\nsong preview: " + eachSong.preview_url +
                "\nsong album: " + JSON.stringify(eachSong.album.name) + "\n")
            }
            number++
        })
    })

} 