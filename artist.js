const createArtist = function(){
    const artistCard = document.getElementById('hero')
    // const navBar = document.createElement('section')
//     navBar.innerHTML = `
//     <nav
//     class="d-md-flex justify-content-between pb-3 d-mobile-none pt-3 px-3"
//   >
//     <div class="arrows d-flex gap-3">
//       <div
//         class="nav-arrow-left bg-secondary-subtle d-flex p-2 justify-content-center align-items-center"
//       >
//         <a href="#">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="22"
//             height="22"
//             fill="currentColor"
//             class="bi bi-chevron-left text-white"
//             viewBox="0 0 16 16"
//           >
//             <path
//               fill-rule="evenodd"
//               d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
//             /></svg
//         ></a>
//       </div>
//       <div
//         class="nav-arrow-right bg-secondary-subtle d-flex p-2 align-items-center"
//       >
//         <a href="#">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="22"
//             height="22"
//             fill="currentColor"
//             class="bi bi-chevron-right text-white"
//             viewBox="0 0 16 16"
//           >
//             <path
//               fill-rule="evenodd"
//               d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
//             /></svg
//         ></a>
//       </div>
//     </div>
//     <div class="dropdown">
//       <button
//         class="btn btn-sm bg-black opacity-75 dropdown-toggle rounded-pill d-flex align-items-center gap-1"
//         type="button"
//         data-bs-toggle="dropdown"
//         aria-expanded="false"
//       >
//         <img
//           src="/assets/imgs/main/image-1.jpg"
//           width="30px"
//           alt="PP"
//           class="rounded-pill"
//         />
//         Lidia Nautilus ...
//       </button>
//       <ul class="dropdown-menu">
//         <li><a class="dropdown-item" href="#">....</a></li>
//         <li><a class="dropdown-item" href="#">...</a></li>
//         <li>
//           <a class="dropdown-item" href="#">...</a>
//         </li>
//       </ul>
//     </div>
//   </nav>
//   <section class="hero d-mobile-none">
//   <div class="w-100 d-flex gap-3 ps-2 pt-5">
//     <div class="d-flex">
//       <!-- <div class="new-song-hero-img mx-2">
//         <img
//           src="/assets/imgs/main/image-1.jpg"
//           alt="song image"
//           class="img-fluid"
//         />
//       </div> -->
//       <div class="col d-flex flex-column justify-content-between">
//         <div class="new-song-hero-header">
//           <p class="fw-semibold m-0">
//             <i class="bi bi-patch-check-fill me-1 text-info"></i
//             >Artista verificato
//           </p>
//         </div>
//         <a href="#" class="link-underline link-underline-opacity-0"
//           ><h2
//             class="new-song-hero-title fw-bold pe-2 mb-4 text-white"
//           >
//             Yellowcard
//           </h2></a
//         >
//         <p class="new-song-hero-artists">
//           3.433.158 ascoltatori mensili
//         </p>
//       </div>
//     </div>
//   </div>
// </section>
// </section>
//     `
    artistCard.appendChild(navBar)

    // ------------------------

}

const getArtist = function() {
    fetch ('https://striveschool-api.herokuapp.com/api/deezer/artist/summer', {
    })
    .then((res) => {
        if(res.ok){
            return res.json()
        } else {
            throw new Error ('Errore nella response')
        }
    })
    .then((artist) => { 
        createArtist()
        console.log(artist)})
    .catch((err) => {console.log(err)})
}
getArtist()

// const button = document.getElementById('button')
// button.addEventListener('click', getArtist())