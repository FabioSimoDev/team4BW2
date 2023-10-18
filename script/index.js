const SEARCH_URL =
  "https://striveschool-api.herokuapp.com/api/deezer/search?q=";
const SEARCH_QUERY = "eminem";

const overlayLoading = document.querySelector(".overlay-loading");

const heroImg = document.getElementById("hero-img");
const heroSongTitle = document.querySelector(".new-song-hero-title");
const songHeroArtists = document.getElementById("new-song-hero-artists");
const songHeroDescription = document.getElementById(
  "new-song-hero-description"
);
const playPreviewBtn = document.querySelector("#play-preview");
const playerImage = document.getElementById("player-img");

const currentTrackTitle = document.getElementById("current-track-title");
const currentTrackAuthor = document.getElementById("current-track-author");

const currentTrackDuration = document.getElementById("current-track-duration");
const currentTrackSecond = document.getElementById("track-current-second");
const progressBar = document.getElementById("current-track-progress-bar");

const removeOverlay = function () {
  overlayLoading.classList.add("fade-out");
  setTimeout(() => {
    overlayLoading.classList.add("d-none");
  }, 2010);
};

const updateTrackBar = function (duration, audio) {
  let progressBarCurrentValue;
  let currentTime;
  let minutes = 0;
  let seconds = 0;
  let fullSeconds = 0;
  let milliSeconds = 0;
  const start = new Date();

  let width = 0;
  const increasePerIteration = 10 / duration; // calcolo incremento (iterazioni al secondo / durata totale)

  const animInterval = setInterval(() => {
    let current = new Date();
    let timePassed = (current - start) / 1000; //
    console.log(timePassed * 1000); // Date() ci fornisce la data precisa, includendo secondi e millisecondi attuali.
    // quindi, ad ogni ciclo dell'intervallo ottengo la differenza tra le due date,
    // che è il valore in millisecondi del tempo trascorso. lo divido per 1000 in modo
    // da avere il valore in secondi (ad esempio, dopo 100 millisecondi sarà: 0.1)
    // e grazie a questo calcolo la percentuale di incremento della barra.
    // tutto questo va fatto perchè setInterval non è preciso al 100%.
    const percent = Math.min(increasePerIteration * timePassed * 10, 100);
    width = percent;
    progressBar.style.width = width + "%";

    if (width >= 100) clearInterval(animInterval);
  }, 100);

  const timeTextInterval = setInterval(() => {
    let current = new Date();
    let timePassed = ((current - start) / 1000) % 60;
    console.log("timePassed SECONDI: ", timePassed);
    progressBarCurrentValue = progressBar.getAttribute("aria-valuenow");
    currentTime = currentTrackSecond.innerHTML.split(":");
    minutes = parseInt(currentTime[0]);
    seconds = seconds;
    fullSeconds = seconds + minutes * 60;

    // console.log("fullseconds fuori intervallo: ", fullSeconds);

    if (fullSeconds < duration) {
      seconds++;
      fullSeconds++;

      if (seconds === 60) {
        minutes++;
        seconds = 0;
      }

      let formattedTime = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
      currentTrackSecond.textContent = formattedTime;
      //   console.log("currentTime: ", audio.currentTime);
    } else {
      clearInterval(timeTextInterval);
    }
  }, 1000);
};

const redirectAlbum = function (_albumID) {
  const URL = `album.html?_albumId=${_albumID}`;
  location.assign(URL);
};

const fillPage = function (songsData) {
  const randomTrack = Math.floor(Math.random() * songsData.data.length);
  const track = songsData.data[randomTrack];

  heroImg.src = track.album.cover_big;
  console.log(track.album.cover_big);
  heroSongTitle.textContent = track.title_short;
  heroSongTitle.addEventListener("click", () => {
    redirectAlbum(track.album.id);
  });
  songHeroArtists.textContent = track.artist.name;
  songHeroDescription.textContent =
    track.type === "track"
      ? `Ascolta ora la nuova canzone di ${track.artist.name}!`
      : "Ascolta ora il nuovo album!";

  playPreviewBtn.addEventListener("click", () => {
    const preview = new Audio(track.preview);
    preview.play();
    console.log(preview.currentTime);

    preview.addEventListener("playing", (event) => {
      const minutes = (event.target.duration / 60).toString().split(".")[0];
      console.log(minutes);
      const seconds = event.target.duration.toFixed();
      const totalDuration = `${minutes}:${seconds}`;
      currentTrackDuration.textContent = totalDuration;
      updateTrackBar(event.target.duration, preview);
      console.log(event.target);
    });

    playerImage.src = track.album.cover_medium;
    currentTrackTitle.textContent = track.title;
    currentTrackAuthor.textContent = track.artist.name;
    // currentTrackDuration.textContent =
    //   (track.duration / 60).toFixed().toString() +
    //   ":" +
    //   (track.duration % 60).toString();
    // //   .replace(".", ":");
    currentTrackSecond.textContent = "0:00";
    progressBar.setAttribute("aria-valuemax", track.duration);
  });

  removeOverlay();
};

const getData = async function () {
  try {
    const res = await fetch(SEARCH_URL + SEARCH_QUERY);
    if (res.ok) {
      const songsData = await res.json();
      console.log(songsData);
      fillPage(songsData);
    } else {
      throw new Error("problema di comunicazione con il server");
    }
  } catch (error) {
    console.log(error);
  }
};

getData();
