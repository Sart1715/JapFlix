const url = 'https://japceibal.github.io/japflix_api/movies-data.json';

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

let currentProductsArray = [];

document.addEventListener("DOMContentLoaded", function(e){
  getJSONData(urlActualizada).then(function(resultObj){
      if (resultObj.status === "ok"){
          currentProductsArray = resultObj.data.products
      }
  })
});

//
function convertToHtmlElem(p){
    return `<li><h2>${p.title}</h2>
    <p>${p.tagline}</p> <div>${p.vote_average}</div></li>
  </div>`
  
}


//Buscador
document.getElementById("btnBuscar").addEventListener('submit', () => {
  let searchTerm = document.getElementById("searchInput").value.toUpperCase();
  showProductList(searchTerm);
})

function showProductList(searchTerm){
  listContainer.innerHTML = "" //Vacia la lista
  currentProductsArray.forEach(p => {
      if (searchTerm != "" && p.title.toUpperCase().includes(searchTerm) || searchTerm != "" && p.tagline.toUpperCase().includes(searchTerm) || searchTerm != "" && p.overview.toUpperCase().includes(searchTerm) || searchTerm != "" && p.genre.toUpperCase().includes(searchTerm)  ){
          let newElement = document.createElement('div')
          newElement.classList.add("container")
          newElement.style.opacity = 0
          newElement.style.transition = "opacity 0.7s ease-in"
          newElement.innerHTML = convertToHtmlElem(p)
          listContainer.appendChild(newElement)
      }
  })
  if(listContainer.childNodes.length <= 0){
      let newElement = document.createElement('h3')
      newElement.style.opacity = 0
      newElement.style.transition = "opacity 0.2s"
      newElement.innerText = `No se hallaron productos con nombre ${searchTerm}`
      listContainer.appendChild(newElement)
  }
  for (let i = 0; i < listContainer.childNodes.length; i++) {
      setTimeout(()=>{
          listContainer.childNodes[i].style.opacity = 1
      },500*i)
  }
}


//Plantilla menú despegable

const contenedorSuperior = (p) => {

    return `<div class="offcanvas offcanvas-start show" tabindex="-1" id="offcanvas" aria-labelledby="offcanvasLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasLabel">${p.title}</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      ${p.overview}
    </div>
    <div>${p.genres}</div>
    <div class="dropdown mt-3">
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
        More
      </button>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item">Año: ${p.year}</a></li>
        <li><a class="dropdown-item">Runtime: ${p.runtime}</a></li>
        <li><a class="dropdown-item">Budget: ${p.budget}</a></li>
      </ul>
    </div>
  </div>`
}

getJSONData(url).then((response) => {
    detallesDePelicula = response.data
    
      eltitt.alucilePuciuleperDePsellaated = olutluyit = tsno
})


