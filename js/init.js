const url = 'https://japceibal.github.io/japflix_api/movies-data.json';
var listContainer = document.getElementById("lista")

let getJSONData = function(url){
    let result = {};
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
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        return result;
    });
}

let currentProductsArray = [];

document.addEventListener("DOMContentLoaded", function(e){
  getJSONData(url).then(function(resultObj){
      if (resultObj.status === "ok"){
          currentProductsArray = resultObj.data;
          console.log(currentProductsArray);
      }
          //Buscador
          document.getElementById("btnBuscar").addEventListener('click', () => {
            listContainer.innerHTML = "" //Vacia la lista
            let searchTerm = document.getElementById("inputBuscar").value.toUpperCase();
            console.log(searchTerm)
            showProductList(searchTerm);
          })

          function showProductList(searchTerm){
            currentProductsArray.forEach(p => {
                if (searchTerm != "" && p.title.toUpperCase().includes(searchTerm) || searchTerm != "" && p.tagline.toUpperCase().includes(searchTerm) || searchTerm != "" && p.overview.toUpperCase().includes(searchTerm)){
                    let newElement = document.createElement('div')
                    newElement.classList.add("container")
                    newElement.style.opacity = 0
                    newElement.style.transition = "opacity 0.7s ease-in"
                    newElement.innerHTML = convertToHtmlElem(p)
                    listContainer.appendChild(newElement)
                }
                else p.genres.forEach(element => {
                  if (element.name.toUpperCase().includes(searchTerm)){
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
             
          let infoPeliculas = contenedorSuperior(currentProductsArray)
          detalle.innerHTML +=  infoPeliculas
        })
      }
  

 /*  getJSONData(url).then((response) => {
      detallesDePelicula = response.data  
      let infoPeliculas = contenedorSuperior(detallesDePelicula)
      detalle.innerHTML +=  infoPeliculas
      }); */


  //Plantilla menú despegable
  function contenedorSuperior(p) {
    const generos = p.genres.map((genero) => genero.name).join(', ')

   
    
      return `<div class="offcanvas offcanvas-start show" tabindex="-1" id="offcanvas" aria-labelledby="offcanvasLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasLabel">${p.title}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        ${p.overview}
      </div>
      <div id="generos">${generos}</div>
      <div class="dropdown mt-3">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
          More
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item">Año: ${p.year}</a></li>
          <li><a class="dropdown-item">Runtime: ${p.runtime}</a></li>
          <li><a class="dropdown-item">Budget: ${p.budget}</a></li>
          <li><a class="dropdown-item">Revenue: ${p.revenue}</a></li>
        </ul>
      </div>
    </div>`
    } 
  });

  function convertToHtmlElem(p){
      return `<li>
        <div class="card img-card-fit">
        <div class="card-content">
          <h5 class="card-title">${p.title}</h5>
          <p class="card-text">${p.tagline}</p>
          <div class="justify-content-right">${getEstrellasHTML(p.vote_average)}</div>
        </div>
      </div>
    </li>` 
  }


  //Obtiene la cantidad de estrellas de un comentario desde la API
  function getEstrellasHTML(puntos){
    let puntaje = puntos/2;
    respuesta = ""
    for (let index = 1; index < 6; index++) {
        if (index<=puntaje) {
            respuesta += `<span class="fa fa-star checked"></span>`
        } else {
            respuesta += `<span class="fa fa-star"></span>`
        }
    }
    return respuesta;
  };

  const detalle = document.getElementById("detalle");

});


/* listContainer.addEventListener("click", function (event) {
  const clickedElement = event.target;

  if (relatedProductElement) {
    const productId = relatedProductElement.getAttribute("data-id");
    redirigirAInfoProducto(productId);
  }
}) */