const SEARCH_URL =
  "https://striveschool-api.herokuapp.com/api/deezer/search?q=";
const SEARCH_QUERY = "eminem";

let data;
let currentlyPlaying;

let likedSongs = JSON.parse(localStorage.getItem("likedSongs")) || [];
let isCurrentlyLiked = false;

const overlayLoading = document.querySelector(".overlay-loading");

const heroImg = document.getElementById("hero-img");
const heroSongTitle = document.querySelector(".new-song-hero-title");
const songHeroArtists = document.getElementById("new-song-hero-artists");
const songHeroDescription = document.getElementById(
  "new-song-hero-description"
);

const playListItems = document.querySelectorAll(".main-playlist-item");
const recommendedCards = document.querySelectorAll(".recommended .card");
console.log(recommendedCards);

const playPreviewBtn = document.querySelector("#play-preview");
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

const removeOverlay = function () {
  overlayLoading.classList.add("fade-out");
  overlayLoading.addEventListener("click", () => {
    console.log("hai cliccato l'overlay");
  });
  setTimeout(() => {
    overlayLoading.classList.add("d-none");
  }, 1000);
};

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

const redirectAlbum = function (_albumID) {
  const URL = `album.html?_albumId=${_albumID}`;
  location.assign(URL);
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

// preview.addEventListener("ended", (event) => {
// //   clearInterval(timeTextInterval);
//   //   clearInterval(animInterval);
//   console.warn("AUDIO ARRIVATO ALLA FINE");
//   console.warn(event.target);
//   isPlaying = false;
// });

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

const fillPlaylistItems = function () {
  Array.from(playListItems).forEach((item, index) => {
    const img = item.querySelectorAll("img");
    Array.from(img).forEach((img, i) => {
      img.src = `../assets/imgs/main/image-${index + 1 + i}.jpg`;
    });
  });
};

const mostLikedAlgorithm = function () {
  if (!likedSongs.length) {
    return null;
  }
  let artistLikesCount = {};
  likedSongs.forEach((song) => {
    const artist = song.artist;
    artistLikesCount[artist] = (artistLikesCount[artist] || 0) + 1;
  });
  console.log(artistLikesCount);
  let mostLikedArtist;
  let maxLikes = 0;

  for (const artist in artistLikesCount) {
    if (artistLikesCount[artist] > maxLikes) {
      maxLikes = artistLikesCount[artist];
      mostLikedArtist = artist;
    }
  }
  return mostLikedArtist;
};

const fillPage = async function (songsData) {
  const randomTrack = Math.floor(Math.random() * songsData.data.length);
  const track = songsData.data[randomTrack];
  currentlyPlaying = track;
  getAverageColor(heroImg);
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
    play(track);
    checkIfLiked();
    showPlayBar();
  });

  fillPlaylistItems();
  mostLikedAlgorithm();

  removeOverlay();
};

const checkIfLiked = function () {
  if (!likedSongs.length) {
    // isCurrentlyLiked = false;
    // setLikeState(playBarHeartIcon, isCurrentlyLiked);
    console.log("likedSongs.length è falsy");
    return false;
  } else {
    const alreadyLiked = likedSongs.findIndex((song) => {
      return song.id === currentlyPlaying.id;
    });
    if (alreadyLiked === -1) {
      isCurrentlyLiked = false;
      console.log("already liked è -1");
      //   setLikeState(playBarHeartIcon, isCurrentlyLiked);
      return false;
    } else {
      isCurrentlyLiked = true;
      setLikeState(playBarHeartIcon, isCurrentlyLiked);
      console.log("alreadyLiked: ", alreadyLiked);
      return alreadyLiked;
    }
  }
};

const likeClick = function (element = playBarHeartIcon) {
  const liked = checkIfLiked();
  if (liked === false) {
    const song = {
      artist: currentlyPlaying.artist.name,
      id: currentlyPlaying.id
    };
    console.log(song);
    likedSongs.push(song);
    localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
    isCurrentlyLiked = true;
    setLikeState(element, isCurrentlyLiked);
    console.log("PUSAHTO");
    return;
  } else {
    console.log("indice id:", liked);
    likedSongs.splice(liked, 1); //rimuovi il mi piace
    localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
    isCurrentlyLiked = false;
    setLikeState(element, isCurrentlyLiked);
  }
};

const setLikeState = function (element, state) {
  const likedHTML =
    '<i class="bi bi-suit-heart-fill text-success" style="font-size: 22px"></i>';
  const neutralHTML = `<img
                            src="assets/imgs/Heart Icon.svg"
                            alt="heart icon"
                            class="opacity-75"
                            width="22px"
                        />`;
  if (state) {
    element.innerHTML = likedHTML;
  } else {
    element.innerHTML = neutralHTML;
  }
};

const getGeneralData = async function () {
  try {
    const res = await fetch(SEARCH_URL + SEARCH_QUERY);
    if (res.ok) {
      const songsData = await res.json();
      console.log(songsData);
      data = JSON.parse(JSON.stringify(songsData));
      fillPage(songsData);
    } else {
      throw new Error("problema di comunicazione con il server");
    }
  } catch (error) {
    console.log(error);
  }
};

const getAverageColor = function (img) {
  img.src = img;

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

    return average;
  };
};

const recommendFill = function (songs) {
  if (recommendedCards) {
    const artist = mostLikedAlgorithm();
    let mostLikedArtistSongs;
    if (artist) {
      mostLikedArtistSongs = songs.data.filter((song) => {
        return song.artist.name === artist;
      });
    }
    const selectedIndices = new Set();
    Array.from(recommendedCards).forEach((card) => {
      card.setAttribute("role", "button"); //cursor pointer
      let randomTrack;
      if (artist) {
        do {
          //per evitare che esca due volte una traccia dello stesso album
          randomTrack = Math.floor(
            Math.random() *
              (artist ? mostLikedArtistSongs.length : songs.data.length)
          );
        } while (
          selectedIndices.has(mostLikedArtistSongs[randomTrack].album.id)
        );
        selectedIndices.add(mostLikedArtistSongs[randomTrack].album.id);
      } else {
        do {
          randomTrack = Math.floor(Math.random() * songs.data.length);
        } while (selectedIndices.has(randomTrack));
        selectedIndices.add(randomTrack);
      }
      const track = artist
        ? mostLikedArtistSongs[randomTrack]
        : songs.data[randomTrack];
      const cardImg = card.querySelector("img");
      const cardTitle = card.querySelector(".card-title");
      const cardText = card.querySelector("card-text");

      cardImg.src = track.album.cover_big;
      cardTitle.textContent = track.album.title;

      card.addEventListener("click", () => {
        redirectAlbum(track.album.id);
      });
    });
  }
};

const SEARCH_MOST_LIKED = mostLikedAlgorithm() || "summer";
const getArtist = async function () {
  try {
    const res = await fetch(SEARCH_URL + SEARCH_MOST_LIKED);
    if (res.ok) {
      const songsData = await res.json();
      console.log(songsData);
      recommendFill(songsData);
    } else {
      throw new Error("problema di comunicazione con il server");
    }
  } catch (error) {
    console.log(error);
  }
};

getGeneralData();
getArtist();
