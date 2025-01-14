var id_hoja_maestro="1o6HftjnQiU4EB1T9mwZ5FntfkZqy9Bj5wkZKbyHl-m0"
function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate();
}
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
// Función para enviar el mensaje que pide el RUT
function pedirRut(nombre) {
  try {
    // Lógica para validar el nombre, generar un mensaje dinámico o realizar alguna acción.
    if (!nombre || nombre.trim() === "") {
      throw new Error("El nombre no puede estar vacío."); // Lanza un error si el nombre no es válido.
    }
    
    // Si todo está correcto, devuelve un mensaje de éxito.
    console.log("Pedir rut",nombre)
    return {

        success: true, // Indica que la operación fue exitosa.
        message: `Hola, ${nombre}. Ahora ingrese su RUT (sin puntos ni guión).`
       };
  } catch (e) {
    // Devuelve un mensaje de error en caso de que ocurra algún problema.
    console.log("Pedir rut",nombre)
    return {
      success: false, // Indica que la operación falló.
      message: e.message // Devuelve el mensaje de error.
    };
  }
}

// Validar el RUT con los datos de la hoja de cálculo
function validarRut(rut,nombre) {
  const data_profesores = obtener_data_profesor(rut);
  try{
  if (data_profesores.length < 1) {
    throw new Error("El rut ingresado no es valido(si es guión 'K' ingreselo en mayúsculas)."); // Lanza un error si el rut no es válido.
    }
  const ss = SpreadsheetApp.openById(id_hoja_maestro)
  const hoja = ss.getSheetByName("ENTREGADOS");
  
  if (!hoja) {
    Logger.log("La hoja 'ENTREGADOS' no existe.");
    return { success: false, message: "La hoja 'ENTREGADOS' no existe." };
  }

  // Obtener los valores de la primera columna (RUTs registrados)
  const lastRow = hoja.getLastRow();
  let rutColumna = [];
  
  if (lastRow > 0) {
    // Obtener los valores de la primera columna solo si hay datos
    rutColumna = hoja.getRange(1, 1, lastRow).getValues().flat();
  }
  console.log(rut,rutColumna)
  // Verificar si el RUT ya está registrado
  if (rutColumna.some((dato)=>dato==rut)) {
    return { success: false, message: "Este RUT ya fue registrado previamente." };
  }
  const semestres_protegidos_minor=["2","3","4","5"]
  const horas_totales = data_profesores.reduce((total, actual) => 
  actual[4] == 0 
    ? total + Number(actual[6]) 
    : total + Number(actual[4]), 
  0
);
  const restriccion_horario_plan_comun = data_profesores.every((curso_seccion)=>
  semestres_protegidos_minor
  .includes(curso_seccion[5]))
  console.log(nombre)
  const mensaje = getPreguntaDinamica(nombre, data_profesores,horas_totales)
  console.log(data_profesores)
  const cursos3horas1 = data_profesores
  .filter((fila) => fila.length > 4 && (fila[4] == "3" || fila[4] == 3))
  .map((curso) => {
    let codigo = curso[2] || "Sin código";
    let seccion = curso[3] || "Sin sección";
    let titulo = curso[1] || "Sin título";
    return [codigo, seccion, titulo];
  });
  
  return {
      success: true, // Indica que la operación fue exitosa.
      message: mensaje,
      horas_totales: horas_totales,
      restriccion_horario_plan_comun:restriccion_horario_plan_comun,
      nombre:nombre,
      cursos3:cursos3horas1,
      data_profe:data_profesores
    };
  } catch (e) {
    // Devuelve un mensaje de error en caso de que ocurra algún problema.
    return {
      success: false, // Indica que la operación falló.
      message: e.message // Devuelve el mensaje de error
    }
  }
}

// Función para obtener los cursos del profesor
function obtener_data_profesor(rut) {
  const idSpreadsheet = id_hoja_maestro;
  const hoja_maestro = SpreadsheetApp.openById(idSpreadsheet).getSheetByName('MAESTRO');
  const data_maestro = hoja_maestro.getDataRange().getDisplayValues();
  const col_rut = obtenerNumeroDeColumna(hoja_maestro, "RUT PROFESOR 1", 1);
  const col_nombre_curso = obtenerNumeroDeColumna(hoja_maestro, "TITULO", 1);
  const col_codigo_curso = obtenerNumeroDeColumna(hoja_maestro, "CODIGO", 1);
  const col_codigo_seccion = obtenerNumeroDeColumna(hoja_maestro, "SECCIONES", 1);
  const col_codigo_horas_clases = obtenerNumeroDeColumna(hoja_maestro, "Clases A PROGRAMAR", 1);
  const col_codigo_semestre = obtenerNumeroDeColumna(hoja_maestro, "Plan Común", 1);
  const col_codigo_horas_laboratorio = obtenerNumeroDeColumna(hoja_maestro, "Laboratorios o Talleres PROGRAMAR", 1);
  const col_rut_profesor2=obtenerNumeroDeColumna(hoja_maestro,"RUT PROFESOR 2",1)
  

  const profesores_curso = data_maestro.map((entrada) => [entrada[col_rut], entrada[col_nombre_curso], entrada[col_codigo_curso], entrada[col_codigo_seccion],entrada[col_codigo_horas_clases],entrada[col_codigo_semestre],
  entrada[col_codigo_horas_laboratorio],entrada[col_rut_profesor2]]);
  const data_profesor = profesores_curso.filter((data) => data[0] === rut||data[7] === rut);
  return data_profesor;
}

// Función para devolver los cursos asignados a un profesor
function getPreguntaDinamica(nombre, data_profesor,horas_totales) {
  const cursos_por_realizar = data_profesor.map((curso_seccion) => `${curso_seccion[1]} Sección ${curso_seccion[3]} que tiene ${
  curso_seccion[4] == 0 
    ? `${curso_seccion[6]} horas de taller/laboratorio` 
    : `${curso_seccion[4]} horas de clases`
}`);
   return 'Hola ' + nombre + ', este semestre has sido designado para realizar los cursos:\n -' + cursos_por_realizar.join("\n-")+"\nCon un total de "+ horas_totales + " Horas a realizar.\nPor favor indique su disponibilidad, mientras más horas indique facilita el proceso de asignación de horarios";
}

// Función para guardar las respuestas



function guardarHorariosEnHoja(nombre, rut, horarios) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const lockKey = `lock_${rut}`;
  const maxRetries = 10; // Número máximo de reintentos
  const retryDelay = 500; // Tiempo de espera entre reintentos en milisegundos
  
  let retries = 0;
  
  // Esperar hasta que el bloqueo esté libre
  while (scriptProperties.getProperty(lockKey) && retries < maxRetries) {
    Utilities.sleep(retryDelay); // Esperar antes de reintentar
    retries++;
  }

  if (retries === maxRetries) {
    return `El RUT ${rut} no pudo ser procesado porque está bloqueado. Inténtalo de nuevo más tarde.`;
  }

  try {
    // Establecer el bloqueo
    scriptProperties.setProperty(lockKey, true);
    
    const sheet = SpreadsheetApp.openById(id_hoja_maestro).getSheetByName("RESPUESTAS");
    const data = sheet.getDataRange().getDisplayValues();

    // Eliminar respuestas previas
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i][2] == rut) {
        sheet.deleteRow(i + 1);
      }
    }

    // Agregar las nuevas respuestas
    horarios.forEach((horario) => {
      sheet.appendRow([new Date(), nombre, rut, ...horario.split(" ")]);
    });

    return `Horarios para ${nombre} (${rut}) guardados correctamente.`;
  } catch (error) {
    // Manejo de errores
    console.error(`Error al guardar horarios para ${rut}: ${error.message}`);
    return `Ocurrió un error al guardar los horarios para ${rut}. Por favor, intenta nuevamente.`;
  } finally {
    // Liberar el bloqueo
    scriptProperties.deleteProperty(lockKey);
  }
}
function guardarPreferenciasHoras(rut, preferencias) {
  try {
    const hoja = SpreadsheetApp.openById(id_hoja_maestro).getSheetByName("PREFERENCIAS");
    preferencias.forEach(preferencia => {
      hoja.appendRow([rut, ...preferencia.curso.split(" "), preferencia.preferencia, new Date()]);
    });
    return { success: true, message: "Preferencias guardadas exitosamente." };
  } catch (error) {
    return { success: false, message: "Error al guardar las preferencias: " + error.message };
  }
}
function enviar_datos(nombre, rut, horarios, preferencias, comentarios, examenes, evaluaciones, tipos) {
  const ss = SpreadsheetApp.openById(id_hoja_maestro)
  const hoja = ss.getSheetByName("ENTREGADOS");
  
  if (!hoja) {
    Logger.log("La hoja 'ENTREGADOS' no existe.");
    return { success: false, message: "La hoja 'ENTREGADOS' no existe." };
  }

  // Obtener los valores de la primera columna (RUTs registrados)
  const lastRow = hoja.getLastRow();
  let rutColumna = [];
  
  if (lastRow > 0) {
    // Obtener los valores de la primera columna solo si hay datos
    rutColumna = hoja.getRange(1, 1, lastRow).getValues().flat();
  }
  console.log(rut,rutColumna)
  // Verificar si el RUT ya está registrado
  if (rutColumna.some((dato)=>dato==rut)) {
    return { success: false, message: "Este RUT ya fue registrado previamente." };
  }

  // Si el RUT no está registrado, proceder con el envío de datos
  console.log(comentarios, examenes, evaluaciones, tipos);

  // Guardar horarios en la hoja
  
  // Guardar preferencias en la hoja
  guardarPreferenciasHoras(rut, preferencias);
  
  // Guardar otros datos
  enviar_datos_otros(rut, comentarios, examenes, evaluaciones, tipos);

  // Después de guardar los datos, agregar el RUT al final de la columna
  hoja.appendRow([rut]);

  return { success: true, message: "Datos enviados correctamente y RUT registrado." };
}
function enviar_datos_otros(rut,comentarios,examenes,evaluaciones,tipos){
  try {
    const hoja = SpreadsheetApp.openById(id_hoja_maestro).getSheetByName("OTROS");
    comentarios.forEach((preferencia,idx) => {
      hoja.appendRow([rut, ...examenes[idx].curso.split(" "), preferencia.comentario,examenes[idx].preferencia,
      evaluaciones[idx].nevaluaciones,tipos[idx].preferencia ,new Date()]);
    });
    return { success: true, message: "otros guardados exitosamente." };
  } catch (error) {
    return { success: false, message: "Error al guardar las preferencias: " + error.message };
  }



}
function todo_bien(){}



