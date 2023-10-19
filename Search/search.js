const searchInput = document.querySelector(".bananaJoe");
const cercaApi = "https://striveschool-api.herokuapp.com/api/deezer/search?q=";
const nascondiRicerca = document.getElementById("recent");
const nascondiSfogliaMobile = document.getElementById("sfoglia");
const nascondiSfoglia = document.getElementById("sfoglia2");
const nascondiFooter = document.querySelector("footer");
// per qualche motivo quest osearch funziona solo da mobile
searchInput.addEventListener("input", (e) => {
  ricerca2(e);
});
function ricerca2(e) {
  const value = e.target.value.toLowerCase();
  const queryApi = value;
  if (queryApi.length >= 1) {
    nascondiSfogliaMobile.style.display = "none";
    nascondiFooter.style.display = "none";
  } else {
    nascondiSfogliaMobile.style.display = "block";
    nascondiFooter.style.display = "flex";
  }
  const resetList = document.getElementById("canzoni");
  const hide = document.getElementById("cerca");
  resetList.innerHTML = "";

  fetch(cercaApi + queryApi)
    .then((response) => {
      console.log(response);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("ERRORE NELLA RESPONSE");
      }
    })
    .then((bannerDetails) => {
      console.log(bannerDetails);
      const row = document.getElementById("canzoni");

      for (let i = 0; i < bannerDetails.data.length; i++) {
        const newAnchor = document.createElement("a");
        const newCol = document.createElement("div");
        const image = bannerDetails.data[i].album.cover;
        const title = bannerDetails.data[i].title;
        const artist = bannerDetails.data[i].artist.name;

        newAnchor.classList.add(
          "d-flex",
          "mx-4",
          "my-2",
          "justify-content-between",
          "w-100",
          "text-white",
          "text-decoration-none"
        );

        newCol.classList.add(
          "d-flex",
          "mx-4",
          "my-2",
          "justify-content-between",
          "w-100"
        );
        newCol.innerHTML =
          ` 
        <div class="left d-flex"> 
    <img
      id="songImg"
      src="` +
          image +
          `"
      alt=""
      width="50"
    />
    <div class="mx-2">
      <p class="m-0 sontTitle">` +
          title +
          `</p>
      <p class="m-0 songArtist">` +
          artist +
          `</p>
    </div>
  </div>
  <div>
    <p class="m-0 right songDuration">Durata canzone</p>
  </div>
      `;
        row.appendChild(newAnchor);
        newAnchor.appendChild(newCol);
      }
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(value);
}
function ricerca1(e) {
  const value = e.target.value.toLowerCase();
  const queryApi = value;
  if (queryApi.length >= 1) {
    nascondiRicerca.style.display = "none";
    nascondiSfoglia.style.display = "none";
    nascondiSfogliaMobile.style.display = "none";
    nascondiFooter.style.display = "none";
  } else {
    nascondiRicerca.style.display = "block";
    nascondiSfoglia.style.display = "block";
  }
  const resetList = document.getElementById("song");
  const hide = document.getElementById("cerca");
  resetList.innerHTML = "";

  fetch(cercaApi + queryApi)
    .then((response) => {
      console.log(response);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("ERRORE NELLA RESPONSE");
      }
    })
    .then((bannerDetails) => {
      console.log(bannerDetails);
      const row = document.getElementById("song");
      const ricercaMobile = document.getElementById("canzoni");

      for (let i = 0; i < bannerDetails.data.length; i++) {
        const newAnchor = document.createElement("a");
        const newCol = document.createElement("div");
        const image = bannerDetails.data[i].album.cover;
        const title = bannerDetails.data[i].title;
        const artist = bannerDetails.data[i].artist.name;

        newAnchor.classList.add(
          "d-flex",
          "mx-4",
          "my-2",
          "justify-content-between",
          "w-100",
          "text-white",
          "text-decoration-none"
        );

        newCol.classList.add(
          "d-flex",
          "mx-4",
          "my-2",
          "justify-content-between",
          "w-100"
        );
        newCol.innerHTML =
          ` 
        <div class="left d-flex"> 
    <img
      id="songImg"
      src="` +
          image +
          `"
      alt=""
      width="50"
    />
    <div class="mx-2">
      <p class="m-0 sontTitle">` +
          title +
          `</p>
      <p class="m-0 songArtist">` +
          artist +
          `</p>
    </div>
  </div>
  <div>
    <p class="m-0 right songDuration">Durata canzone</p>
  </div>
      `;
        row.appendChild(newAnchor);
        newAnchor.appendChild(newCol);
      }
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(value);
}
// e questo solo da desktop
const searchInputs = document.querySelectorAll(".search[type='search']");
searchInputs.forEach((searchInput) => {
  searchInput.addEventListener("input", (e) => {
    ricerca1(e);
  });
});
//
//

//
//
fetch(cercaApi + queryApi)
  .then((response) => {
    console.log(response);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("ERRORE NELLA RESPONSE");
    }
  })
  .then((bannerDetails) => {
    console.log(bannerDetails);
    const row = document.getElementById("song");

    for (let i = 0; i < bannerDetails.data.length; i++) {
      const newAnchor = document.createElement("a");
      const newCol = document.createElement("div");
      const image = bannerDetails.data[i].album.cover;
      const title = bannerDetails.data[i].title;
      const artist = bannerDetails.data[i].artist.name;

      newAnchor.classList.add(
        "d-flex",
        "mx-4",
        "my-2",
        "justify-content-between",
        "w-100",
        "text-white",
        "text-decoration-none"
      );

      newCol.classList.add(
        "d-flex",
        "mx-4",
        "my-2",
        "justify-content-between",
        "w-100"
      );
      newCol.innerHTML =
        ` 
        <div class="left d-flex"> 
    <img
      id="songImg"
      src="` +
        image +
        `"
      alt=""
      width="50"
    />
    <div class="mx-2">
      <p class="m-0 sontTitle">` +
        title +
        `</p>
      <p class="m-0 songArtist">` +
        artist +
        `</p>
    </div>
  </div>
  <div>
    <p class="m-0 right songDuration">Durata canzone</p>
  </div>
      `;
      row.appendChild(newAnchor);
      newAnchor.appendChild(newCol);
    }
  })
  .catch((err) => {
    console.log(err);
  });
