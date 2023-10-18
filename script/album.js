// fetch per trasportare l'id dell'album

const addressBarContent = new URLSearchParams(location.search);
const albumId = addressBarContent.get("_albumId");
console.log(albumId);

// funzione per ricreare la sezione Hero dell'album
const generateHeroSection = function (albumData) {
  const heroContainer = document.getElementById("hero-details");
  heroContainer.innerHTML = `
    <div class="new-song-hero-img mx-2">
    <img
      src="${albumData.cover_big}"
      alt="album image"
      class="img-fluid"
      id="hero-img"
      width="300px"
    />
  </div>
  <div class="col d-flex flex-column justify-content-between">
    <div class="new-song-hero-header">
      <p class="fw-semibold">ALBUM</p>
    </div>
    <h2 class="new-song-hero-title fw-bold pe-2" role="button">
    ${albumData.title}
    </h2>
   
    <div
      class="new-song-hero-buttons d-flex align-items-center gap-3"
    >
    
    </div>
  </div>`;
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
