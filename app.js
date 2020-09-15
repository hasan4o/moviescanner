const express = require('express');
const indexRouter = require('./routes/index.js')
const morgan = require("morgan");
const hbs = require('hbs');
const path = require('path');

require('dotenv').config();

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

hbs.registerPartials(path.join(__dirname, 'views', 'partials'));


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(morgan("dev"));

app.use(indexRouter);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log('Сервер запущен. Порт:', port);
});
