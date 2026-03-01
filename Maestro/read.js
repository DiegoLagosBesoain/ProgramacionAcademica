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
function leerInscritosPorPeriodo() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('RAMOS INSCRITOS POR PERIODO');
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  // Desde fila 4 hasta la última fila con datos
  const data = sheet.getRange(6, 1, lastRow - 5, lastCol).getValues();
  
  return data;
}
function verifySheets(hojas_sheets,hoja_existente){ //verifica si la hoja que se va a crear existe, retorna un booleano
  const  hojas = hojas_sheets.getSheets(); // Obtiene todas las hojas del documento
  const  nombresHojas=hojas.map((sheet)=>sheet.getName()) ; // Inicializa un array para almacenar los nombres de las hojas
  return  !nombresHojas.includes(hoja_existente)
}
function obtenerSpreadsheetDeCarpeta(idCarpeta, nombreArchivo) {
  try {
    // Obtener la carpeta por su ID
    const carpeta = DriveApp.getFolderById(idCarpeta);
    
    // Buscar archivos con el nombre especificado
    const archivos = carpeta.getFilesByName(nombreArchivo);
    
    if (archivos.hasNext()) {
      const archivo = archivos.next();
      
      // Verificar que el archivo es un Google Spreadsheet
      if (archivo.getMimeType() === MimeType.GOOGLE_SHEETS) {
        // Retornar el Spreadsheet usando su ID
        return SpreadsheetApp.openById(archivo.getId());
      } else {
        Logger.log("El archivo encontrado no es un Google Spreadsheet.");
        return null;
      }
    } else {
      Logger.log("No se encontró el archivo con el nombre: " + nombreArchivo);
      return null;
    }
  } catch (e) {
    Logger.log("Error: " + e.message);
    return null;
  }
}
function obtenerDatosDesdeHoja(nombreHoja, filaInicio) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(nombreHoja);

  if (!sheet) {
    throw new Error(`La hoja "${nombreHoja}" no existe.`);
  }

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  if (lastRow < filaInicio) {
    return [];
  }

  return sheet
    .getRange(
      filaInicio,
      1,
      lastRow - filaInicio + 1,
      lastCol
    )
    .getValues();
}
function leerHojaSinEncabezado(nombreHoja) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(nombreHoja);
  
  if (!sheet) {
    throw new Error(`No existe la hoja: ${nombreHoja}`);
  }

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  if (lastRow < 2) return []; // solo encabezado o vacía

  // Desde fila 2 (saltamos encabezado)
  return sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
}
