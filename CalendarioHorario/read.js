function obterner_data_maestro() {
  const idSpreadsheet = id_hoja_maestro;
  const hoja_maestro = SpreadsheetApp.openById(idSpreadsheet).getSheetByName('MAESTRO');
  const data_maestro = hoja_maestro.getDataRange().getDisplayValues();
  
 
  return data_maestro
}
///ATENTO A ESTO
function obtenerBloquesPorHoraYDia(hoja, hoja_data_maestro) {
  const data_maestro = hoja_data_maestro.getDataRange().getDisplayValues();

  // Leer los datos una vez para evitar múltiples accesos a la hoja
  const rangoDias = hoja.getRange(2, 1, hoja.getLastRow() - 1).getValues().flat();
  const rangoHoras = hoja.getRange(1, 2, 1, hoja.getLastColumn() - 1).getValues()[0];
  const valores = hoja.getRange(2, 2, hoja.getLastRow() - 1, hoja.getLastColumn() - 1).getValues();

  // Crear un diccionario para almacenar los bloques por día y hora
  let bloquesPorDiaYHora = {};

  // Iterar sobre los valores de la hoja
  for (let i = 0; i < valores.length; i++) {
    const dia = rangoDias[i];
    if (!bloquesPorDiaYHora[dia]) {
      bloquesPorDiaYHora[dia] = {};
    }

    for (let j = 0; j < valores[i].length; j++) {
      const hora = rangoHoras[j];
      const celdaValor = valores[i][j];

      let valorBloque = "";
      if (celdaValor) {
        const listado = celdaValor.split(" ");
        const resultado = data_maestro.find(entrada =>
          listado[0] === entrada[2] && // Curso
          listado[2] === entrada[1] && // Sección
          listado[3] === entrada[6]    // Tipo de clase
        );

        if (resultado) {
          valorBloque = resultado.join(" ");
        }
      }

      if (!bloquesPorDiaYHora[dia][hora]) {
        bloquesPorDiaYHora[dia][hora] = [];
      }

      bloquesPorDiaYHora[dia][hora].push(valorBloque || "");
    }
  }

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
function obtenerNumeroDeColumna(sheet, nombreColumna, filaEncabezados) {
  // Obtener la hoja por su nombre
 
  // Verificar si la hoja existe
  if (!sheet) {
    throw new Error(`La hoja "${sheetName}" no existe.`);
  }

  // Obtener los valores de la fila donde están los encabezados
  const encabezados = sheet
    .getRange(filaEncabezados, 1, 1, sheet.getLastColumn()) // Obtiene una fila específica
    .getValues()[0]; // Accede a la primera fila del rango seleccionado
  
  // Buscar el índice del nombre de la columna
  const indice = encabezados.indexOf(nombreColumna);

  // Si no se encuentra el nombre, lanzar un error o devolver un valor específico
  if (indice === -1) {
    throw new Error(`La columna con el nombre "${nombreColumna}" no fue encontrada en la fila ${filaEncabezados}.`);
  }

  // Los índices empiezan desde 0, pero las columnas en Sheets empiezan desde 1
  return indice;
}



