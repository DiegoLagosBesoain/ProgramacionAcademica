function obterner_data_maestro() {
  const idSpreadsheet = '1o6HftjnQiU4EB1T9mwZ5FntfkZqy9Bj5wkZKbyHl-m0';
  const hoja_maestro = SpreadsheetApp.openById(idSpreadsheet).getSheetByName('MAESTRO');
  const data_maestro = hoja_maestro.getDataRange().getDisplayValues();
  
 
  return data_maestro
}
///ATENTO A ESTO
function obtenerBloquesPorHoraYDia(hoja,hoja_data_maestro) {
  const data_maestro = hoja_data_maestro.getDataRange().getDisplayValues()
  //const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
  // Definir el rango del calendario (ajustado a la estructura de tu hoja)
  const rangoCalendario = hoja.getRange(2, 2, hoja.getLastRow() - 1, hoja.getLastColumn() - 1); // Ajusta el rango de acuerdo con tu hoja
  const valores = rangoCalendario.getValues(); // Obtener los valores de todas las celdas en el rango
  
  // Crear un diccionario para almacenar los bloques por día y hora
  let bloquesPorDiaYHora = {};

  // Recorremos todas las celdas para verificar qué bloques están ocupados
  for (let i = 0; i < valores.length; i++) {
    const dia = hoja.getRange(i + 2, 1).getValue(); // Obtener el día de la fila
    if (!bloquesPorDiaYHora[dia]) {
      bloquesPorDiaYHora[dia] = {}; // Inicializar el diccionario para este día si no existe
    }

    for (let j = 0; j < valores[i].length; j++) {
      const hora = hoja.getRange(1, j + 2).getValue(); // Obtener la hora de la columna
      
      let valor = ""
      if  (valores[i][j]!=""){
      let idx1=0
      valor = data_maestro.find((entrada) => {

      let listado = valores[i][j].split(" ");
      
      if (
        (listado[0] == entrada[2]) &&  // Curso
        (listado[2] == entrada[1]) &&  // Sección
        (listado[3] == entrada[6])) {  // Tipo de clase
        
        return true;
      }
      idx1=idx1+1
    return false;
    })
    //.concat(data_detalles_malla[idx1])
    .join(" ");
    
    }// Obtener el valor de la celda

      if (!bloquesPorDiaYHora[dia][hora]) {
        bloquesPorDiaYHora[dia][hora] = []; // Inicializar la lista de bloques si no existe
      }

      // Agregar el valor al bloque correspondiente
      bloquesPorDiaYHora[dia][hora].push(valor || ""); // Si está vacío, insertamos un string vacío
    }
  }

  // Mostrar el diccionario en los registros o devolverlo
  Logger.log(JSON.stringify(bloquesPorDiaYHora, null, 2)); // Mostrar de manera más legible en los registros
  return bloquesPorDiaYHora;
}
function obtenerBloquesPorHoraYDia_sin_transformar(hoja,hoja_data_maestro) {
  const data_maestro = hoja_data_maestro.getDataRange().getDisplayValues()
  //const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
  // Definir el rango del calendario (ajustado a la estructura de tu hoja)
  const rangoCalendario = hoja.getRange(2, 2, hoja.getLastRow() - 1, hoja.getLastColumn() - 1); // Ajusta el rango de acuerdo con tu hoja
  const valores = rangoCalendario.getValues(); // Obtener los valores de todas las celdas en el rango
  
  // Crear un diccionario para almacenar los bloques por día y hora
  let bloquesPorDiaYHora = {};

  // Recorremos todas las celdas para verificar qué bloques están ocupados
  for (let i = 0; i < valores.length; i++) {
    const dia = hoja.getRange(i + 2, 1).getValue(); // Obtener el día de la fila
    if (!bloquesPorDiaYHora[dia]) {
      bloquesPorDiaYHora[dia] = {}; // Inicializar el diccionario para este día si no existe
    }

    for (let j = 0; j < valores[i].length; j++) {
      const hora = hoja.getRange(1, j + 2).getValue(); // Obtener la hora de la columna
      
      let valor = valores[i][j]
     // Obtener el valor de la celda

      if (!bloquesPorDiaYHora[dia][hora]) {
        bloquesPorDiaYHora[dia][hora] = []; // Inicializar la lista de bloques si no existe
      }

      // Agregar el valor al bloque correspondiente
      bloquesPorDiaYHora[dia][hora].push(valor || ""); // Si está vacío, insertamos un string vacío
    }
  }

  // Mostrar el diccionario en los registros o devolverlo
  Logger.log(JSON.stringify(bloquesPorDiaYHora, null, 2)); // Mostrar de manera más legible en los registros
  return bloquesPorDiaYHora;
}
function verifySheets(hojas_sheets,hoja_existente){ //verifica si la hoja que se va a crear existe, retorna un booleano
  const  hojas = hojas_sheets.getSheets(); // Obtiene todas las hojas del documento
  const  nombresHojas=hojas.map((sheet)=>sheet.getName()) ; // Inicializa un array para almacenar los nombres de las hojas
  return  !nombresHojas.includes(hoja_existente)
}



