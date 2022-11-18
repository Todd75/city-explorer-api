'use strict';

const express = require('express');
// const getWeather = require('./weather.js');
let data = require('./data/weather.json');

require('dotenv').config();

const axios = require('axios');

const cors = require('cors');

const { response } = require('express');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/weather', async (req, res, next) => {
    try {
        let searchedLat = req.query.queriedLat;
        let searchedLon = req.query.queriedLon;
        // let cityInput = request.query;
        // let selectedCity = data.find(city => city.city_name.toLowerCase() === cityInput.city.toLowerCase())
        let weatherResults = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${searchedLat}&lon=${searchedLon}&key=${process.env.WEATHER_API_KEY}&units=I&days=3`);
        console.log(weatherResults);
        let forecast = weatherResults.data.data.map( obj => new Forecast(obj));
        
        res.status(200).send(forecast);

    }
    catch (error) {
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



app.listen(PORT, () => console.log(`Listening On Port ${PORT}`));