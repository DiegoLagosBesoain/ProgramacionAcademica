/*
function onEdit(e) {
  const hoja = e.source.getActiveSheet();
  const rangoEditado = e.range;

  // Definir el rango de las celdas del calendario
  const rangoCalendario = hoja.getRange(2, 2, hoja.getLastRow() - 1, hoja.getLastColumn() - 1); // Ajusta el rango según corresponda

  // Verificar si el rango editado es parte del calendario
  if (!rangoCalendario.getA1Notation().includes(rangoEditado.getA1Notation())) return; // Salir si no está en el rango del calendario

  // Obtener las opciones iniciales para las listas desplegables
  const opciones = obtenerOpciones(); 

  // Obtener todas las selecciones realizadas en el calendario
  const seleccionados = obtenerSeleccionados(hoja, rangoCalendario);
  
  // Crear una lista de las opciones restantes, eliminando las seleccionadas
  const opcionesRestantes = opciones.filter(opcion => !seleccionados.includes(opcion));
  
  // Aplicar la nueva validación a todas las celdas del calendario
  aplicarValidacion(hoja, rangoCalendario, opcionesRestantes);
}

function obtenerSeleccionados(hoja, rangoCalendario) {
  const celdas = rangoCalendario.getValues(); // Obtener los valores del calendario
  const seleccionados = [];
  
  // Recorrer todas las celdas y guardar las opciones seleccionadas
  celdas.forEach(fila => {
    fila.forEach(celda => {
      if (celda) { // Si la celda tiene un valor, agregarlo a la lista de seleccionados
        seleccionados.push(celda);
      }
    });
  });
  
  return seleccionados;
}

function obtenerOpciones() {
  // Definir las opciones para las listas desplegables (pueden ser estáticas o provenir de otra fuente)
  return ["Opción 1", "Opción 2", "Opción 3", "Opción 4", "Opción 5"];
}

function aplicarValidacion(hoja, rango, opciones) {
  const validacion = SpreadsheetApp.newDataValidation()
    .requireValueInList(opciones, true)
    .setAllowInvalid(false)
    .build();
  
  // Aplicar validación de listas desplegables a todas las celdas en el rango
  rango.setDataValidation(validacion); 
}
*/
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_data_maestro=hojasActuales.getSheetByName("DATOS MAESTRO")
var data_maestro_para_triggers=hoja_data_maestro.getDataRange().getDisplayValues()  

function onEdit(e) {

  const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
  const hoja_detalles = hojasActuales.getSheetByName("DETALLES SEMESTRE")
  var datos_detalle_malla=hoja_detalles.getDataRange().getDisplayValues()
  let data_maestro_para_triggers1=data_maestro_para_triggers.map((elemento,idx)=>elemento.concat(datos_detalle_malla[idx]))
  datos_detalle_malla=null
  const hoja = e.source.getActiveSheet(); // Hoja donde ocurre la edición
  const rangoEditado = e.range; // Celda que fue editada
  const valorEditado = rangoEditado.getValue(); // Nuevo valor de la celda
  const totalFilas = hoja.getLastRow();
  const totalColumnas = hoja.getLastColumn();
  
  // Verificar si la edición no está en la primera fila o columna
  if (rangoEditado.getRow() > 1 && rangoEditado.getColumn() > 1) {
    const bloques = [...data_maestro_para_triggers1]; // Define aquí tu data maestro
    const entrada_real = bloques.find((bloque) =>
      (valorEditado.split(" ")[0] == bloque[2]) &&  // Curso
      (valorEditado.split(" ")[2] == bloque[1]) &&  // Sección
      (valorEditado.split(" ")[3] == bloque[6])
    );
    rangoEditado.setComment(null).setFontColor("#000000");
    // Si la celda está vacía, limpia el fondo y elimina el comentario
    if (valorEditado === "") {
      rangoEditado.setBackground("#FFFFFF").setFontColor("#000000"); // Fondo blanco
       // Eliminar comentario
    } else if (entrada_real) {
      // Asignar el color basado en la entrada
      if (entrada_real[7] == "1") {
        rangoEditado.setBackground("#fef2cb"); // Amarillo claro
      } else if (entrada_real[7] == "2") {
        rangoEditado.setBackground("#e2efd9"); // Verde claro
      } else if (entrada_real[7] == "3") {
        rangoEditado.setBackground("#fbe4d5"); // Naranja claro
      } else if (entrada_real[7] == "4") {
        rangoEditado.setBackground("#deeaf6"); // Azul claro
      }else if (entrada_real[20] != "") {
        rangoEditado.setFontColor("#FF0000");; // Azul claro
      }
       else {
        rangoEditado.setBackground("#FFFFFF").setFontColor("#000000"); // Fondo blanco (default)
      }
    }
  }
}
function destacar_por_semestre_visualizacion(valorEditado,celda) {
  
  
  
  // Verificar si la edición no está en la primera fila o columna

    const bloques = [...data_maestro_para_triggers]; // Define aquí tu data maestro
    const entrada_real = bloques.find((bloque) =>
      (valorEditado.split(" ")[0] == bloque[2])   // Curso
        // Sección
      
    );
    
    // Si la celda está vacía, limpia el fondo y elimina el comentario
    if (valorEditado === "") {
      celda.setBackground("#FFFFFF"); // Fondo blanco
       // Eliminar comentario
    } else if (entrada_real) {
      // Asignar el color basado en la entrada
      if (entrada_real[7] == "1") {
        celda.setBackground("#fef2cb"); // Amarillo claro
      } else if (entrada_real[7] == "2") {
        celda.setBackground("#e2efd9"); // Verde claro
      } else if (entrada_real[7] == "3") {
        celda.setBackground("#fbe4d5"); // Naranja claro
      } else if (entrada_real[7] == "4") {
        celda.setBackground("#deeaf6"); // Azul claro
      }else if (entrada_real[20] != "") {
        //caleda.setFontColor("#FF0000");; // Azul claro
      } else {
        celda.setBackground("#FFFFFF"); // Fondo blanco (default)
      }
    }
  
}


