const API_URL = "https://mcuapi.herokuapp.com/api/v1/movies?page=1&limit=100";
const API_SEARCH = "https://mcuapi.herokuapp.com/api/v1/movies?page=1&limit=10&filter="
document.querySelector(".films").innerHTML = "";
getFilms(API_URL);

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
        filmEl.addEventListener("click", () => openModal(film.title))
        filmsEl.appendChild(filmEl);
    });
}

const form = document.querySelector("form");
const search = document.querySelector(".header__search");
let timeoutId; // Variable to store the timeout ID

form.addEventListener("input", (e) => {
    e.preventDefault();

    clearTimeout(timeoutId);

    const apiSearchUrl = `${API_SEARCH}title=${search.value}`;

    timeoutId = setTimeout(() => {
        if (search.value) {
            document.querySelector(".films").innerHTML = "";

            getFilms(apiSearchUrl);
        } else {
            document.querySelector(".films").innerHTML = "";
            getFilms(API_URL);
        }
    }, 300);
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

// Modal
const modalEl = document.querySelector(".modal");

async function openModal(title) {
    const resp = await fetch(`${API_SEARCH}title=${title}`, {
        headers: {
            "Content-Type": "application/json"
        },
    });
    const respData = await resp.json();

    modalEl.classList.add("modal--show");
    document.body.classList.add("stop-scrolling");
    console.log(respData[0])
    modalEl.innerHTML = `
    <div class="modal__card">
      <img class="modal__movie-backdrop" src="${respData.data[0].cover_url}" alt="">
      <h2>
        <span class="modal__movie-title">${respData.data[0].title}</span>
      </h2>
      <ul class="modal__movie-info">
        <div class="loader"></div>
        ${respData.data[0].duration ? `<li class="modal__movie-runtime">Duration - ${respData.data[0].duration} min</li>` : ''}
        <li class="modal__movie-overview">Description - ${respData.data[0].overview}</li>
        <li class="modal__movie-overview">Date - ${respData.data[0].release_date}</li>
      </ul>
      <button type="button" class="modal__button-close">Закрыть</button>
    </div>
  `;
    const btnClose = document.querySelector(".modal__button-close");
    btnClose.addEventListener("click", () => closeModal());
}

function closeModal() {
    modalEl.classList.remove("modal--show");
    document.body.classList.remove("stop-scrolling");
}

window.addEventListener("click", (e) => {
    if (e.target === modalEl) {
        closeModal();
    }
})
window.addEventListener("keydown", (e) => {
    if (e.keyCode === 27) {
        closeModal();
    }
})

