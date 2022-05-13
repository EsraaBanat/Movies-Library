'use strict'

require('dotenv').config()
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const axios = require('axios').default;
const apiKey = process.env.API_KEY ;
const userName = process.env.USER_NAME ;
const password = process.env.PASSWORD ;
const movieData = require("./data.json");
const app = express();
const port = process.env.PORT ;
// const PORT = ;
const url = `postgres://${userName}:${password}@localhost:5432/movies`;
const { Client } = require('pg');
// const client = new Cli

const client = new Client({
   connectionString: process.env.DATABASE_URL,
   ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", handleHomePage);
app.get("/favorite", handleFavorite);
app.get("/error", (req, res) => res.send(error()));
app.get('/trending', handleTrending);
app.get('/search', handleSearch);
app.get('/toprated', handleTop);
app.get('/upcoming', handleUpcoming);
app.post('/addMovie', handleAdd);
app.get('/getMovie', handleGet);
app.put('/UPDATE/:movieId', handleUpdate);
app.delete('/DELETE/:movieId', handleDelete);
app.get('/getMovie/:movieId', handleSelect);


app.use(function (err, req, res, text){
    console.error(err.stack);
    res.type(`text/plain`)
    res.status(500)
    res.send(`Sorry, something went wrong`)
})

client.connect().then(() => {

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
  });

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
function handleAdd(req, res) {

  // console.log(req.body);
  // res.send('Adding to DB in progress');
  const { id,title,release_date,poster_path,overview,personal_comments } = req.body;
  let sql = 'INSERT INTO movie(id,title,release_date,poster_path,overview,personal_comments ) VALUES($1,$2,$3,$4,$5,$6) RETURNING *;';
  let values = [id,title,release_date,poster_path,overview,personal_comments];
  client.query(sql, values).then((result) => {
    console.log(result.rows);
    return res.status(201).json(result.rows[0]);
  }).catch()

}
 
function handleGet(req, res) {
    let sql = 'SELECT * from movie;'
    client.query(sql).then((result) => {
        console.log(result);
        res.json(result.rows);
    }).catch();
}

function handleUpdate(req, res) {

   const { movieId } = req.params;
   console.log(movieId);
   const { id , title , release_date , poster_path , overview , personal_comments } = req.body;

    let sql = `UPDATE movie SET id = $1, title = $2, release_date = $3, poster_path = $4 ,overview = $5 , personal_comments=$6 WHERE id = $1 RETURNING *;`
    let values = [id , title , release_date , poster_path , overview , personal_comments ];

    client.query(sql, values).then(result => {
        console.log(result.rows);
        // res.send("Data Updated");
        res.json(result.rows[0]);
    }

    ).catch(error => {
        console.log(error);
    })
  
}
function handleDelete(req, res) {
    const { movieId } = req.params;
    // console.log(movieId);
    let sql = 'DELETE FROM movie WHERE id=$1;'
    let value = [movieId];
    client.query(sql, value).then(result => {
        // console.log(result.rows);
        res.send("Data had deleted");
    }
    ).catch(error => {
        console.log(error);
    })
}
function handleSelect(req, res) {
  const { movieId } = req.params;
  // console.log( typeof movieId);
  let sql = `SELECT * FROM movie WHERE id = '${movieId}'`;
  client.query(sql).then((result) => {
    res.json(result.rows);
  }).catch(error => {
    console.log(error);
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