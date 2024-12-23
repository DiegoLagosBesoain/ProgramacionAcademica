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
      }else if (entrada_real[0].includes("IOC")) {
        if(entrada_real[16]=="5"){
        rangoEditado.setBackground("#acbde2")
        }
        if(entrada_real[16]=="6"){
        rangoEditado.setBackground("#4472c4")
        }
        if(entrada_real[16]=="7"){
        rangoEditado.setBackground("#acbde2")
        }
        if(entrada_real[16]=="8"){
        rangoEditado.setBackground("#4472c4")
        }
        if(entrada_real[16]=="9"){
        rangoEditado.setBackground("#d9e2f3")
        }
        if(entrada_real[16]=="10"){
        rangoEditado.setBackground("#8eaadb")
        }
        if(entrada_real[16]=="11"){
        rangoEditado.setBackground("#2f5496")
        }
      }
      else if (entrada_real[0].includes("ICC")) {
        if(entrada_real[18]=="5"){
        rangoEditado.setBackground("#c5c5c5")
        }
        if(entrada_real[18]=="6"){
        rangoEditado.setBackground("#7b7b7b")
        }
        if(entrada_real[18]=="7"){
        rangoEditado.setBackground("#c5c5c5")
        }
        if(entrada_real[18]=="8"){
        rangoEditado.setBackground("#7b7b7b")
        }
        if(entrada_real[18]=="9"){
        rangoEditado.setBackground("#e2e2e2")
        }
        if(entrada_real[18]=="10"){
        rangoEditado.setBackground("#aeaeae")
        }
        if(entrada_real[18]=="11"){
        rangoEditado.setBackground("#606060")
        }
      }
      else if (entrada_real[0].includes("ICE")) {
        if(entrada_real[17]=="5"){
        rangoEditado.setBackground("#f8be9e")
        }
        if(entrada_real[17]=="6"){
        rangoEditado.setBackground("#de8400")
        }
        if(entrada_real[17]=="7"){
        rangoEditado.setBackground("#f8be9e")
        }
        if(entrada_real[17]=="8"){
        rangoEditado.setBackground("#de8400")
        }
        if(entrada_real[17]=="9"){
        rangoEditado.setBackground("#fbe4d5")
        }
        if(entrada_real[17]=="10"){
        rangoEditado.setBackground("#f6ae86")
        }
        if(entrada_real[17]=="11"){
        rangoEditado.setBackground("#de8400")
        }
      }
      else if (entrada_real[0].includes("ICI")) {
        if(entrada_real[15]=="5"){
        rangoEditado.setBackground("#e2efd9")
        }
        if(entrada_real[15]=="6"){
        rangoEditado.setBackground("#548135")
        }
        if(entrada_real[15]=="7"){
        rangoEditado.setBackground("#e2efd9")
        }
        if(entrada_real[15]=="8"){
        rangoEditado.setBackground("#548135")
        }
        if(entrada_real[15]=="9"){
        rangoEditado.setBackground("#e2efd9")
        }
        if(entrada_real[15]=="10"){
        rangoEditado.setBackground("#a8d08d")
        }
        if(entrada_real[15]=="11"){
        rangoEditado.setBackground("#00b050")
        }
      }
      else if (entrada_real[0].includes("ICA")) {
        if(entrada_real[19]=="5"){
        rangoEditado.setBackground("#ff99cc")
        }
        if(entrada_real[19]=="6"){
        rangoEditado.setBackground("#ff3399")
        }
        if(entrada_real[19]=="7"){
        rangoEditado.setBackground("#ff99cc")
        }
        if(entrada_real[19]=="8"){
        rangoEditado.setBackground("#ff3399")
        }
        if(entrada_real[19]=="9"){
        rangoEditado.setBackground("#f5d7f0")
        }
        if(entrada_real[19]=="10"){
        rangoEditado.setBackground("#ff99cc")
        }
        if(entrada_real[19]=="11"){
        rangoEditado.setBackground("#ff3399")
        }
      }
       else {
        rangoEditado.setBackground("#FFFFFF").setFontColor("#000000"); // Fondo blanco (default)
      }
    }
  }
}
function destacar_por_semestre_visualizacion(valorEditado,celda,data_maestro_con_detalles) {
  
  
  
  // Verificar si la edición no está en la primera fila o columna

    const bloques = data_maestro_con_detalles; // Define aquí tu data maestro
    const entrada_real = bloques.find((bloque) =>
      (valorEditado.split(" ")[0] == bloque[2])   // Curso
        // Sección
      
    );
    console.log("entrada real",entrada_real)
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
        celda.setFontColor("#FF0000");; // Azul claro
      }
      else if (entrada_real[0].includes("IOC")) {
        if(entrada_real[16]=="5"){
        celda.setBackground("#acbde2")
        }
        if(entrada_real[16]=="6"){
        celda.setBackground("#4472c4")
        }
        if(entrada_real[16]=="7"){
        celda.setBackground("#acbde2")
        }
        if(entrada_real[16]=="8"){
        celda.setBackground("#4472c4")
        }
        if(entrada_real[16]=="9"){
        celda.setBackground("#d9e2f3")
        }
        if(entrada_real[16]=="10"){
        celda.setBackground("#8eaadb")
        }
        if(entrada_real[16]=="11"){
        celda.setBackground("#2f5496")
        }
      }
      else if (entrada_real[0].includes("ICC")) {
        if(entrada_real[18]=="5"){
        celda.setBackground("#c5c5c5")
        }
        if(entrada_real[18]=="6"){
        celda.setBackground("#7b7b7b")
        }
        if(entrada_real[18]=="7"){
        celda.setBackground("#c5c5c5")
        }
        if(entrada_real[18]=="8"){
        celda.setBackground("#7b7b7b")
        }
        if(entrada_real[18]=="9"){
        celda.setBackground("#e2e2e2")
        }
        if(entrada_real[18]=="10"){
        celda.setBackground("#aeaeae")
        }
        if(entrada_real[18]=="11"){
        celda.setBackground("#606060")
        }
      }
      else if (entrada_real[0].includes("ICE")) {
        if(entrada_real[17]=="5"){
        celda.setBackground("#f8be9e")
        }
        if(entrada_real[17]=="6"){
        celda.setBackground("#de8400")
        }
        if(entrada_real[17]=="7"){
        celda.setBackground("#f8be9e")
        }
        if(entrada_real[17]=="8"){
        celda.setBackground("#de8400")
        }
        if(entrada_real[17]=="9"){
        celda.setBackground("#fbe4d5")
        }
        if(entrada_real[17]=="10"){
        celda.setBackground("#f6ae86")
        }
        if(entrada_real[17]=="11"){
        celda.setBackground("#de8400")
        }
      }
      else if (entrada_real[0].includes("ICI")) {
        if(entrada_real[15]=="5"){
        celda.setBackground("#e2efd9")
        }
        if(entrada_real[15]=="6"){
        celda.setBackground("#548135")
        }
        if(entrada_real[15]=="7"){
        celda.setBackground("#e2efd9")
        }
        if(entrada_real[15]=="8"){
        celda.setBackground("#548135")
        }
        if(entrada_real[15]=="9"){
        celda.setBackground("#e2efd9")
        }
        if(entrada_real[15]=="10"){
        celda.setBackground("#a8d08d")
        }
        if(entrada_real[15]=="11"){
        celda.setBackground("#00b050")
        }
      }
      else if (entrada_real[0].includes("ICA")) {
        if(entrada_real[19]=="5"){
        celda.setBackground("#ff99cc")
        }
        if(entrada_real[19]=="6"){
        celda.setBackground("#ff3399")
        }
        if(entrada_real[19]=="7"){
        celda.setBackground("#ff99cc")
        }
        if(entrada_real[19]=="8"){
        celda.setBackground("#ff3399")
        }
        if(entrada_real[19]=="9"){
        celda.setBackground("#f5d7f0")
        }
        if(entrada_real[19]=="10"){
        celda.setBackground("#ff99cc")
        }
        if(entrada_real[19]=="11"){
        celda.setBackground("#ff3399")
        }
      }
       else {
        celda.setBackground("#FFFFFF"); // Fondo blanco (default)
      }
    }
  
}


