const searchButton = document.forms.form_search.butt;
const searchInput = document.forms.form_search.inp;

const moviesSearchable = document.querySelector('#movies-searchable');

// const API_KEY = '202dcfe5c06c5d78584f15e418e19bbc';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// генератор пути для запроса
// function generateUrl(path) {
//   const url = `https://api.themoviedb.org/3${path}?api_key=202dcfe5c06c5d78584f15e418e19bbc`;
//   return url;
// }



// кнопка ПОИСК
searchButton.addEventListener('click', buttClickCB);

async function buttClickCB(event) {
  event.preventDefault();
  const { value } = searchInput;
  console.log(value);
  const path = '/search/movie';
  // const newUrl = generateUrl(path) + '&query=' + value

  try {
    moviesSearchable.innerHTML = ''; // убираем старые поиски

    const body = {
      value,
      path,
    };

    const response = await fetch('/themoviedb/poster', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const movies = await response.json();
    //const movies = data.results;
    console.log(movies);


    const movieBlock = createMovieContainer(movies);
    moviesSearchable.appendChild(movieBlock);

    searchInput.value = ''; // очищаем поле input для нового поиска
  } catch (err) {
    console.log('Error:', err);
  }
}


function createMovieContainer(movies) {
  const movieElement = document.createElement('div');
  movieElement.setAttribute('class', 'movie');

  // const header = document.createElement('h2');
  // header.innerHTML = title;

  const content = document.createElement('div');
  content.classList = 'content'; // пока что невидимый блок div ("style.css" .content)

  const contentClose = `<p id="content-close">закрыть</p>`;
  content.innerHTML = contentClose;

  const section = movieSection(movies);

  // movieElement.appendChild(header);
  movieElement.appendChild(section);
  movieElement.appendChild(content);

  return movieElement;
}

function movieSection(movies) {
  const section = document.createElement('section');
  section.classList = 'section';

  movies.map((movie) => {
    if (movie.poster_path) {
      const img = document.createElement('img');
      img.src = IMAGE_URL + movie.poster_path;
      img.setAttribute('data-movie-id', movie.id);

      section.appendChild(img);
    }
  });

  return section;
}


//
//
// ВЫВОД ТРЕЙЛЕРОВ
//
//
function createIframe(video) {
  const iframe = document.createElement('iframe');
  iframe.src = `https://youtube.com/embed/${video.key}`;
  iframe.width = 360;
  iframe.height = 315;
  iframe.allowFullscreen = true;

  return iframe;
}



function createVideoTemplate(videos, content, title, overview, vote_average) {
  content.innerHTML = '<p id="content-close">закрыть</p>'; // очищаем поле, оставляя только кнопку ЗАКРЫТЬ

  const filmInfo = document.createElement('div');
  filmInfo.id = 'filminfo';

  const filmTitle = document.createElement('h3');
  filmTitle.innerHTML = title;
  const filmOverview = document.createElement('p');
  filmOverview.innerHTML = overview;
  const filmRate = document.createElement('p');
  filmRate.innerHTML = 'Рейтинг сайта themoviedb.org: ' + vote_average;

  filmInfo.appendChild(filmTitle);
  filmInfo.appendChild(filmOverview);
  filmInfo.appendChild(filmRate);
  content.appendChild(filmInfo);

  const length = videos.length > 4 ? 4 : videos.length;
  const iframeContainer = document.createElement('div');
  iframeContainer.id = 'trailers'

  for (let i = 0; i < length; i++) {
    const video = videos[i]; // 1video
    const iframe = createIframe(video);
    iframeContainer.appendChild(iframe);
    content.appendChild(iframeContainer);
  }
}

// Event delegation
document.addEventListener('click', async (event) => {
  const target = event.target;

  if (target.tagName.toLowerCase() === 'img') {
    const movieId = target.dataset.movieId;
    console.log(movieId);
    const section = target.parentElement; // section
    const content = section.nextElementSibling; // content
    content.classList.add('content-display');

    // загружаем видео при нажатии на постер
    const path = `/movie/${movieId}/videos`;
    //const url = generateUrl(path);

    /////////
    const body = {
      path,
      movieId,
    };

    try {
      const response = await fetch('/themoviedb/trailer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const { videos, title, overview, vote_average } = await response.json();
      // console.log(videos);
      /////////

      createVideoTemplate(videos, content, title, overview, vote_average)

    } catch (err) {
      console.log('Error:', err);
    }
  }

  if (target.id === 'content-close') {
    const content = target.parentElement;
    content.classList.remove('content-display');
  }
});
