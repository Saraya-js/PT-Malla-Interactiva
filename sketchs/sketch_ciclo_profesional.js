let queryUrl, data;

// Función preload() de p5.js que se ejecuta antes de setup().
// Se utiliza para cargar recursos externos, en este caso, datos JSON.
function preload() {
  queryUrl =
    "https://wiki.ead.pucv.cl/api.php?action=ask&format=json&query=%5B%5BCategor%C3%ADa%3AAsignatura%5D%5D%5B%5BCurr%C3%ADculum%3A%3ADecreto%20Acad%C3%A9mico%2037%2F2017%5D%5DOR%5B%5BCurr%C3%ADculum%3A%3ADecretos%20Acad%C3%A9micos%2035%20y%2037%2F2017%5D%5D%7C%3FClave%7C%3FCr%C3%A9ditos%7C%3FCiclo%20Formativo%7C%3F%C3%81rea%20de%20Estudio%7C%3FCarreras%20Relacionadas%7Cformat%20%3D%20table%7Climit%20%3D%20999&api_version=2&utf8=1";
  data = loadJSON(queryUrl, gotData, "jsonp"); // Cargar datos JSON. Cuando esté listo, se llamará a gotData().
}

// Función que se llama después de cargar el JSON.
function gotData() {
  console.log(data); // Mostrar los datos en la consola para depuración.
  constructObjects(); // Construir los objetos HTML a partir de los datos JSON.
}

// Función setup() de p5.js que se ejecuta una vez al inicio.
function setup() {
  // No hay contenido aquí porque estamos construyendo los objetos en gotData().
}

// Función para construir objetos HTML a partir de datos JSON.
function constructObjects() {
  let contador = 0
  // Recorrer cada resultado en data.query.results.
  for (let key in data.query.results) {
    let asig = data.query.results[key]; // 'asig' es una variable temporal que se renueva por cada nodo de data.query.results

    // Extraer datos relevantes del objeto actual.
    let title = asig.fulltext; // título de la asignatura
    let url = asig.fullurl; // link a la página en Casiopea

    // Verificar si existe la propiedad y si tiene elementos. De lo contrario, mostrar "No disponible".
    let code =
      asig.printouts.Clave && asig.printouts.Clave.length > 0
        ? asig.printouts.Clave.join(", ")
        : "No disponible";

    let credits =
      asig.printouts.Clave && asig.printouts["Créditos"].length > 0
        ? asig.printouts["Créditos"].join(", ")
        : "No disponible";

    let areaOfStudy =
      asig.printouts["Área de Estudio"] &&
        asig.printouts["Área de Estudio"].length > 0
        ? asig.printouts["Área de Estudio"].join(", ")
        : "No disponible";
    let program =
      asig.printouts["Carreras Relacionadas"] &&
        asig.printouts["Carreras Relacionadas"].length > 0
        ? asig.printouts["Carreras Relacionadas"].join(", ")
        : "No disponible";
    let ciclo =
      asig.printouts["Ciclo Formativo"] &&
        asig.printouts["Ciclo Formativo"].length > 0
        ? asig.printouts["Ciclo Formativo"].join(", ")
        : "No disponible";

    // Aquí se setea que ciclo filtrar
    if (ciclo.includes("Ciclo Profesional y de Magister")) {
      contador = contador + 1;
    } else {
      continue;
    }


    // Crear un div con la información extraída y añadir al documento.
    let asigContainer = createDiv(
      "<h4>" +
      code + "<span class='credits'>" + credits + "</span><br><a href=" +
      url + ">" + title + "</a></h4>" +
      areaOfStudy +
      " - " +
      program
    );
    asigContainer.id(code); // le doy un id único a cada div a partir de la clave de la asignatura
    asigContainer.class("asig " + areaOfStudy); // cada div de asignatura tiene una clase común 'aig' y otra por área de estudio


    asigContainer.class("asig " + areaOfStudy); // cada div de asignatura tiene una clase común 'aig' y otra por área de estudio

    // ahora vamos a darle la altura de acuerdo a los créditos

    let creditsNum = parseFloat(credits); // convertir de texto a número

    let heightVal = map(creditsNum, 2, 12, 120, 600);
    asigContainer.style('height', heightVal + 'px');
  }
  console.log(contador)
}

preload()