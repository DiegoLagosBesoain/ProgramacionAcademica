function crear_calendario(hoja,opcionesLista) {
  opcionesLista=opcionesLista.map((lista)=>lista.join(" "))
  hoja.clear(); // Limpia la hoja
   
   // Configurar encabezados
   const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
   hoja.getRange(1, 2, 1, dias.length).setValues([dias]).setFontWeight("bold");
   
   // Configurar horarios
   const horaInicio = "08:30";
   const horaFin = "19:20";
   const duracionBloque = 50; // Duración en minutos
   const intervaloDescanso = 10; // Duración en minutos entre bloques
   const filasPorBloque = 10; // Filas por bloque horario
   
   
   
   const horarios = [];
   let horaActual = new Date(`1970-01-01T${horaInicio}:00`);
   const fin = new Date(`1970-01-01T${horaFin}:00`);
   
   while (horaActual <= fin) {
     const siguienteHora = new Date(horaActual.getTime() + duracionBloque * 60000);
     horarios.push(
       `${horaActual.getHours()}:${horaActual.getMinutes().toString().padStart(2, "0")}-` +
       `${siguienteHora.getHours()}:${siguienteHora.getMinutes().toString().padStart(2, "0")}`
     );
     horaActual = new Date(siguienteHora.getTime() + intervaloDescanso * 60000); // Sumar descanso
   }
   
   // Escribir horarios y días con colores alternados
   let fila = 2; // Comenzar en la fila 2
   horarios.forEach((rango, index) => {
     const color = index % 2 === 0 ? "#d9eaf7" : "#f7d9d9"; // Alternar colores por bloque
     
     for (let i = 0; i < filasPorBloque; i++) {
       // Escribir horario en la columna 1
       hoja.getRange(fila, 1)
         .setValue(rango)
         .setFontWeight("bold")
         .setBackground(color);
       
       // Espacios por día con listas desplegables
       dias.forEach((_, colIndex) => {
         const columna = colIndex + 2; // Días comienzan en la columna 2
         const celda = hoja.getRange(fila, columna);
         celda.setValue(""); // Deja el espacio vacío para rellenar
         celda.setDataValidation(SpreadsheetApp.newDataValidation()
           .requireValueInList(opcionesLista)
           .setAllowInvalid(false)
           .build());
       });
       
       fila++; // Siguiente fila
     }
   });
   
   // Ajustar tamaño de columnas y filas
   hoja.setColumnWidth(1, 120); // Columna de horarios
   hoja.setColumnWidths(2, dias.length, 350); // Columnas de días
   hoja.setRowHeights(2, horarios.length * filasPorBloque,40); // Altura de filas
   
   // Formato de la hoja
   hoja.getRange(1, 1, 1, dias.length + 1).setFontWeight("bold").setBackground("#f4b084"); // Encabezados
   hoja.setFrozenRows(1); // Fijar encabezados
   hoja.setFrozenColumns(1);
 }
 function escribirColumna(hoja,valores,col,fila) {
   
   // Escribir los valores en la columna
   const rango = hoja.getRange(filaInicial, columna, valores.length, 1); // Define el rango (filas, columna)
   rango.setValues(valores.map(v => [v])); // Escribe los valores como un arreglo 2D
 }
 function escribirListaDeListas(hoja, datos, filaInicial, columnaInicial, hojaReferencias, columnaReferencias) {
   // Determinar el tamaño del rango (filas y columnas)
   const numFilas = datos.length;
   const numColumnas = datos[0].length;
   
   
   const rango = hoja.getRange(filaInicial, columnaInicial, numFilas, numColumnas);
   rango.setValues(datos); // Escribe los datos
   
   
   const valoresReferencias = hojaReferencias.getRange(2, columnaReferencias, hojaReferencias.getLastRow() - 1, 1).getValues()
     .flat() // Convertir matriz de una columna en una lista plana
     .filter(valor => valor !== ""); // Filtrar valores vacíos
   
   // Crear la regla de validación para la lista desplegable
   const reglaValidacion = SpreadsheetApp.newDataValidation()
     .requireValueInList(valoresReferencias)
     .setAllowInvalid(true) // Permitir valores fuera de la lista
     .build();
   
   // Aplicar la validación a todas las celdas de la columna 6 en el rango
   hoja.getRange(filaInicial, columnaInicial + 5, numFilas, 1).setDataValidation(reglaValidacion);
 }
 function escribirListaDeListas1(hoja, datos, filaInicial, columnaInicial) {
   // Determinar el tamaño del rango (filas y columnas)
   const numFilas = datos.length;
   const numColumnas = datos[0].length;
   
   
   const rango = hoja.getRange(filaInicial, columnaInicial, numFilas, numColumnas);
   rango.setValues(datos); // Escribe los datos
   
   
   
 }
 function pintarCeldasConComentario(sheet, coordenadas, comentario) {
   if (!sheet) {
     throw new Error(`La hoja con nombre especificada no existe.`);
   }
 
   // Iterar por cada coordenada
   coordenadas.forEach((coord) => {
     const [row, col] = coord;
     const rango = sheet.getRange(row, col);
     
     // Obtener el comentario actual (si existe)
     const comentarioExistente = rango.getComment();
     
     // Combinar comentarios si ya existe uno
     const nuevoComentario = comentarioExistente 
       ? `${comentarioExistente}\n${comentario}` // Agregar un salto de línea entre comentarios
       : comentario; // Si no existe, usar el nuevo directamente
     
     // Pintar de amarillo suave
     rango.setBackground("#ffeb33"); // Light yellow
     
     // Establecer el comentario combinado
     rango.setComment(nuevoComentario);
   });
 }
 function limpiarBackgroundsYComentarios(sheet, startRow, startCol) {
   // Obtener el rango desde la fila y columna especificadas hasta el final de la hoja
   const lastRow = sheet.getLastRow();
   const lastCol = sheet.getLastColumn();
   const range = sheet.getRange(startRow, startCol, lastRow - startRow + 1, lastCol - startCol + 1);
 
   // Recorremos cada celda del rango
   for (let i = 0; i < range.getNumRows(); i++) {
     for (let j = 0; j < range.getNumColumns(); j++) {
       const cell = range.getCell(i + 1, j + 1); // Obtener la celda actual
 
       // Verificar si la celda tiene un comentario
       const comment = cell.getComment();
       if (comment) {
         cell.clearNote();
         cell.setBackground(null); // Elimina el comentario solo si existe
       }
 
       // Eliminar el fondo de la celda
       
     }
   }
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
 function escribirEnHojaAgrupacion(diccionario, hoja,data_maestro_con_detalles) {
   hoja.clear(); // Limpiar la hoja antes de escribir
   
   const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
   let filas = [];
 
   // Encabezados
   let encabezados = ["Hora"].concat(diasSemana);
   filas.push(encabezados);
 
   // Procesar cada bloque horario
   let colores = ["#FFCC80", "#FFFFFF"]; // Colores para intercalar (naranja/blanco)
   let colorIndice = 0;
 
   for (let horaStr in diccionario) {
     let hora = parseInt(horaStr, 10); // Convertir hora a número
     let maxFilas = 1; // Al menos una fila por hora
     let datosPorDia = {};
 
     // Calcular el número máximo de filas para este bloque horario
     diasSemana.forEach((dia) => {
       let datos = diccionario[horaStr][dia] || [];
       datosPorDia[dia] = datos;
       maxFilas = Math.max(maxFilas, datos.length);
     });
 
     // Crear filas para este bloque horario
     for (let i = 0; i < maxFilas; i++) {
       let fila = [i === 0 ? horaStr : ""]; // Solo poner la hora en la primera fila
       diasSemana.forEach((dia, idx) => {
         fila.push(datosPorDia[dia][i] || "");
 
         // Llamar a la función para destacar
         if (datosPorDia[dia][i]) {
             console.log("entre a destacar")
             destacar_por_semestre_visualizacion(
             datosPorDia[dia][i],
             hoja.getRange(filas.length + 1, idx + 2, 1, 1),
             data_maestro_con_detalles // Ajustar posición correctamente
             );
         }
       });
       filas.push(fila);
     }
 
     // Estilos
     let inicioFila = filas.length - maxFilas;
     hoja.getRange(inicioFila + 1, 1).setBackground("#000000").setFontColor("#000000").setHorizontalAlignment("center");
 
     // Bordes delgados internos
     hoja.getRange(inicioFila + 1, 2, maxFilas, diasSemana.length)
         .setBorder(true, true, true, true, false, false, "black", SpreadsheetApp.BorderStyle.SOLID);
 
     // Bordes gruesos alrededor del bloque
     hoja.getRange(inicioFila + 1, 1, maxFilas, diasSemana.length + 1)
         .setBorder(true, true, true, true, false, false, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
 
     // Colores intercalados para la columna de horas
     let horaColor = colores[colorIndice % 2];
     hoja.getRange(inicioFila + 1, 1, maxFilas, 1).setBackground(horaColor);
     colorIndice++;
   }
 
   // Escribir filas
   hoja.getRange(1, 1, filas.length, filas[0].length).setValues(filas);
 
   // Ajustar tamaños
   hoja.setColumnWidth(1, 150);
   for (let i = 2; i <= diasSemana.length + 1; i++) {
     hoja.setColumnWidth(i, 250);
   }
   hoja.setRowHeightsForced(2, filas.length - 1, 60);
   hoja.getRange(1, 1, 1, diasSemana.length + 1).setFontWeight("bold").setHorizontalAlignment("center");
 }
 function destacar_por_semestre_visualizacion(valorEditado,celda,data_maestro_con_detalles) {
   
   
   
   // Verificar si la edición no está en la primera fila o columna
 
     const bloques = data_maestro_con_detalles; // Define aquí tu data maestro
     const entrada_real = bloques.find((bloque) =>
       (valorEditado.split(" ")[0] == bloque[2])   // Curso
         // Sección
       
     );
     console.log(entrada_real)
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
         caleda.setFontColor("#FF0000");; // Azul claro
       } else {
         celda.setBackground("#FFFFFF"); // Fondo blanco (default)
       }
     }
   
 }
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
 
 
 