const API_URL = "https://mcuapi.herokuapp.com/api/v1/movies?page=1&limit=100";
const SECOND_API_URL = "https://mcuapi.herokuapp.com/api/v1/tvshows?page=1&limit=100"

getFilms(API_URL);
getFilms(SECOND_API_URL);

async function getFilms(url){
    const response = await fetch(url, {
        headers:{
            "Content-Type":"application/json"
        }
    });
    const response_data = await response.json();
    console.log(response_data);
    showFilms(response_data);
}

function showFilms(data) {
    const filmsEl = document.querySelector(".films");
    // Don't clear the filmsEl here

    data.data.forEach((film) => {
        console.log(film)
        const filmEl = document.createElement("div");
        filmEl.classList.add("film");
        filmEl.innerHTML = `
    <div class="film__cover-inner">
    <img
      src="${film.cover_url}"
      class="film__cover"
      alt="${film.title}"
    />
    <div class="film__cover-darkened"></div>
  </div>
  <div class="film__info">
    <div class="film__title">${film.title}</div>
    <div class="film__phase">${"Phase: "+film.phase}</div>
  </div>
    `;
        filmsEl.appendChild(filmEl);
    });
}