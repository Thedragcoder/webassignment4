/********************************************************************************
* WEB322 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Utsav Gautam  Student ID: 157891219 Date: March 8 
*
* Published URL:
*
********************************************************************************/
const unCountryData = require("./modules/unCountries");
const express = require('express');
const app = express();
const path = require("path");

const HTTP_PORT = process.env.PORT || 8080;
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render("home");
});

app.get('/about', (req, res) => {
    res.render("about");
});

app.get("/un/countries", async (req, res) => {
    try {
        if (req.query.region) {
            let countries = await unCountryData.getCountriesByRegion(req.query.region);
            res.render("countries", { countries: countries });
        } else {
            let countries = await unCountryData.getAllCountries();
            res.render("countries", { countries: countries });
        }
    } catch (err) {
        res.status(404).json(err);
    }
});

app.get("/un/countries/:country_code", async (req, res) => {
    try {
        let country = await unCountryData.getCountryByCode(req.params.country_code);
        res.render("country", { country: country });
    } catch (err) {
        res.send(err);
    }
});

app.use((req, res, next) => {
    res.status(404).render("404", { message: "I'm sorry, we're unable to find what you're looking for" });
});

unCountryData.initialize().then(() => {
    app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});
