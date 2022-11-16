'use strict';

const express = require('express');

let data = require('./data/weather.json');

require('dotenv').config();

const cors = require('cors');

const { response } = require('express');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/weather', (request, response, next) => {
    try {
        let cityInput = request.query.city;
        let selectedCity = data.find(cityData => cityData.city_name.toLowerCase === cityInput.toLowerCase);
        let cityWeather = selectedCity.data.map(day => new Forecast(day));
        console.log('here', cityWeather);
        response.send(cityWeather);
    }
    catch (error) {
        next(error);
    }
});
app.get('*', (request, response) => {
    response.send('You found the Landing Page');
});

console.log(data);

app.use((error, request, response, next) => {
    response.status(500).send(error.message);
});

class Forecast {
    constructor(myCity) {
        //console.log('hi', myCity);
        //   this.date = myCity.date;
        this.date = myCity.valid_date;
        this.description = myCity.weather.description;
    }
}



app.listen(PORT, () => console.log(`Listening On Port ${PORT}`));