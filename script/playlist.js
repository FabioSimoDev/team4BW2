const SEARCH_URL =
  "https://striveschool-api.herokuapp.com/api/deezer/search?q=";
let QUERY;

const addressBarItem = new URLSearchParams(window.location.search);
const playlistToOpen = addressBarItem.get("playlistId") || null;
console.log(playlistToOpen);

const playlistNamesContainer = document.getElementById(
  "playlists-name-container"
);

const overlayLoading = document.querySelector(".overlay-loading");
const editablePlaylistName = document.querySelector(".new-song-hero-title");
const maxLength = parseInt(editablePlaylistName.getAttribute("data-maxlength"));

let likedSongs = JSON.parse(localStorage.getItem("likedSongs")) || [];
let isCurrentlyLiked = false;

let currentlyPlaying;
let preview = new Audio();
let isPlaying = false;
let isPaused = false;

let timeTextInterval;
let animInterval;
let pauseStartTime = 0;
let start = 0;

const searchSongsInput = document.querySelector("#search-songs-input");
const searchedSongsResultUl = document.getElementById("ul-playlist-container");
const playlistSongs = document.getElementById("playlist-songs");

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

const localStoragePlaylists =
  JSON.parse(localStorage.getItem("playlists")) || [];
let currentPlaylistId;

const removeOverlay = function () {
  overlayLoading.classList.add("fade-out");
  overlayLoading.addEventListener("click", () => {
    console.log("hai cliccato l'overlay");
  });
  setTimeout(() => {
    overlayLoading.classList.add("d-none");
  }, 1000);
};

removeOverlay();

const createPlaylist = function (name, songData) {
  let playlistToUpdate = null;

  for (let i = 0; i < localStoragePlaylists.length; i++) {
    if (localStoragePlaylists[i].id === currentPlaylistId) {
      playlistToUpdate = localStoragePlaylists[i];
      console.warn("esiste");
      break;
    }
  }

  if (playlistToUpdate) {
    playlistToUpdate.name = name;
    if (songData) {
      playlistToUpdate.songs.push(songData);
    }
    console.log(playlistToUpdate);
  } else {
    const playlist = {
      name: name,
      id: localStoragePlaylists.length,
      songs: []
    };

    localStoragePlaylists.push(playlist);

    if (songData) {
      playlist["songs"].push(songData);
    }

    currentPlaylistId = playlist.id;
  }

  localStorage.setItem("playlists", JSON.stringify(localStoragePlaylists));
};

const loadPlaylistsNames = function () {
  if (localStoragePlaylists.length) {
    localStoragePlaylists.forEach((playlist, i) => {
      playlistNamesContainer.innerHTML += `
                                            <a href="#" class="text-decoration-none text-white"
                                              ><small>${playlist.name}</small></a
                                            >`;
      playlistNamesContainer
        .querySelectorAll("a")
        [i].addEventListener("click", () => {
          const URL = `playlist.html?playlistId=${playlist.id}`;
          location.assign(URL);
        });
    });
  } else {
    playlistNamesContainer.innerHTML = `
                                        <a href="#" class="text-decoration-none text-white"
                                          ><small>nomi playlist...</small></a
                                        >`;
  }
};

loadPlaylistsNames();

const addSong = function (
  title,
  cover,
  albumTitle,
  artistName,
  preview,
  duration,
  songData
) {
  const minutes = Math.floor(duration / 60);
  let seconds = (duration % 60).toString();
  if (seconds.length === 1) {
    seconds = "0" + seconds;
  }
  let li = document.createElement("li");
  li.innerHTML = `
              <div class="lista d-flex justify-content-between mx-4 ">
                <div class="col-5 mb-2 mt-2 d-flex gap-3">
                  <div class="li-img">
                    <img src="${cover}" width="45px" />
                  </div>
                  <div class="song-name-artist">
                    <h5 class="mb-0 text-white text-truncate" id="song-title">${title}</h5>
                    <a href="artist.html?artistId=13 " class="text-decoration-none text-white fs-ligth">${artistName}</a>
                  </div>
                </div>
                <p class="col offset-1 text-truncate opacity-75 fs-6"><small>${albumTitle}</small></p>
                <div class="col-2 text-end">
                  <p class="text-white">${minutes}:${seconds}</p>
                </div>
              </div>`;
  li.addEventListener("click", () => {
    currentlyPlaying = songData;
    console.log("SONGDATAAAAA: ", currentlyPlaying);
    play(songData);
    checkIfLiked();
    showPlayBar();
  });
  playlistSongs.appendChild(li);
};

const openPlaylist = function () {
  if (playlistToOpen) {
    console.log(parseInt(playlistToOpen), localStoragePlaylists.length);
    editablePlaylistName.removeAttribute("contenteditable");
    for (let i = 0; i < localStoragePlaylists.length; i++) {
      if (localStoragePlaylists[i].id === parseInt(playlistToOpen)) {
        playlistToUpdate = localStoragePlaylists[i];
        console.warn("esiste");
        editablePlaylistName.textContent = localStoragePlaylists[i].name;
        if (localStoragePlaylists[i].songs.length) {
          localStoragePlaylists[i].songs.forEach((song) => {
            addSong(
              song.title,
              song.album.cover_small,
              song.album.title,
              song.artist.name,
              song.preview,
              song.duration,
              song
            );
          });
        }
        break;
      }
    }
  }
};

openPlaylist();

if (!playlistToOpen) {
  editablePlaylistName.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      createPlaylist(this.textContent.trim());
    }
  });

  editablePlaylistName.addEventListener("keydown", function (event) {
    let text = this.textContent.trim();
    // let cursorPosition = getCaretPosition(this);

    if (text.length > maxLength && !(event.keyCode === 8)) {
      event.preventDefault();
    }
  });
}
searchSongsInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    QUERY = searchSongsInput.value;
    console.log(QUERY);
    searchSongs();
  }
});

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
  } else if (preview.src !== song.preview) {
    clearInterval(timeTextInterval);
    clearInterval(animInterval);
    pauseStartTime = 0;
    preview.src = song.preview;
    currentlyPlaying = song;
    playerImage.src = song.album.cover_medium;
    currentTrackTitle.textContent = song.title;
    currentTrackAuthor.textContent = song.artist.name;
    currentTrackSecond.textContent = "0:00";
    checkIfLiked();
    preview.play();
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
      setLikeState(playBarHeartIcon, isCurrentlyLiked);
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
  console.error(currentlyPlaying);
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

const showResults = function (songs) {
  let li;
  songs.data.forEach((song) => {
    li = document.createElement("li");
    li.innerHTML = `
                    <div class="lista d-flex justify-content-between mx-4 ">
                      <div class="col-5 mb-2 mt-2 d-flex gap-3">
                        <div class="li-img">
                          <img src="${song.album.cover_small}" width="45px" />
                        </div>
                        <div class="song-name-artist">
                          <h5 class="mb-0 text-white text-truncate">${song.title}</h5>
                          <a href="artist.html?artistId=13 " class="text-decoration-none text-white fs-ligth">${song.artist.name}</a>
                        </div>
                      </div>
                      <p class="col offset-1 text-truncate opacity-75 fs-6"><small>${song.album.title}</small></p>
                      <div class="col-2 text-end">
                        <button class="btn btn-outline-secondary add-song-btn rounded-pill text-white">Aggiungi</button>
                      </div>
                    </div>`;
    searchedSongsResultUl.appendChild(li);
    const addSongBtn = li.querySelector(".add-song-btn");
    addSongBtn.addEventListener("click", () => {
      addSong(
        song.title,
        song.album.cover_small,
        song.album.title,
        song.artist.name,
        song.preview,
        song.duration,
        song
      );
      createPlaylist(editablePlaylistName.textContent, song);
      addSongBtn.parentElement.parentElement.parentElement.remove(); //elimino la li
    });
  });
};

const searchSongs = async function () {
  try {
    const res = await fetch(SEARCH_URL + QUERY);
    if (res.ok) {
      const songsData = await res.json();
      console.log(songsData);
      showResults(songsData);
      // recommendFill(songsData);
    } else {
      throw new Error("problema di comunicazione con il server");
    }
  } catch (error) {
    console.log(error);
  }
};
