let currentlyPlaying;
const playerImage = document.getElementById("player-img");

const desktopPlayBar = document.getElementById("desktop-playBar");

const currentTrackTitle = document.getElementById("current-track-title");
const currentTrackAuthor = document.getElementById("current-track-author");

const playBarHeartIcon = document.querySelector(".footer-left-like-icon");

const currentTrackDuration = document.getElementById("current-track-duration");
const currentTrackSecond = document.getElementById("track-current-second");
const progressBar = document.getElementById("current-track-progress-bar");
const playPauseBtn = document.getElementById("player-play-pause-btn");
let preview = new Audio();
let isPlaying = false;
let isPaused = false;

let timeTextInterval;
let animInterval;
let pauseStartTime = 0;
let start = 0;

const updateTrackBar = function (audioElement, startTime) {
  const duration = audioElement.duration;

  let progressBarCurrentValue = 0;
  let currentTime = 0;
  let minutes = 0;
  let seconds = 0;
  let fullSeconds = 0;
  let milliSeconds = 0;
  //   if (pauseStartTime === 0) {
  //     start = new Date(); //momento preciso in cui la canzone è iniziata
  //   }

  let width = 0; //larghezza di partenza
  const increasePerIteration = 10 / duration; // calcolo incremento (iterazioni al secondo / durata totale)

  const updateBar = function () {
    if (!isPaused) {
      //   let current = new Date();
      //   let timePassed = (current - start) / 1000; //
      let timePassed = audioElement.currentTime;
      // Date() ci fornisce la data precisa, includendo secondi e millisecondi attuali.
      // quindi, ad ogni ciclo dell'intervallo ottengo la differenza tra le due date,
      // che è il valore in millisecondi del tempo trascorso. lo divido per 1000 in modo
      // da avere il valore in secondi (ad esempio, dopo 100 millisecondi sarà: 0.1)
      // e grazie a questo calcolo la percentuale di incremento della barra.
      // tutto questo va fatto perchè setInterval non è preciso al 100%.

      const percent = Math.min(increasePerIteration * timePassed * 10, 100);
      console.log("percent:", percent);
      width = percent;
      progressBar.style.width = width + "%";

      if (width >= 100) {
        isPlaying = false;
        clearInterval(animInterval);
        return;
      }
      console.log("ANIMINTERVAL: ", animInterval);
    }
  };

  animInterval = setInterval(() => {
    updateBar();
  }, 50);
  updateBar();

  //funzione per aggiornare il testo che tiene traccia dell'andamento della canzone
  const updateText = function () {
    const currentTrackTime = Math.round(audioElement.currentTime);
    console.log("currentTime: ", audioElement.currentTime);
    let current = new Date();
    let timePassed = ((current - start) / 1000) % 60;
    progressBarCurrentValue = progressBar.getAttribute("aria-valuenow");
    currentTime = currentTrackSecond.innerHTML.split(":");
    minutes = parseInt(currentTime[0]);
    seconds = currentTrackTime;
    fullSeconds = seconds + minutes * 60;

    // console.log("fullseconds fuori intervallo: ", fullSeconds);

    seconds++;
    fullSeconds++;

    if (seconds === 60) {
      minutes++;
      seconds = 0;
    }

    let formattedTime = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    currentTrackSecond.textContent = formattedTime;
    //   console.log("currentTime: ", audio.currentTime);
  };

  //dichiaro un setInterval() dentro al quale richiamo la funzione updatetText()
  //ogni secondo. ho dovuto creare una funzione a parte anzichè metterla dentro
  //per evitare che aspettasse un secondo prima della prima esecuzione
  //(altrimenti, il testo avrebbe iniziato a cambiare da due secondi in poi.)
  timeTextInterval = setInterval(() => {
    if (fullSeconds < duration) {
      updateText();
    } else {
      //se siamo alla fine della canzone, rimuovi l'intervallo.
      clearInterval(timeTextInterval);
      return;
    }
  }, 1000);
  updateText(); //richiama la funzione per la prima volta senza aspettare un secondo
  return;
};

const playOrStopHandler = function () {
  if (preview.paused) {
    play();
  } else {
    pause();
  }
};

const pause = function () {
  isPaused = true;
  preview.pause();
  playPauseBtn.classList.add("bi-play-fill");
  playPauseBtn.classList.remove("bi-pause-fill");
  isPlaying = false;
  clearInterval(timeTextInterval);
  clearInterval(animInterval);
  pauseStartTime = new Date();
};

const play = function (song = undefined) {
  if (!song) {
    if (isPaused) {
      if (preview.src) {
        isPaused = false;
        start = new Date() - (pauseStartTime - start);
        console.log(preview.src);
        preview.play();
        playPauseBtn.classList.remove("bi-play-fill");
        playPauseBtn.classList.add("bi-pause-fill");
      }
    }
  } else if (!isPlaying && !preview.ended) {
    playPauseBtn.classList.remove("bi-play-fill");
    playPauseBtn.classList.add("bi-pause-fill");
    console.log("isPlaying falso");
    preview.src = song.preview;
    preview.play();
    console.log(preview.currentTime);
    playerImage.src = song.album.cover_medium;
    currentTrackTitle.textContent = song.title;
    currentTrackAuthor.textContent = song.artist.name;
    currentTrackSecond.textContent = "0:00";
    progressBar.setAttribute("aria-valuemax", song.duration);
  } else if (isPlaying && preview.src === song.preview) {
    clearInterval(timeTextInterval);
    clearInterval(animInterval);
    pauseStartTime = 0;
    preview.currentTime = 0;
    preview.play();
    console.log("STAI RIPRODUCENDO LA STESSA TRACCIA DI PRIMA");
  }
};
const showPlayBar = function (playBar) {
  if (!playBar) {
    if (desktopPlayBar) {
      playBar = desktopPlayBar;
    }
  }
  if (playBar.getAttribute("disabled") === "true") {
    playBar.setAttribute("disabled", "false");
    console.error("playbar attiva");
  } else {
    return;
  }
};

preview.addEventListener("playing", function playing(event) {
  clearInterval(timeTextInterval);
  clearInterval(animInterval);
  updateTrackBar(event.target, preview);
  isPlaying = true;
  const minutes = (event.target.duration / 60).toString().split(".")[0];
  console.log(minutes);
  const seconds = event.target.duration.toFixed();
  const totalDuration = `${minutes}:${seconds}`;
  currentTrackDuration.textContent = totalDuration;
  console.log(event.target);
  console.warn("AUDIO IN RIPRODUZIONE", this);
});

const heroContainer = document.getElementById("hero-details");
const overlayLoading = document.querySelector(".overlay-loading");

// Dichiarazione di una variabile per tenere traccia dello stato del cuore e colorarlo di verde
let isFavorite = false;

function handleFavoriteClick() {
  const heartIcon = document.getElementById("heart-icon");
  if (isFavorite) {
    heartIcon.style.fill = "white";
    isFavorite = false;
  } else {
    heartIcon.style.fill = "green";
    isFavorite = true;
    alert("Album aggiunto ai preferiti");
  }
}

// Gestore di eventi al clic dell'icona a forma di cuore
const heartIcon = document.getElementById("heart-icon");
if (heartIcon) {
  heartIcon.addEventListener("click", handleFavoriteClick);
}

const removeOverlay = function () {
  overlayLoading.classList.add("fade-out");
  overlayLoading.addEventListener("click", () => {
    console.log("hai cliccato l'overlay");
  });
  setTimeout(() => {
    overlayLoading.classList.add("d-none");
  }, 1000);
};

const getAverageColor = function (img) {
  // img.src = img;

  img.onload = function () {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0, img.width, img.height);

    let imageData = ctx.getImageData(0, 0, img.width, img.height).data;

    let totalR = 0,
      totalG = 0,
      totalB = 0;

    for (let i = 0; i < imageData.length; i += 4) {
      totalR += imageData[i];
      totalG += imageData[i + 1];
      totalB += imageData[i + 2];
    }

    let averageR = Math.round(totalR / (imageData.length / 4));
    let averageG = Math.round(totalG / (imageData.length / 4));
    let averageB = Math.round(totalB / (imageData.length / 4));

    let average = "rgb(" + averageR + "," + averageG + "," + averageB + ")";
    console.log(average);
    document.body.style.background = `linear-gradient(to bottom, ${average} 0%, transparent 45%), linear-gradient(to top, black 0%, rgba(33,33,33,1) 65%)`;
    heroContainer.style.background = "transparent";
    return average;
  };
};

// fetch per trasportare l'id dell'album

const addressBarContent = new URLSearchParams(location.search);
const albumId = addressBarContent.get("_albumId");
console.log(albumId);

// funzione per ricreare la sezione Hero dell'album
const generateHeroSection = function (albumData) {
  const trackContainer = document.getElementById("track-container");
  console.log(albumData.cover_big);
  heroContainer.innerHTML = `
  <div class="d-flex hero-content flex-column flex-md-row" >
    <div class="new-song-hero-img mx-4 d-flex align-self-center">
    <img
      src="${albumData.cover_big}"
      alt="album image"
      class="img-fluid"
      id="hero-img"
      width="300px"
      crossorigin= "anonymous"
    />
  </div>
  <div class="col d-flex flex-column justify-content-between" style="width: 350px">
    <div class="new-song-hero-header d-none d-md-block">
      <p class="fw-semibold">ALBUM</p>
    </div>
      <h2 class="new-song-hero-title fw-bold pe-2 mt-2" id="title-h2" role="button">
      ${albumData.title}
      </h2>
    <div class="d-flex align-items-md-center align-items-start gap-2 flex-column flex-md-row">
      <!-- classe per mini thumbnail -->
    
    <a id=artistLink class="artist text-decoration-none text-white fw-bold"><img
    src="${albumData.artist.picture}"
    alt="artist image"
    class="rounded-circle img-album"
    style="height: 30px; width: 30px" /> ${
      albumData.artist.name
    }  </a><span class="year"><span class="d-md-none">Album</span> · ${albumData.release_date.slice(
    0,
    4
  )}   </span>
    <span class="ntracks d-none d-md-block"> · ${
      albumData.tracks.data.length
    } brani,</span>
    <span class="dtracks fw-light d-none d-md-block">${(
      Math.floor((albumData.duration / 60) * 100) / 100
    )
      .toString()
      .replace(".", " min ")} sec.</span>
    </div>
    
   </div>
  </div>

  `;

  const heroImg = document.getElementById("hero-img");
  console.log(heroImg);
  getAverageColor(heroImg);

  // Imposta l'attributo href con l'URL dinamico
  const artistLink = document.getElementById("artistLink");
  const artistId = albumData.artist.id;
  const dynamicURL = `artist.html?artistId=${artistId}`;
  artistLink.setAttribute("href", dynamicURL);

  // setTimeout(function () {
  //   const heroImage = document.getElementById("hero-img");
  //   console.log(heroImage);
  //   const mostRecurrentColor = pad(
  //     findMostRecurrentColor(getColors(draw(heroImage)))
  //   );
  // }, 2000);

  // Creazione della lista ordinata con classi
  const tracklistContainer = document.createElement("ol");
  tracklistContainer.className = "album-tracklist mt-4"; // Aggiungi le classi necessarie

  albumData.tracks.data.forEach((track) => {
    const listItem = document.createElement("li");

    // Creazione di un div con le classi "prova d-flex justify-content-around"
    const trackInfo = document.createElement("div");
    trackInfo.className = "lista d-flex justify-content-between mx-4 ";

    // Creazione del titolo in un div
    const completeTitle = document.createElement("div");
    completeTitle.classList.add("col", "mb-2");
    const titleHeading = document.createElement("h5");
    titleHeading.textContent = `${track.title}`;
    titleHeading.classList.add("mb-0");

    completeTitle.appendChild(titleHeading);

    // Creazione dell'elemento <a> per il nome dell'artista
    const artistLink = document.createElement("a");
    artistLink.textContent = albumData.artist.name;
    artistLink.href = `artist.html?artistId=${track.artist.id} `;
    artistLink.classList.add("text-decoration-none", "text-white", "fs-ligth");
    completeTitle.appendChild(artistLink);
    trackInfo.appendChild(completeTitle);

    // Generazione di un numero casuale da 100 a 30000 per le riproduzioni
    const randomReproductions =
      Math.floor(Math.random() * (30000 - 100 + 1)) + 100;
    const reproductionsParagraph = document.createElement("p");
    reproductionsParagraph.textContent = `${randomReproductions}`;
    reproductionsParagraph.classList.add(
      "col",
      "text-center",
      "d-none",
      "d-md-block"
    );
    trackInfo.appendChild(reproductionsParagraph);

    // Aggiunta della durata della canzone (sostituisci con la durata effettiva)
    const durationInSeconds = track.duration;
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    const durationParagraph = document.createElement("p");
    durationParagraph.textContent = `${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
    durationParagraph.classList.add("col", "text-end", "d-none", "d-md-block"); // Sostituisci con la durata reale
    trackInfo.appendChild(durationParagraph);

    // Aggiungi il div "prova d-flex justify-content-around" come figlio dell'elemento lista
    listItem.appendChild(trackInfo);

    // Aggiungi l'elemento lista al contenitore della tracklist
    tracklistContainer.appendChild(listItem);
    listItem.addEventListener("click", () => {
      play(track);
      showPlayBar();
    });
  });

  // Aggiungi la lista al div "track-container"
  trackContainer.appendChild(tracklistContainer);
  removeOverlay();
};

const getSingleAlbum = function () {
  fetch("https://striveschool-api.herokuapp.com/api/deezer/album/" + albumId)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Errore nel caricamento degli album");
      }
    })
    .then((albumData) => {
      // albumData è l'oggetto con i dettagli dell'album
      generateHeroSection(albumData);
      console.log(albumData);
    })

    .catch((err) => console.log("Error", err));
};
getSingleAlbum();
