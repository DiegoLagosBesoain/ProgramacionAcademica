function escribirDatosYResaltar(hoja, datos) {
  

    if (!hoja) {
      throw new Error(`No se encontró la hoja con el nombre: ${sheet}`);
    }
  
    // Determinar la cantidad de columnas de los datos
    const numColumnasDatos = datos[0].length;
  
    // Limpiar contenido y formato solo debajo de los encabezados
    const numFilas = hoja.getLastRow();
    if (numFilas > 1) {
      hoja.getRange(2, 1, numFilas - 1, hoja.getLastColumn()).clearContent().clearFormat();
    }
  
    // Escribe los datos debajo de los encabezados
    hoja.getRange(2, 1, datos.length, numColumnasDatos).setValues(datos);
  
    // Encuentra la columna "NRC" de los encabezados
    const encabezados = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
    const columnaNRC = encabezados.indexOf("NRC") + 1;
  
    if (columnaNRC === 0) {
      throw new Error('No se encontró una columna con el encabezado "NRC".');
    }
  
    // Recorre los datos y resalta las filas según la condición
    datos.forEach((fila, i) => {
      if (fila[columnaNRC - 1] === "sin NRC asociado") {
        const rangoFila = hoja.getRange(i + 2, 1, 1, numColumnasDatos); // i+2 porque los datos empiezan en la fila 2
        rangoFila.setBackground("yellow");
      }
    });
  }
  function crear_hoja_nombre(nombre,hojasActuales) {
    
    const hoja = hojasActuales.getSheetByName(nombre)
    if (hoja){
      return hoja
    } 
    if(verifySheets(hojasActuales,nombre)){const nueva_hoja = createSheetByName(hojasActuales,nombre);}
    else {
    deleteSheetByName(hojasActuales,nombre);
    const nueva_hoja = createSheetByName(hojasActuales,nombre);
    }
    
    return hojasActuales.getSheetByName(nombre)
  
  }
  function deleteSheetByName(spreadsheet, sheetName) {
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (sheet) {
      spreadsheet.deleteSheet(sheet);
      Logger.log("Hoja '" + sheetName + "' eliminada correctamente.");
    } else {
      Logger.log("No se encontró ninguna hoja con el nombre '" + sheetName + "'.");
    }
  }
  function createSheetByName(spreadsheet, sheetName) {
    const newSheet = spreadsheet.insertSheet(sheetName);
    Logger.log("Nueva hoja '" + sheetName + "' creada correctamente.");
    return newSheet;
  }
  function escribir_hoja_con_data(informaciones,sheet,encabezado){
  
  informaciones = [encabezado,...informaciones]
  sheet.getRange(1, 1, informaciones.length, informaciones[0].length).setValues(informaciones);
  
  
  }
  function escribirEncabezado(hoja, encabezado) {
    
  
    if (!hoja) {
      throw new Error(`No se encontró la hoja con el nombre: ${sheetName}`);
    }
  
    // Limpia la primera fila antes de escribir el encabezado
    const numColumnas = hoja.getLastColumn();
    if (numColumnas > 0) {
      hoja.getRange(1, 1, 1, numColumnas).clearContent();
    }
  
    // Escribe el encabezado en la primera fila
    hoja.getRange(1, 1, 1, encabezado.length).setValues([encabezado]);
  
    Logger.log("Encabezado escrito correctamente.");
  }
  function copiarEncabezado(hojaOrigen,hojaDestino) {
    
  
    if (!hojaOrigen || !hojaDestino) {
      throw new Error(`No se encontraron las hojas especificadas: "${sheetOrigen}" o "${sheetDestino}".`);
    }
  
    // Obtener la primera fila (encabezado) de la hoja de origen
    const rangoEncabezadoOrigen = hojaOrigen.getRange(1, 1, 1, hojaOrigen.getLastColumn());
    const valoresEncabezado = rangoEncabezadoOrigen.getValues();
    const formatosEncabezado = rangoEncabezadoOrigen.getFontWeights();
    const coloresEncabezado = rangoEncabezadoOrigen.getFontColors();
    const alineacionesEncabezado = rangoEncabezadoOrigen.getHorizontalAlignments();
    const tamaniosEncabezado = rangoEncabezadoOrigen.getFontSizes();
  
    // Limpiar la primera fila de la hoja de destino
    const numColumnasDestino = hojaDestino.getLastColumn();
    if (numColumnasDestino > 0) {
      hojaDestino.getRange(1, 1, 1, numColumnasDestino).clearContent().clearFormat();
    }
  
    // Escribir encabezado en la hoja de destino
    const rangoEncabezadoDestino = hojaDestino.getRange(1, 1, 1, valoresEncabezado[0].length);
    rangoEncabezadoDestino.setValues(valoresEncabezado);
  
    // Aplicar el formato del encabezado original
    rangoEncabezadoDestino.setFontWeights(formatosEncabezado);
    rangoEncabezadoDestino.setFontColors(coloresEncabezado);
    rangoEncabezadoDestino.setHorizontalAlignments(alineacionesEncabezado);
    rangoEncabezadoDestino.setFontSizes(tamaniosEncabezado);
    const coloresFondo = rangoEncabezadoOrigen.getBackgrounds();
    rangoEncabezadoDestino.setBackgrounds(coloresFondo);
    //const numColumnas = hojaOrigen.getLastColumn();
    //for (let col = 1; col <= numColumnas; col++) {
      //const anchoColumna = hojaOrigen.getColumnWidth(col);
      //hojaDestino.setColumnWidth(col, anchoColumna);
    //}
    hojaDestino.setFrozenRows(1)
    
  }
  function crearSpreadsheetEnCarpeta(nombreArchivo) {
    
  
    // Buscar la carpeta por su nombre
    const carpeta = DriveApp.getFolderById(id)(idCarpeta);
    
  
    
  
    // Crear el nuevo spreadsheet
    const nuevoSpreadsheet = SpreadsheetApp.create(nombreArchivo);
  
    // Mover el spreadsheet a la carpeta
    const archivo = DriveApp.getFileById(nuevoSpreadsheet.getId());
    carpeta.addFile(archivo);
    DriveApp.getRootFolder().removeFile(archivo); // Elimina el archivo de "Mi Unidad"
  
    
  }
  function crearSpreadsheetEnCarpetaConRemplazo(nombreArchivo) {
    try {
      // Obtener la carpeta por su ID
      const idCarpeta = "1_65rwp56jrcRsxoMO-HnBAOFGFI1z9Mc";
      const carpeta = DriveApp.getFolderById(idCarpeta);
      
      // Buscar si ya existe un archivo con el mismo nombre en la carpeta
      const archivos = carpeta.getFilesByName(nombreArchivo);
      if (archivos.hasNext()) {
        const archivoExistente = archivos.next();
        Logger.log(`Archivo existente encontrado: ${archivoExistente.getName()}`);
        return SpreadsheetApp.openById(archivoExistente.getId()); // Retornar el archivo existente
      }
  
      // Crear el nuevo archivo Google Sheets si no existe
      const nuevoSpreadsheet = SpreadsheetApp.create(nombreArchivo);
  
      // Mover el archivo a la carpeta
      const archivo = DriveApp.getFileById(nuevoSpreadsheet.getId());
      carpeta.addFile(archivo);
      DriveApp.getRootFolder().removeFile(archivo); // Remover de "Mi unidad"
  
      // Retornar el objeto Spreadsheet para editarlo
      return SpreadsheetApp.openById(nuevoSpreadsheet.getId());
    } catch (e) {
      Logger.log(`Error: ${e.message}`);
      throw new Error("No se pudo crear o mover el archivo Google Sheets.");
    }
  }
  function enviarLinksConPermisos(idCarpeta, listaDatos) {
    try {
      // Obtener la carpeta por su ID
      const carpeta = DriveApp.getFolderById(idCarpeta);
      
      // Iterar por cada elemento en la lista de datos
      listaDatos.forEach(item => {
        const email = item.mail;
        const nombresArchivos = item.archivos;
        let mensaje = `Estimado/a ${item.name},\n\nSe le han compartido los siguientes archivos para su revision:\n`;
  
        nombresArchivos.forEach(nombreArchivo => {
          // Buscar el archivo por nombre dentro de la carpeta
          const archivos = carpeta.getFilesByName(nombreArchivo);
          if (archivos.hasNext()) {
            const archivo = archivos.next();
  
            // Dar permisos de administrador al destinatario
            archivo.addEditor(email);
  
            // Agregar el link al mensaje
            const link = archivo.getUrl();
            mensaje += `- ${nombreArchivo}: ${link}\n`;
  
            Logger.log(`Permisos otorgados y link generado para "${nombreArchivo}" a ${email}.`);
          } else {
            Logger.log(`Archivo "${nombreArchivo}" no encontrado en la carpeta.`);
            mensaje += `- ${nombreArchivo}: No encontrado en la carpeta\n`;
          }
        });
  
        // Enviar el correo con los enlaces
        const asunto = "Archivos compartidos desde Google Drive";
        mensaje += `\nSaludos.`;
        GmailApp.sendEmail(email, asunto, mensaje);
      });
    } catch (e) {
      Logger.log(`Error: ${e.message}`);
      throw new Error("No se pudieron compartir los archivos.");
    }
  }
  function resaltarFilasCambiadas(hoja, desdeFila, listaBooleana) {
    
    if (!hoja) {
      throw new Error(`No se encontró la hoja "${sheetName}"`);
    }
  
    // Determina la última fila que debe revisarse según la longitud de la lista booleana
    const hastaFila = desdeFila + listaBooleana.length - 1;
  
    // Aplica el formato a cada fila basada en la lista booleana
    listaBooleana.forEach((encontrado, index) => {
      const filaActual = desdeFila + index;
  
      if (encontrado) {
        
      } else {
        hoja.getRange(filaActual, 1, 1, hoja.getLastColumn())
          .setBackground("#16d696"); // Limpia el formato si no está cambiada
      }
    });
  }
  function escribirHorariosEnHoja(sheet, filaIndice, columnasDias, horario,fila_actual) {
    try {
      // Iterar sobre los días en el diccionario y las columnas especificadas
      ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].forEach((dia, i) => {
  
        let valor = horario[dia] || "";;
        const columna = columnasDias[i]; // Obtener la columna correspondiente al día
        if(fila_actual[columna]==""){
           sheet.getRange(filaIndice, columna).setValue(valor); // Escribir en la celda
          
          
        }
        else{
  
          valor = interseccion_de_bloques(valor,fila_actual)
        }
         // Tomar el valor del diccionario o dejar vacío
       
  
      });
      return { success: true, message: "Horarios escritos correctamente." };
    } catch (error) {
      return { success: false, message: "Error al escribir en la hoja: " + error.message };
    }
  }
  function limpiarColumnas(hoja,columnas) {
     // Índices de las columnas a limpiar (1 = Columna A, 3 = Columna C, etc.)
    
    const rango = hoja.getDataRange(); // Obtén todo el rango de datos
    const datos = rango.getValues(); // Obtén los valores como una matriz bidimensional
    
    // Recorre las filas y limpia las columnas especificadas
    for (let i = 1; i < datos.length; i++) {
      columnas.forEach(col => {
        if (col >= 0 && col < datos[i].length) { 
          datos[i][col] = ""; // Limpia el contenido de la celda
        }
      });
    }
    
    // Escribe los datos actualizados en el rango
    rango.setValues(datos);
  }
  
  