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

const modalEl = document.querySelector(".modal");

async function openModal(title) {
    const resp = await fetch(`${API_SEARCH}title=${title}`, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    const respData = await resp.json();

    modalEl.classList.add("modal--show");
    document.body.classList.add("stop-scrolling");

    if (respData.data[0].trailer_url!== "" || respData.data[0].trailer_url!= null){
        const trailerIframe = generateIframe(respData.data[0].trailer_url);
        modalEl.innerHTML = `
    <div class="modal__card">
      <div class="modal__movie-container">
        <img class="modal__movie-backdrop" src="${respData.data[0].cover_url}" alt="">
        ${trailerIframe}
      </div>

      <h2>
        <span class="modal__movie-title">${respData.data[0].title}</span>
      </h2>
      <ul class="modal__movie-info">
        <div class="loader"></div>
        <li class="modal__movie-overview">Duration - ${respData.data[0].duration} min</li>
        <li class="modal__movie-overview">Description - ${respData.data[0].overview}</li>
        <li class="modal__movie-overview">Date - ${respData.data[0].release_date}</li>
      </ul>
      <button type="button" class="modal__button-close">Закрыть</button>
    </div>
  `;
    }
    else{
        modalEl.innerHTML = `
    <div class="modal__card">
      <div class="modal__movie-container">
        <img class="modal__movie-backdrop" src="${respData.data[0].cover_url}" alt="">
      </div>

      <h2>
        <span class="modal__movie-title">${respData.data[0].title}</span>
      </h2>
      <ul class="modal__movie-info">
        <div class="loader"></div>
        <li class="modal__movie-overview">Duration - ${respData.data[0].duration} min</li>
        <li class="modal__movie-overview">Description - ${respData.data[0].overview}</li>
        <li class="modal__movie-overview">Date - ${respData.data[0].release_date}</li>
      </ul>
      <button type="button" class="modal__button-close">Закрыть</button>
    </div>
  `;
    }


    const btnClose = document.querySelector(".modal__button-close");
    btnClose.addEventListener("click", () => {
        modalEl.innerHTML=``
        closeModal();
    });
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
function generateIframe(trailerUrl) {
    // Check if the link is from YouTube
    if (trailerUrl.includes("youtu.be") || trailerUrl.includes("youtube.com/watch")) {
        // Extract the YouTube video ID
        const videoId = trailerUrl.split('.be/')[1];
        return `<iframe id="movieTrailer" class="modal__movie-trailer" width="280" height="157.5" src="https://www.youtube.com/embed/${videoId}" frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>`;
    } else if (trailerUrl.includes("players.brightcove.net")) {
        // Brightcove link, use the provided URL directly
        return `<iframe id="movieTrailer" class="modal__movie-trailer" width="280" height="157.5" src="${trailerUrl}" frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>`;
    } else {
        // Handle other link types if necessary
        return "Unsupported link format";
    }
}


