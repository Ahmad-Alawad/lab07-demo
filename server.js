'use strict';
// Express
const express = require('express');

// initialize a server
const server = express();


// Cross Origin Resource Sharing
const cors = require('cors');
server.use(cors()); // give access

// get all environment variable you need
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// Make the app listening
server.listen(PORT, () => console.log('Listening at port 3000'));



server.get('/', (request, response) => {
    response.status(200).send('App is working CLAAAAASS');
});

/* {
    "search_query": "lynwood",
    "formatted_query": "lynood,... ,WA, USA",
    "latitude": "47.606210",
    "longitude": "-122.332071"
  }
*/

function Location(city, locationData){
    this.formatted_query = locationData[0].display_name;
    this.latitude = locationData[0].lat;
    this.longitude = locationData[0].lon;
    this.search_query = city;
}



server.get('/location', locationHandler);

function locationHandler(request, response){
    // Read the city from the user (request)
    // find the city in geo.json
    let city = request.query['city'];
    const locationData = require('./data/geo.json');
    let location = new Location(city, locationData);

    response.status(200).send(location);
}

/*
[
  {
    "forecast": "Partly cloudy until afternoon.",
    "time": "Mon Jan 01 2001"
  },
  {
    "forecast": "Mostly cloudy in the morning.",
    "time": "Tue Jan 02 2001"
  },
  ...
]
*/
server.get('/weather', weatherHandler);

function weatherHandler(request, response){

    const weatherData = require('./data/darksky.json');
    let weather = weatherData.daily.data.map((day) => {
        return new Weather(day);}
    );

    response.status(200).send(weather);
}


function Weather(day){
    this.time = new Date(day.time);
    this.forecast = day.summary;
}


server.use('*', (request, response) => {
    response.status(404).send('Sorry, not found');
});

server.use((error, request, response) => {
    response.status(500).send(error);
});


