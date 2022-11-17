'use strict';

const express = require('express');

let data = require('./data/weather.json');

require('dotenv').config();

const axios = require('axios');

const cors = require('cors');

const { response } = require('express');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/weather', (request, response, next) => {
    try {
        let cityInput = request.query;
        let selectedCity = data.find(city => city.city_name.toLowerCase() === cityInput.city.toLowerCase())
        console.log(selectedCity, 'this is selected city');
        let cityWeather = selectedCity.data.map(day => new Forecast(day));
        console.log(cityWeather, 'this is city weather');
        response.status(200).send(cityWeather);

    }
    catch (error) {
        next(error);
    }
});
app.get('*', (request, response) => {
    response.send('You Found the Landing Page');
});



app.use((error, request, response, next) => {
    response.status(500).send(error.message);
});

class Forecast {
    constructor(myCity) {
        this.date = myCity.valid_date;
        this.description = myCity.weather.description;
    }
}



app.listen(PORT, () => console.log(`Listening On Port ${PORT}`));