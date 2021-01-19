// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();
/* Dependencies */
const bodyParser = require("body-parser");
/* Middleware*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

/* Initializing the main project folder */
app.use(express.static("website"));

const port = 3000;

app.get("/all", function (req, res) {
    console.log("get all ");
    console.log(projectData);
    res.send(projectData);
});

app.post("/addWeather", addWeather);

function addWeather(req, res) {
    projectData = {
        cityName: req.body.cityName,
        temp: req.body.temp,
        weatherDescription: req.body.weatherDescription,
        feelings: req.body.feelings,
        date: req.body.date,
        icon: req.body.icon,
        iconDesc: req.body.iconDesc,
    };
    console.log("addWeather", projectData);

    res.send(projectData);
}

// TODO-Spin up the server
const server = app.listen(port, listening);
function listening() {
    console.log("ccc");
    console.log(`running on localhost: ${port}`);
}
