var nombre = "";
var rut = "";
var horariosSeleccionados = [];
var horariosSeleccionados2 = [];
var horas_a_realizar=0
var horariosNoPermitidos= ["Viernes 12:30-13:20"];
var cursos_3_horas = []
var elecciones=[]
var mensaje_auxiliar
var dataProfe=[]
var cometn=[]
var exam=[]
var evaluaciones
var types

// Validar el nombre
function validarNombre() {
nombre = document.getElementById("nombre").value.trim();
console.log(nombre)

mostrarCarga(); // Muestra la animación de carga.

google.script.run
  .withSuccessHandler((respuesta) => {
    ocultarCarga(); // Oculta la animación al recibir respuesta.

    if (respuesta.success) {
      // Si la respuesta indica éxito, muestra el mensaje al usuario.
      mostrarPreguntaRut(respuesta.message);
    } else {
      // Si no es exitosa, muestra el mensaje de error al usuario.
      alert(`Error: ${respuesta.message}`);
    }
})
.withFailureHandler((error) => {
  ocultarCarga(); // Oculta la animación en caso de fallo de red o script.
  alert("Ha ocurrido un error inesperado. Intenta nuevamente más tarde.");
  console.error(error);
})
.pedirRut(nombre); // Llama al backend con el nombre.

}

// Mostrar la pregunta del RUT
function mostrarPreguntaRut(mensaje) {
  document.getElementById("pregunta1").style.display = "none";
  document.getElementById("mensajeRut").innerText = mensaje;
  document.getElementById("pregunta2").style.display = "block";
}

// Validar el RUT
function validarRut() {
rut = document.getElementById("rut").value.trim();

if (rut) {
mostrarCarga();
google.script.run
.withSuccessHandler((respuesta) => {
  ocultarCarga();

  cursos_3_horas = respuesta.cursos3; // Guardar los cursos de 3 horas
  console.log("Cursos cargados:", cursos_3_horas);
  dataProfe=respuesta.data_profe

  if (respuesta.success) {
    horas_a_realizar = respuesta.horas_totales;
    mensaje_auxiliar=respuesta.message
    if (respuesta.restriccion_horario_plan_comun) {
      horariosNoPermitidos = horariosNoPermitidos.concat([
        "Martes 17:30-18:20",
        "Martes 18:30-19:20",
        "Viernes 10:30-11:20",
        "Viernes 11:30-12:20",
      ]);
    }

    nombre = respuesta.nombre;

    // Mostrar pregunta opcional si hay cursos de 3 horas, sino pasar a pregunta3
    
  mostrarCursos(respuesta.message);
    
  } else {
    alert(`Error: ${respuesta.message}`);
  }
})
.withFailureHandler(errorCarga)
.validarRut(rut, nombre);
} else {
alert("Por favor, ingresa tu RUT.");
}
}

// Mostrar cursos
function cambiarPregunta(actual, siguiente) {
  document.getElementById(actual).style.display = "none"; // Oculta la pregunta actual
  document.getElementById(siguiente).style.display = "block"; // Muestra la siguiente pregunta
}
function cambiarExamen(actual, siguiente) {
  document.getElementById("preguntaExamen").style.display = "none"; 
  if(cursos_3_horas.length>0){
    document.getElementById("preguntaOpcional").style.display = "block"; // Muestra la siguiente pregunta
  }
  else{
  document.getElementById("pregunta3").style.display = "block";

  }
}      
function mostrarCursos(cursos) {
  document.getElementById("pregunta2").style.display = "none";
  document.getElementById("mensajeCursos").innerText = cursos;
  document.getElementById("pregunta3").style.display = "block";
}
function mostrarCursos2(cursos) {
  document.getElementById("preguntaOpcional").style.display = "none";
  document.getElementById("mensajeCursos").innerText = cursos;
  document.getElementById("pregunta3").style.display = "block";
}
function terminar_formulario() {
  document.getElementById("preguntaAbierta").style.display = "none";
  
  document.getElementById("preguntafinal").style.display = "block";
  mostrarCarga()
  google.script.run
      .withSuccessHandler(() => {
        ocultarCarga();
        console.log("Comentarios guardados exitosamente.");
        
      })
      .withFailureHandler(errorCarga)
      .enviar_datos(nombre,rut,horariosSeleccionados2,elecciones,cometn,exam,evaluaciones,types); 

}
function salto(){
  if(cursos_3_horas.length>0){
    mostrarPreguntaOpcional(cursos_3_horas)
    
  }
  else{
    mostrarPreguntaExamen()
  }

}

// Mostrar el calendario para seleccionar horarios


function agregarBotonRegresarPreguntaExamen() {
const pregunta4 = document.getElementById("preguntaExamen");
const botonContinuar = document.getElementById("guardarHorarios"); // Botón de continuar

// Verifica si el botón ya existe para evitar duplicados
if (!document.getElementById("botonRegresarPregunta4")) {
const botonRegresar = document.createElement("button");
botonRegresar.id = "botonRegresarPregunta4";
botonRegresar.className = "submit-btn";
botonRegresar.textContent = "Regresar";

// Define el evento para regresar a la Pregunta Opcional
botonRegresar.onclick = () => {
document.getElementById("pregunta4").style.display = "none";
document.getElementById("preguntaOpcional").style.display = "block";
horariosSeleccionados=[]
};

// Inserta el botón de regresar antes del botón de continuar
pregunta4.insertBefore(botonRegresar, botonContinuar);
}
}


function createCell(content, className) {
const cell = document.createElement("div");
cell.className = className;
cell.innerText = content;
return cell;
}

function mostrarCarga() {
document.getElementById("loading-indicator").style.display = "flex";
desactivarBotones(true);
}

// Ocultar el indicador de carga
function ocultarCarga() {
document.getElementById("loading-indicator").style.display = "none";
desactivarBotones(false);
}

// Desactivar o activar botones
function desactivarBotones(estado) {
const botones = document.querySelectorAll("button");
botones.forEach(boton => {
boton.disabled = estado;
});
}
function mostrarConfirmacion(mensaje) {
ocultarCarga(); // Ocultar el indicador
alert(mensaje);
}

// Manejo de errores
function errorCarga(error) {
ocultarCarga(); // Ocultar el indicador
alert("Ocurrió un error: " + error.message);
}
function mostrarPreguntaOpcional(cursos3Horas) {
document.getElementById("pregunta3").style.display = "none";
const contenedor = document.getElementById("contenedor-preferencias");
contenedor.innerHTML = ""; // Limpiar contenido previo
console.log("Mostrando pregunta opcional:", cursos3Horas);

cursos3Horas.forEach((curso, index) => {
const preguntaDiv = document.createElement("div");
preguntaDiv.setAttribute("data-valor", `${curso[0]} ${curso[1]}`);
preguntaDiv.innerHTML = `
<h4>${curso[2]} seccion ${curso[1]}</h4>
<label>
  <input type="radio" name="opcionHoras${index}" value="3-juntas" />
  3 horas continuas
</label><br />
<label>
  <input type="radio" name="opcionHoras${index}" value="2+1-separadas" />
  2 horas juntas y 1 hora separada
</label>
`;
contenedor.appendChild(preguntaDiv);
});

document.getElementById("preguntaOpcional").style.display = "block";
}
function mostrarPreguntaAbierta() {
document.getElementById("preguntaTipo").style.display = "none";
const contenedor = document.getElementById("contenedor-comentarios");
contenedor.innerHTML = ""; // Limpiar contenido previo

// Usamos un fragmento de documento para mejorar el rendimiento
;

dataProfe.forEach((curso, index) => {
const preguntaDiv = document.createElement("div");
preguntaDiv.setAttribute("data-valor", `${curso[2]} ${curso[3]}`);

// Creamos un ID único para cada campo de comentario
const comentarioId = `comentario-${index}`;

preguntaDiv.innerHTML = `
<h4>${curso[1]} seccion ${curso[3]}</h4>
<label>
  <input class="response-input" type="text" id="${comentarioId}" placeholder="Comentarios o sugerencias:" />
</label>
`;

contenedor.appendChild(preguntaDiv);
});


document.getElementById("preguntaAbierta").style.display = "block";
}

function validarPreferenciasHoras() {
const contenedor = document.getElementById("contenedor-preferencias");
const preferencias = [];
let faltaSeleccion = false;

Array.from(contenedor.children).forEach((preguntaDiv, index) => {
const seleccion = preguntaDiv.querySelector(`input[name="opcionHoras${index}"]:checked`);
if (!seleccion) {
faltaSeleccion = true;
return;
}
preferencias.push({
curso: preguntaDiv.getAttribute("data-valor"),
preferencia: seleccion.value,
});
});

if (faltaSeleccion) {
alert("Por favor, selecciona una opción para cada curso.");
return;
}

console.log("Preferencias seleccionadas:", preferencias);
mostrarCarga();
elecciones=[...preferencias]

// Enviar preferencias al backend
google.script.run
.withSuccessHandler(() => {
ocultarCarga();
console.log("Preferencias guardadas exitosamente.");
mostrarPreguntaExamen(); 
})
.withFailureHandler(errorCarga)
.todo_bien()
}
function verificarContinuidad(horaActual, horaSiguiente) {
const horas = [
"8:30-9:20", "9:30-10:20", "10:30-11:20", "11:30-12:20",
"12:30-13:20", "13:30-14:20", "14:30-15:20", "15:30-16:20",
"16:30-17:20", "17:30-18:20", "18:30-19:20"
];
const indiceActual = horas.indexOf(horaActual);
const indiceSiguiente = horas.indexOf(horaSiguiente);

return indiceSiguiente === indiceActual + 1;
}

// Función para ordenar horas
function ordenarHoras(a, b) {
const horas = [
"8:30-9:20", "9:30-10:20", "10:30-11:20", "11:30-12:20",
"12:30-13:20", "13:30-14:20", "14:30-15:20", "15:30-16:20",
"16:30-17:20", "17:30-18:20", "18:30-19:20"
];
return horas.indexOf(a) - horas.indexOf(b);
}
function validar_pregunta_abierta() {
const contenedor = document.getElementById("contenedor-comentarios");
const comentarios = [];

// Itera sobre cada hijo del contenedor de comentarios
Array.from(contenedor.children).forEach((preguntaDiv) => {
// Encuentra el input de texto dentro de cada bloque
const inputTexto = preguntaDiv.querySelector('.response-input');
const comentario = inputTexto ? inputTexto.value.trim() : "";

comentarios.push({
curso: preguntaDiv.querySelector('h4').textContent, // Extrae el texto del curso
comentario: comentario || "Sin comentario", // Asigna un valor por defecto si está vacío
});
});

console.log("Comentarios seleccionados:", comentarios);
mostrarCarga();
cometn=[...comentarios]
// Enviar comentarios al backend
google.script.run
.withSuccessHandler(() => {
ocultarCarga();
console.log("Comentarios guardados exitosamente.");
terminar_formulario();
})
.withFailureHandler(errorCarga)
.todo_bien(); // Ajusta este método según tu backend
}
function mostrarPreguntaExamen() {
if(cursos_3_horas.length>0){
console.log("entre1")
document.getElementById("preguntaOpcional").style.display = "none";
}
else{
console.log("entre2")
document.getElementById("pregunta3").style.display = "none";

}

const contenedor = document.getElementById("contenedor-examen");
contenedor.innerHTML = ""; // Limpiar contenido previo


dataProfe.forEach((curso, index) => {
const preguntaDiv = document.createElement("div");
preguntaDiv.setAttribute("data-valor", `${curso[2]} ${curso[3]}`);
preguntaDiv.innerHTML = `
<h4>${curso[1]} seccion ${curso[3]}</h4>
<label>
  <input type="radio" name="opcionHoras${index}" value="SI" />
  Con examen
</label><br />
<label>
  <input type="radio" name="opcionHoras${index}" value="NO" />
  Sin examen
</label>
`;
contenedor.appendChild(preguntaDiv);
});

document.getElementById("preguntaExamen").style.display = "block";
}

function validar_pregunta_examen() {
const contenedor = document.getElementById("contenedor-examen");
const examenes = [];
let faltaSeleccion = false;

Array.from(contenedor.children).forEach((preguntaDiv, index) => {
const seleccion = preguntaDiv.querySelector(`input[name="opcionHoras${index}"]:checked`);
if (!seleccion) {
faltaSeleccion = true;
return;
}
examenes.push({
curso: preguntaDiv.getAttribute("data-valor"),
preferencia: seleccion.value,
});
});

if (faltaSeleccion) {
alert("Por favor, selecciona una opción para cada curso.");
return;
}

console.log("Preferencias seleccionadas:", examenes);
mostrarCarga();
exam=[...examenes]

// Enviar preferencias al backend
google.script.run
.withSuccessHandler(() => {
ocultarCarga();
console.log("Preferencias guardadas exitosamente.");
mostrarPreguntaEvaluaciones(); // Avanzar a pregunta3
})
.withFailureHandler(errorCarga)
.todo_bien()
}
function mostrarPreguntaEvaluaciones() {
document.getElementById("preguntaExamen").style.display = "none";
const contenedor = document.getElementById("contenedor-evaluaciones");
contenedor.innerHTML = ""; // Limpiar contenido previo


dataProfe.forEach((curso, index) => {
const preguntaDiv = document.createElement("div");
preguntaDiv.setAttribute("data-valor", `${curso[2]} ${curso[3]}`);
preguntaDiv.innerHTML = `
  <h4>${curso[1]} seccion ${curso[3]}</h4>
  <label>
    <span>Selecciona la cantidad de evaluaciones que quieres: </span>
    <select id="numeroSeleccionado${index}">
      ${Array.from({ length: 7 }, (_, i) => `<option value="${i}">${i}</option>`).join('')}
    </select>
  </label>
`;
contenedor.appendChild(preguntaDiv);
});

document.getElementById("preguntaEvaluaciones").style.display = "block";
}
function validar_pregunta_Evaluaciones() {
const contenedor = document.getElementById("contenedor-evaluaciones");
const cant_evaluaciones = [];
let faltaSeleccion = false;

Array.from(contenedor.children).forEach((preguntaDiv) => {
const curso = preguntaDiv.getAttribute("data-valor"); // Curso y sección
const select = preguntaDiv.querySelector("select"); // Seleccionar el desplegable
const cantidadEvaluaciones = select.value; // Valor seleccionado

cant_evaluaciones.push({
curso: curso,
nevaluaciones: cantidadEvaluaciones,
});
});

console.log("Preferencias seleccionadas: ", cant_evaluaciones);
mostrarCarga();
evaluaciones = [...cant_evaluaciones]

// Enviar preferencias al backend
google.script.run
.withSuccessHandler(() => {
ocultarCarga();
console.log("Preferencias guardadas exitosamente.");
mostrarPreguntaTipo(); // Avanzar a pregunta3
})
.withFailureHandler(errorCarga)
.todo_bien()
}
function mostrarPreguntaTipo() {
document.getElementById("preguntaEvaluaciones").style.display = "none";
const contenedor = document.getElementById("contenedor-tipo");
contenedor.innerHTML = ""; // Limpiar contenido previo


dataProfe.forEach((curso, index) => {
const preguntaDiv = document.createElement("div");
preguntaDiv.setAttribute("data-valor", `${curso[2]} ${curso[3]}`);
preguntaDiv.innerHTML = `
<h4 class="pregunta-titulo">${curso[1]} seccion ${curso[3]}</h4>
<div class="opcion-grupo">
  <label>
    <input type="radio" name="opcionHoras${index}" value="" />
    No aplica
  </label>
  <label>
    <input type="radio" name="opcionHoras${index}" value="TARDE" />
    19:30-21:20
  </label>
  <label>
    <input type="radio" name="opcionHoras${index}" value="AYUDANTIA" />
    Ayudantía
  </label>
  <label>
    <input type="radio" name="opcionHoras${index}" value="CLASE" />
    Clase
  </label>
  <label>
    <input type="radio" name="opcionHoras${index}" value="LABORATORIO" />
    Laboratorio
  </label>
</div>
`;
contenedor.appendChild(preguntaDiv);
});

document.getElementById("preguntaTipo").style.display = "block";
}
function validarPreferenciasTipo() {
const contenedor = document.getElementById("contenedor-tipo");
const tipos = []; // Almacena las preferencias seleccionadas

// Recorre cada bloque dentro del contenedor
Array.from(contenedor.children).forEach((preguntaDiv, index) => {
const curso = preguntaDiv.querySelector(".pregunta-titulo").textContent; // Obtiene el título del curso
const seleccion = preguntaDiv.querySelector(`input[name="opcionHoras${index}"]:checked`); // Busca la opción seleccionada

// Valida si hay una selección
if (seleccion) {
tipos.push({
  curso: curso,
  preferencia: seleccion.value,
});
} else {
// Si no hay selección, muestra un mensaje y termina la función
alert(`Por favor selecciona una opción para: ${curso}`);
return;
}
});

// Si todas las preguntas tienen respuesta, continúa
console.log("Preferencias seleccionadas:", tipos);
mostrarCarga();
types = [...tipos]
// Opcional: Enviar las preferencias al backend
google.script.run
.withSuccessHandler(() => {
ocultarCarga();
console.log("Preferencias guardadas exitosamente.");
mostrarPreguntaAbierta(); // Avanzar a pregunta3

})
.withFailureHandler(errorCarga)
.todo_bien();
}





