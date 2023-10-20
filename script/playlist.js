const overlayLoading = document.querySelector(".overlay-loading");
const editablePlaylistName = document.querySelector(".new-song-hero-title");
const maxLength = parseInt(editablePlaylistName.getAttribute("data-maxlength"));

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

const createPlaylist = function (name) {
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
  } else {
    const playlist = {
      name: name,
      id: localStoragePlaylists.length
    };

    localStoragePlaylists.push(playlist);

    currentPlaylistId = playlist.id;
  }

  localStorage.setItem("playlists", JSON.stringify(localStoragePlaylists));
};

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
