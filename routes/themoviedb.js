const express = require('express');
const fetch = require('node-fetch');
require('url').URL

const router = express.Router();

// ПОСТЕРЫ ПО ПОИСКУ
router.post('/poster', async (req, res) => {
  const { value, path } = req.body;
  // console.log(req.body);

  const url = new URL(`https://api.themoviedb.org/3${path}?api_key=${process.env.API_KEY}&query=${value}&language=ru`);
  const themoviedb = await fetch(url);
  const datafromDb = await themoviedb.json();
  const movies = datafromDb.results;
  //console.log(movies);

  return res.json(movies)
});

// ТРЕЙЛЕРЫ
router.post('/trailer', async (req, res) => {
  const { path, movieId } = req.body;
  const movieInfoRequest = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY}&language=ru`);
  const { title, overview, vote_average, id, release_date } = await movieInfoRequest.json();

  const themoviedb = await fetch(`https://api.themoviedb.org/3${path}?api_key=${process.env.API_KEY}&language=ru`);
  const datafromDb = await themoviedb.json();
  let videos = datafromDb.results;

  if (!videos.length) { // если не нашел трейлер на русском, ищем на английском
    const themoviedbEN = await fetch(`https://api.themoviedb.org/3${path}?api_key=${process.env.API_KEY}`);
    const datafromDbEN = await themoviedbEN.json();
    videos = datafromDbEN.results;
  }

  return res.json({ videos, title, overview, vote_average, id, release_date })
});

router.post('/films', async (req, res) => {
  const { type } = req.body;
  if (type === '/movie/upcoming') {
    const themoviedb = await fetch(`https://api.themoviedb.org/3${type}?api_key=${process.env.API_KEY}&language=ru`);
    const datafromDb = await themoviedb.json();
    const movies = datafromDb.results;

    return res.json(movies)
  }
  const themoviedb = await fetch(`https://api.themoviedb.org/3${type}?api_key=${process.env.API_KEY}&language=ru`);
  const datafromDb = await themoviedb.json();
  const movies = datafromDb.results;

  return res.json(movies)
});



module.exports = router;
