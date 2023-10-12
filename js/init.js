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

let listaDePeliculas = [];

document.addEventListener("DOMContentLoaded", function(e){
  getJSONData(url).then(function(resultObj){
      if (resultObj.status === "ok"){
        listaDePeliculas = resultObj.data;
          console.log(listaDePeliculas);
          }
          //Buscador
          document.getElementById("btnBuscar").addEventListener('click', () => {
            listContainer.innerHTML = "" //Vacia la lista
            let searchTerm = document.getElementById("inputBuscar").value.toUpperCase();
            console.log(searchTerm)
            mostrarDetallesPelicula(searchTerm);
          }); // Aqui termina el evento del boton buscar

          //funcion para mostrar los resultados de la busqueda
          function mostrarDetallesPelicula(searchTerm){
            listaDePeliculas.forEach(p => {
                if (searchTerm != "" && p.title.toUpperCase().includes(searchTerm) || searchTerm != "" && p.tagline.toUpperCase().includes(searchTerm) || searchTerm != "" && p.overview.toUpperCase().includes(searchTerm)){
                    let newElement = document.createElement('li')
                    newElement.classList.add("container")
                    newElement.style.opacity = 0
                    newElement.style.transition = "opacity 0.7s ease-in"
                    newElement.innerHTML = convertToHtmlElem(p);
                    listContainer.appendChild(newElement)
                    newElement.addEventListener("click", () => {
                      mostrarOffcanvas(p);
                  });
                }
                else p.genres.forEach(element => {
                  if (element.name.toUpperCase().includes(searchTerm)){
                    let newElement = document.createElement('li')
                    newElement.classList.add("container")
                    newElement.style.opacity = 0
                    newElement.style.transition = "opacity 0.7s ease-in"
                    newElement.innerHTML = convertToHtmlElem(p);
                    listContainer.appendChild(newElement);
                    newElement.addEventListener("click", () => {
                      mostrarOffcanvas(p);
                  });
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
      }; //Aqui termina la funcion mostrarDetallesPelicula     
  }); //Aqui termina el getJsonData

   // Función para mostrar el offcanvas con los detalles de la película
   function mostrarOffcanvas(pelicula) {
    const generos = pelicula.genres.map((genre) => genre.name).join(" - ");
    const tituloPelicula = document.getElementById("tituloPelicula");
    const descripcionPelicula = document.getElementById("descripcionPelicula");
    const nombreGeneros = document.getElementById("nombreGeneros");
    const anioPelicula = document.getElementById("anioPelicula");
    const runtimePelicula = document.getElementById("runtimePelicula");
    const presupuestoPelicula = document.getElementById("presupuestoPelicula");
    const ganaciaPelicula = document.getElementById("ganaciaPelicula");
    tituloPelicula.textContent = pelicula.title;
    descripcionPelicula.textContent = pelicula.overview;
    nombreGeneros.textContent = generos;
    const fechaLanzamiento = pelicula.release_date;
    const anioLanzamiento = new Date(fechaLanzamiento).getFullYear();
    anioPelicula.textContent = anioLanzamiento;
    runtimePelicula.textContent = pelicula.runtime + " min";
    presupuestoPelicula .textContent = "$" + pelicula.budget;
    ganaciaPelicula.textContent = "$" + pelicula.revenue;
    const offcanvas = new bootstrap.Offcanvas(document.getElementById("offcanvas"));
    offcanvas.show(); 
  }; //Aqui termina la funcion que muestra el offcanvas

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

});// Aqui termina el DOMContentLoaded

