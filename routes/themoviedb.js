const express = require('express');
const fetch = require('node-fetch');
require('url').URL

const router = express.Router();

// ПОСТЕРЫ ПО ПОИСКУ
router.post('/poster', async (req, res) => {
  const { value, path } = req.body;
  console.log(req.body);

  const url = new URL(`https://api.themoviedb.org/3${path}?api_key=${process.env.API_KEY}&query=${value}&language=ru`);
  const themoviedb = await fetch(url);
  const datafromDb = await themoviedb.json();
  const movies = datafromDb.results;

  return res.json(movies)
});

// ТРЕЙЛЕРЫ
router.post('/trailer', async (req, res) => {
  const { path, movieId } = req.body;
  console.log(req.body);
  // https://api.themoviedb.org/3/movie/{movie_id}?api_key=<<api_key>>&language=en-US
  const movieInfoRequest = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY}&language=ru`);
  const { title, overview, vote_average } = await movieInfoRequest.json();
  console.log(title, overview, vote_average);
  //console.log(movieInfo);

  const themoviedb = await fetch(`https://api.themoviedb.org/3${path}?api_key=${process.env.API_KEY}&language=ru`);
  const datafromDb = await themoviedb.json();
  const videos = datafromDb.results;
  //  console.log(videos);

  return res.json({ videos, title, overview, vote_average })
});

// fetch('https://api.themoviedb.org/3${path}?api_key=202dcfe5c06c5d78584f15e418e19bbc')
//   .then(res => res.json())
//   .then(json => console.log(json));


module.exports = router;
