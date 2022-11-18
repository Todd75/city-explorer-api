'use strict';

const express = require('express');

require('dotenv').config();

const axios = require('axios');

const cors = require('cors');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/weather', async (req, res, next) => {
    try {
        let searchedLat = req.query.queriedLat;
        let searchedLon = req.query.queriedLon;
        let weatherResults = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${searchedLat}&lon=${searchedLon}&key=${process.env.WEATHER_API_KEY}&units=I&days=3`);
        console.log(weatherResults);
        let forecast = weatherResults.data.data.map(obj => new Forecast(obj));

        res.status(200).send(forecast);

    }
    catch (error) {
        next(error);
    }
});
app.get('/movie', async (request, response, next) => {
    console.log('hi');
    try {
        let searchMovie = request.query.search;
        let movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchMovie}`;
        let movieResults = await axios.get(movieURL);
        let topMovies = movieResults.data.results.map(movie => new Movie(movie));

        response.send(topMovies);
        console.log(movieResults);
    } catch (error) {
        next(error);
    }
});

app.get('*', (req, res) => {
    res.send('You Found the Landing Page');
});



app.use((error, req, res, next) => {
    res.status(500).send(error.message);
});

class Forecast {
    constructor(myCity) {
        this.date = myCity.valid_date;
        this.description = myCity.weather.description;
        this.low = myCity.low_temp;
        this.high = myCity.max_temp;
        this.fullDescription = `Low of ${this.low}, high of ${this.high} with ${this.description}.`;
    }
}
class Movie {
    constructor(movieObj) {
        this.title = movieObj.title;
        this.avgRating = movieObj.vote_average;
        this.overview = movieObj.overview;
        this.total_reviews = movieObj.vote_count;
        this.imgPath = movieObj.poster_path ? `https://image.tmdb.org/t/p/original/${movieObj.poster_path}` : ' ';
        this.releaseDate = movieObj.release_date;
    }
}

app.listen(PORT, () => console.log(`Listening On Port ${PORT}`));