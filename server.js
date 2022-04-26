'use strict'

const express = require('express');
const movieData = require("./data.json");
const app = express();
const port = 3000;

app.get("/", handleHomePage);
app.get("/favorite", handleFavorite);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});


// Functions :

function handleHomePage(req , res) {
    // res.send("testing");
    let newMovie = new Movie(movieData.title, movieData.poster_path, movieData.overview);
    res.json(newMovie);
}

function handleFavorite(req , res) {
    res.send("Welcome to Favorite Page");
    res.send("Welcome to Favorite Page");
}

function Movie(title , path , overview) {
    this.title = title;
    this.path = path;
    this.overview = overview;

}