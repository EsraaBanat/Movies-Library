'use strict'

require('dotenv').config()
const express = require('express');
const cors = require("cors");
const axios = require('axios').default;
const apiKey = process.env.API_KEY ;
const movieData = require("./data.json");
const app = express();
const PORT = 3000;

app.use(cors());
app.get("/", handleHomePage);
app.get("/favorite", handleFavorite);
app.get("/error", (req, res) => res.send(error()));
app.get('/trending', handleTrending);
app.get('/search', handleSearch);
app.get('/toprated', handleTop);
app.get('/upcoming', handleUpcoming);


app.use(function (err, req, res, text){
    console.error(err.stack);
    res.type(`text/plain`)
    res.status(500)
    res.send(`Sorry, something went wrong`)
})
app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`)
});


// Functions :

function handleHomePage(req , res) {

    let newMovie = new Movie(movieData.id , movieData.title , movieData.release_date , movieData.poster_path ,movieData.overview);
    res.json(newMovie);
}

function handleFavorite(req , res) {
    res.send("Welcome to Favorite Page");
}


function handleTrending(req ,res) {
    
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`;
    axios.get(url)
    .then(result => {
        // console.log(result);
        // res.send(result.data);
        let trendMovies = result.data.results.map(element => {
            return new Movie (element.id , element.title , element.release_date , element.poster_path ,element.overview);
        })
        res.json(trendMovies);
    })
        .catch((error) => {
            console.log(error);
            res.send("Inside catch");
        })

 }


function handleSearch(req, res) {
  let movieName = req.query.movieName;
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieName}&page=2`;
  axios.get(url)
    .then(result => {
      res.json(result.data.results)
    })
    .catch((error) => {
      console.log(error);
      res.send("Searching for data")
    })
}

function handleTop(req ,res) {

    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=6c3a96869123c88334364a147a700c81&language=en-US&page=1`;
    axios.get(url)
        .then(result => {
            // console.log(result);
            // res.send(result.data);
              let topMovies = result.data.results.map(element => {
                return new Movie (element.id , element.title , element.release_date , element.poster_path ,element.overview);
              })
              res.json(topMovies);
            })
        .catch((error) => {
            console.log(error);
            res.send("Inside catch");
        })

 }
function handleUpcoming(req ,res) {

    const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;
    axios.get(url)
        .then(result => {
            // console.log(result);
            // res.send(result.data);
              let upCome = result.data.results.map(element => {
                return new Movie (element.id , element.title , element.release_date , element.poster_path ,element.overview);
              })
              res.json(upCome);
            })
        .catch((error) => {
            console.log(error);
            res.send("Inside catch");
        })

 }

 function Movie(id ,title , date , path , overview) {
     this.id = id;
     this.title = title;
     this.release_date = date;
     this.poster_path = path;
     this.overview = overview;
     
 }

app.use((req, res, next) => {
  res.status(404).send("Page NOT Found")
})