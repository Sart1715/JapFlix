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
          }); // Aqui termina el evento del boton buscar

          //funcion para mostrar los resultados de la busqueda
          function showProductList(searchTerm){
            currentProductsArray.forEach((p, index) => {
                if (searchTerm != "" && p.title.toUpperCase().includes(searchTerm) || searchTerm != "" && p.tagline.toUpperCase().includes(searchTerm) || searchTerm != "" && p.overview.toUpperCase().includes(searchTerm)){
                    let newElement = document.createElement('li')
                    newElement.classList.add("container")
                    newElement.style.opacity = 0
                    newElement.style.transition = "opacity 0.7s ease-in"
                    newElement.innerHTML = convertToHtmlElem(p);
                    newElement.setAttribute('data-index', index);
                    listContainer.appendChild(newElement)
                    console.log(index)
                }
                else p.genres.forEach((element, index) => {
                  if (element.name.toUpperCase().includes(searchTerm)){
                    let newElement = document.createElement('li')
                    newElement.classList.add("container")
                    newElement.style.opacity = 0
                    newElement.style.transition = "opacity 0.7s ease-in"
                    newElement.innerHTML = convertToHtmlElem(p);
                    newElement.setAttribute('data-index', index);
                    listContainer.appendChild(newElement)
                    console.log(index)
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
         }); //Aqui termina el forEach inicial dentro de la funcion showProductList
      }; //Aqui termina la funcion showProductList
  
      listContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'li') {
          // Obtiene el índice almacenado en el atributo data-index del elemento <li>
          const selectedIndex = event.target.getAttribute('data-index');
          
          // Asegúrate de que el índice sea válido
          if (selectedIndex !== null) {
            // Muestra el offcanvas con los detalles de la película seleccionada
            const peliculaSeleccionada = currentProductsArray[selectedIndex];
            let generos = currentProductsArray[selectedIndex].genres;
            const nombresDeGeneros = generos.map((genero) => genero.name);
            const fechaLanzamiento = currentProductsArray[selectedIndex].release_date;
            const anioLanzamiento = new Date(fechaLanzamiento).getFullYear();
            mostrarOffcanvas(peliculaSeleccionada, nombresDeGeneros, anioLanzamiento);
          }
        }
      });
      
  }); //Aqui termina el getJsonData

   // Función para mostrar el offcanvas con los detalles de la película
   function mostrarOffcanvas(pelicula, nomGeneros, anio) {
    // Obtén el elemento del offcanvas
     const offcanvas = document.getElementById('offcanvas');
  
     // Establece la visibilidad del offcanvas utilizando Bootstrap y JavaScript
     if (offcanvas) {
       // Muestra el offcanvas
       const bsOffcanvas = new bootstrap.Offcanvas(offcanvas);
       bsOffcanvas.show();
       
       // Actualiza el contenido del offcanvas
       const offcanvasBody = offcanvas.querySelector('.offcanvas-body');
       offcanvasBody.innerHTML = contenedorSuperior(pelicula, nomGeneros, anio);
     }
  };
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

  function convertToHtmlElem(p){
      return `
        <div class="card img-card-fit">
        <div class="card-content">
          <h5 class="card-title">${p.title}</h5>
          <p class="card-text">${p.tagline}</p>
          <div class="justify-content-right">${getEstrellasHTML(p.vote_average)}</div>
        </div>
      </div>
    ` 
  }

//Plantilla Offcanvas con menú despegable
  function contenedorSuperior(p, nameGenres, anio) {
     
    return `<div class="offcanvas offcanvas-start show" tabindex="-1" id="offcanvas" aria-labelledby="offcanvasLabel">
     <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasLabel">${p.title}</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" id="close-offcanvas"></button>
    </div>
    <div class="offcanvas-body">
    ${p.overview}
    </div>
    <div id="generos">${nameGenres[0]} - ${nameGenres[1]} - ${nameGenres[2]}</div>
    <div class="dropdown mt-3">
    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
      More
    </button>
    <ul class="dropdown-menu">
      <li><a class="dropdown-item">Año: ${anio}</a></li>
      <li><a class="dropdown-item">Runtime: ${p.runtime}</a></li>
      <li><a class="dropdown-item">Budget: ${p.budget}</a></li>
      <li><a class="dropdown-item">Revenue: ${p.revenue}</a></li>
    </ul>
    </div>
    </div>`
};

});// Aqui termina el DOMContentLoaded

