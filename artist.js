// const addressBarItem = new URLSearchParams(window.location.search)
// const itemId = addressBarItem.get('itemId')
// console.log(itemId)

const createArtist = function(artistInfo){
    const artistHero = document.getElementById('hero')
    artistHero.style.backgroundImage = `url("${artistInfo.picture_big}")`
    artistHero.style.backgroundRepeat = 'no-repeat' 
    artistHero.style.backgroundSize = 'cover'
    const navBar = document.createElement('div')
    navBar.classList.add('d-flex', 'flex-column', 'justify-content-between', 'h-100')
    navBar.innerHTML = `
    <!-- SECTION HERO MOBILE VERSION -->
    <section
      class="d-md-none d-flex flex-column h-100 justify-content-between my-3 ms-3"
    >
      <a href="#"
        ><i class="bi bi-arrow-left-circle fs-1 text-white"></i
      ></a>
      <a href="#" class="link-underline link-underline-opacity-0"
        ><h1 class="text-white">${artistInfo.name}</h1></a
      >
    </section>

    <!-- NAV BAR DESKTOP VERSION -->
    <nav
      class="d-md-flex justify-content-between pb-3 d-mobile-none pt-3 px-3"
    >
      <div class="arrows d-flex gap-3">
        <div
          class="nav-arrow-left bg-secondary-subtle d-flex p-2 justify-content-center align-items-center"
        >
          <a href="#">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="currentColor"
              class="bi bi-chevron-left text-white"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
              /></svg
          ></a>
        </div>
        <div
          class="nav-arrow-right bg-secondary-subtle d-flex p-2 align-items-center"
        >
          <a href="#">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="currentColor"
              class="bi bi-chevron-right text-white"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
              /></svg
          ></a>
        </div>
      </div>
      <div class="dropdown">
        <button
          class="btn btn-sm bg-black opacity-75 dropdown-toggle rounded-pill d-flex align-items-center gap-1"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src="/assets/imgs/main/image-1.jpg"
            width="30px"
            alt="PP"
            class="rounded-pill"
          />
          Lidia Nautilus ...
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">....</a></li>
          <li><a class="dropdown-item" href="#">...</a></li>
          <li>
            <a class="dropdown-item" href="#">...</a>
          </li>
        </ul>
      </div>
    </nav>

    <!-- MAIN PART DESKTOP VERSION-->
    <section class="hero d-mobile-none">
      <div class="w-100 d-flex gap-3 ps-2 pt-5">
        <div class="d-flex">
          <div class="col d-flex flex-column justify-content-between">
            <div class="new-song-hero-header">
              <p class="fw-semibold m-0">
                <i class="bi bi-patch-check-fill me-1 text-info"></i
                >Artista verificato
              </p>
            </div>
            <a
              href="#"
              class="link-underline link-underline-opacity-0"
              ><h2
                class="new-song-hero-title fw-bold pe-2 mb-4 text-white"
              >
                ${artistInfo.name}
              </h2></a
            >
            <p class="new-song-hero-artists">
              ${artistInfo.nb_fan} ascolti mensili
            </p>
          </div>
        </div>
      </div>
    </section>
    `
    artistHero.appendChild(navBar)
    const visual = document.getElementById('fan')
    visual.innerHTML = `${artistInfo.nb_fan} ascolti mensili`

    // ----------------
    const braniCheTiPiacciono = document.getElementById('brani')
    braniCheTiPiacciono.innerHTML = `
    <div class="col-4 position-relative">
        <img
        src="${artistInfo.picture_medium}"
        alt=""
        class="w-100 rounded-circle"
        />
        <i
        class="bi bi-heart-fill heart-absolute text-success"
        ></i>
    </div>
    <div class="col">
        <p class="m-0">Hai messo mi piace a 11 brani</p>
        <p class="text-grey">di ${artistInfo.name}</p>
    </div>
    `
    // ------------------ 
    const braniCheTiPiaccionoMobile = document.getElementById('brani-mobile')
    braniCheTiPiaccionoMobile.innerHTML = `
    <div class="col-4 position-relative">
        <img
        src="${artistInfo.picture_medium}"
        alt=""
        class="w-100 rounded-circle"
        />
        <i class="bi bi-heart-fill heart-absolute"></i>
    </div>

    <div class="col">
        <h5 class="m-0 fs-6">Brani che ti piacciono</h5>
        <p class="text-grey">8 di ${artistInfo.name}</p>
    </div>
    `
}

const getSongs = function(canzone){
    let num = 0
    for (i=0; i<canzone.data.length; i++){
        num++
        const durationSong = canzone.data[i].duration
        const durationInSeconds = parseInt(durationSong)
        const minute = Math.floor(durationInSeconds/60)
        const seconds = durationInSeconds % 60
        console.log(durationInSeconds)
        // const getTime = function(){
        //     const durationSong = canzone.data[i].duration
        //     const durationInSeconds = parseInt(durationSong)
        //     const minute = Math.floor(durationInSeconds/60)
        //     const seconds = durationInSeconds % 60
        //     if (minute < 10) { minute = "0" + minute; }
        //     if (seconds < 10) { seconds = "0" + seconds; }
        //     return minutes + ':' + seconds;
        // }
        const songList = document.getElementById('song-list')
        const songDetails = document.createElement ('div')
        songDetails.classList.add('d-flex', 'align-items-center', 'mt-2')
        songDetails.innerHTML = `
        <div
        class="col-1 pe-0 d-flex justify-content-end text-grey"
        >
        ${num}
        </div>
        <div
            class="col-2 p-0 d-flex justify-content-center mx-1 chosen-song"
        >
            <img
            src="${canzone.data[i].album.cover_medium}"
            alt=""
            class="w-75"
            />
        </div>
        <div class="col-4 p-0 text-truncate">
            ${canzone.data[i].title}
        </div>
        <div class="col-2 text-grey text-truncate d-flex justify-content-end">
        ${canzone.data[i].rank}
        </div>
        <div class="col-2 text-grey d-flex justify-content-end">${minute}:${seconds}</div
        `
        songList.appendChild(songDetails) 

        // VERSIONE MOBILE
        const listSongsMobile = document.getElementById('lista-mobile')
        const songMobile = document.createElement('div')
        songMobile.classList.add('row', 'mt-2')
        songMobile.innerHTML = `
        <div class="col d-flex align-items-center mt-3">
            <div class="col-1">
            <p class="m-0 fw-bold">${num}</p>
            </div>
            <div class="col-3 chosen-song">
            <img
                src="${canzone.data[i].album.cover_medium}"
                alt=""
                class="w-100"
            />
            </div>
            <div class="col ms-2 text-truncate">
            <p class="text-truncate m-0 fs-6">${canzone.data[i].title}</p>
            <p class="text-truncate m-0 text-grey">${canzone.data[i].rank} visualizzazioni</p>
            </div>
            <div class="col-1 d-flex justify-content-end">
            <a href="#"
                ><i class="bi bi-three-dots-vertical text-white"></i
            ></a>
            </div>
        </div>
        `
        listSongsMobile.appendChild(songMobile)
    }
}





const getArtist = function() {
    fetch ('https://striveschool-api.herokuapp.com/api/deezer/artist/madonna', {
    })
    .then((res) => {
        if(res.ok){
            return res.json()
        } else {
            throw new Error ('Errore nella response')
        }
    })
    .then((artist) => { 
        createArtist(artist)
        console.log(artist)
        const getTrackList = function (){
            fetch ('https://striveschool-api.herokuapp.com/api/deezer/artist/290/top?limit=50', {     
            })
            .then((res) => {
                if(res.ok){
                    return res.json()
                } else {
                    throw new Error ('Errore nella response della tracklist')
                }
            })
            .then((song) => {
                getSongs(song)
                console.log(song)
            })
            .catch((err) => console.log(err))
        }
        getTrackList()
    })
    .catch((err) => {console.log(err)})
}
getArtist()

