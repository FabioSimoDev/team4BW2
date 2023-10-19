// Funzione per convertire un valore RGB in un valore esadecimale
const rgbToHex = function (r, g, b) {
  if (r > 255 || g > 255 || b > 255) {
    throw "Componente colore non valido";
  } else {
    return ((r << 16) | (g << 8) | b).toString(16);
  }
};

// Funzione per aggiungere zeri davanti a un colore esadecimale se necessario
const pad = function (hex) {
  return ("000000" + hex).slice(-6);
};

// Funzione per creare un canvas da un'immagine e restituire il contesto 2D
const draw = function (img) {
  let canvas = document.createElement("canvas");
  let c = canvas.getContext("2d");
  c.width = canvas.width = img.clientWidth;
  c.height = canvas.height = img.clientHeight;
  c.clearRect(0, 0, c.width, c.height);
  c.drawImage(img, 0, 0, img.clientWidth, img.clientHeight);
  return c;
};

// Funzione per ottenere una mappa dei colori più ricorrenti nell'immagine
const getColors = function (c) {
  let col,
    colors = {};
  let pixels, r, g, b, a;
  r = g = b = a = 0;
  pixels = c.getImageData(0, 0, c.width, c.height);
  for (let i = 0, data = pixels.data; i < data.length; i += 4) {
    r = data[i];
    g = data[i + 1];
    b = data[i + 2];
    a = data[i + 3];
    if (a < 255 / 2) continue;
    col = rgbToHex(r, g, b);
    if (!colors[col]) colors[col] = 0;
    colors[col]++;
  }
  return colors;
};

// Funzione per trovare il colore più ricorrente dato un oggetto di frequenza dei colori
const findMostRecurrentColor = function (colorMap) {
  let highestValue = 0;
  let mostRecurrent = null;
  for (const hexColor in colorMap) {
    if (colorMap[hexColor] > highestValue) {
      mostRecurrent = hexColor;
      highestValue = colorMap[hexColor];
    }
  }
  return mostRecurrent;
};

// fetch per trasportare l'id dell'album

const addressBarContent = new URLSearchParams(location.search);
const albumId = addressBarContent.get("_albumId");
console.log(albumId);

// funzione per ricreare la sezione Hero dell'album

const generateHeroSection = function (albumData) {
  const heroContainer = document.getElementById("hero-details");

  const trackContainer = document.getElementById("track-container");
  heroContainer.innerHTML = `
  <div class="d-flex hero-content" >
    <div class="new-song-hero-img mx-4">
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
    <div class="d-flex align-items-center gap-2">
      <!-- classe per mini thumbnail -->
    <img
      src="${albumData.artist.picture}"
      alt="artist image"
      class="rounded-circle img-album"
      style="height: 30px; width: 30px" />
    <a class="artist text-decoration-none text-white fw-bold">${
      albumData.artist.name
    } </a><span class="year">  · ${albumData.release_date.slice(
    0,
    4
  )}  · </span>
    <span class="ntracks">${albumData.tracks.data.length} brani,</span>
    <span class="dtracks fw-light">${(
      Math.floor((albumData.duration / 60) * 100) / 100
    )
      .toString()
      .replace(".", " min ")} sec.</span>
    </div>
    
   </div>
  </div>

  `;
  // setTimeout(function () {
  //   const heroImage = document.getElementById("hero-img");
  //   console.log(heroImage);
  //   const mostRecurrentColor = pad(
  //     findMostRecurrentColor(getColors(draw(heroImage)))
  //   );
  // }, 2000);

  // Creazione della lista ordinata con classi
  const tracklistContainer = document.createElement("ol");
  tracklistContainer.className = "album-tracklist mt-4 mb-5 pb-5"; // Aggiungi le classi necessarie

  albumData.tracks.data.forEach((track) => {
    const listItem = document.createElement("li");

    // Creazione di un div con le classi "prova d-flex justify-content-around"
    const trackInfo = document.createElement("div");
    trackInfo.className = "lista d-flex justify-content-between mx-4 ";

    // Creazione del titolo in un div
    const completeTitle = document.createElement("div");
    completeTitle.classList.add("col", "mb-3");
    const titleHeading = document.createElement("h5");
    titleHeading.textContent = `${track.title}`;
    titleHeading.classList.add("mb-0");

    completeTitle.appendChild(titleHeading);

    // Creazione dell'elemento <a> per il nome dell'artista
    const artistLink = document.createElement("a");
    artistLink.textContent = albumData.artist.name;
    artistLink.href = "artist.html";
    artistLink.classList.add("text-decoration-none", "text-white", "fs-ligth");
    completeTitle.appendChild(artistLink);
    trackInfo.appendChild(completeTitle);

    // Generazione di un numero casuale da 100 a 30000 per le riproduzioni
    const randomReproductions =
      Math.floor(Math.random() * (30000 - 100 + 1)) + 100;
    const reproductionsParagraph = document.createElement("p");
    reproductionsParagraph.textContent = `${randomReproductions}`;
    reproductionsParagraph.classList.add("col", "text-center");
    trackInfo.appendChild(reproductionsParagraph);

    // Aggiunta della durata della canzone (sostituisci con la durata effettiva)
    const durationInSeconds = track.duration;
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    const durationParagraph = document.createElement("p");
    durationParagraph.textContent = `${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
    durationParagraph.classList.add("col", "text-end"); // Sostituisci con la durata reale
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
