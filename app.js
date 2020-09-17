const express = require('express');
const indexRouter = require('./routes/index.js');
const theMovieDbRouter = require('./routes/themoviedb')

const morgan = require("morgan");
const hbs = require('hbs');
const path = require('path');
const fetch = require('node-fetch');


require('dotenv').config();

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

hbs.registerPartials(path.join(__dirname, 'views', 'partials'));


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use('/', indexRouter);
app.use('/themoviedb', theMovieDbRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Сервер запущен. Порт:', port);
});
