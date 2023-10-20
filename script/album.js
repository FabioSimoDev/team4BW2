const heroContainer = document.getElementById("hero-details");

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
  });

  // Aggiungi la lista al div "track-container"
  trackContainer.appendChild(tracklistContainer);
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
