const API_URL = "https://mcuapi.herokuapp.com/api/v1/movies?page=1&limit=100";
const SECOND_API_URL = "https://mcuapi.herokuapp.com/api/v1/tvshows?page=1&limit=100"
const API_SEARCH = "https://mcuapi.herokuapp.com/api/v1/movies?page=1&limit=10&filter="
const SECOND_API_SEARCH = "https://mcuapi.herokuapp.com/api/v1/tvshows?page=1&limit=10&filter="

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

const form = document.querySelector("form");
const search = document.querySelector(".header__search");
form.addEventListener("input", (e)=>{
    e.preventDefault();

    const apiSearchUrl= `${API_SEARCH}title=${search.value}`
    const apiSearchUrlSec= `${SECOND_API_SEARCH}title=${search.value}`
    if (search.value){
        document.querySelector(".films").innerHTML = "";

        getFilms(apiSearchUrl);
        getFilms(apiSearchUrlSec);
    }
    if (search.value===""){
        getFilms(API_URL);
        getFilms(SECOND_API_URL);
    }
});

let lastScrollTop = 0;
const header = document.getElementById('header');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        // Прокручиваем вниз
        header.classList.add('hidden');
    } else if (scrollTop < lastScrollTop && scrollTop > 0) {
        // Прокручиваем вверх
        header.classList.remove('hidden');
    }

    lastScrollTop = scrollTop; // Обновляем последнее положение прокрутки
});

