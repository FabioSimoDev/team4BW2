const cercaApi = "https://striveschool-api.herokuapp.com/api/deezer/search?q=";
function playlistLol() {
  const playlistKey = "league of legends";
  fetch(cercaApi + playlistKey)
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
      const row = document.getElementById("playLista");

      for (let i = 0; i < bannerDetails.data.length; i++) {
        const image = bannerDetails.data[i].album.cover;
        const title = bannerDetails.data[i].title;
        const artist = bannerDetails.data[i].artist.name;
        const newCol = document.createElement("li");

        newCol.classList.add(
          "d-flex",
          "mx-4",
          "my-2",
          "justify-content-between",
          "w-100",
          "text-white",
          "align-items-center"
        );

        newCol.innerHTML =
          ` 
        
        <div class="d-flex align-content-center">
          <img
            src="` +
          image +
          `"
            alt=""
            width="50"
          />
          <div>
            <p class="my-0 mx-2">` +
          title +
          `</p>
            <p class="my-0 mx-2">` +
          artist +
          ` </p>
          </div>
        </div>
        <p class="">Album</p>
        <p>Aggiunto</p>
        <p class="me-3">Duration</p>
      
    `;
        row.appendChild(newCol);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
playlistLol();
