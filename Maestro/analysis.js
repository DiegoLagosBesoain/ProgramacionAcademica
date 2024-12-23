function obtener_columnas_especificas(data,cols) {
    return data.map((curso)=>{
      let curso_codigo=[]
      cols.forEach((col)=>{
        curso_codigo.push(curso[col])
  
      })
      return curso_codigo
  
    })
  }
  
  
  
  
  function cortarColumnas(lista, limiteColumna) {
    
    return lista.map((sublista )=>{
      
        
        
        
        return sublista.slice(0, limiteColumna)}
  );
  }
  const buscarNRCsUnicos = (codigoCurso, nrcs, usados) => {
    return nrcs
      .filter((nrc) => `${nrc[6]}${nrc[7]}` === codigoCurso) // Filtra por código de curso
      .map((nrc) => nrc[3]) // Extrae el NRC (posición 3)
      .filter((nrc) => {
        if (!usados.includes(nrc)) { // Si no se ha usado, lo asigna
          usados.push(nrc); // Marca como usado
          return true;
        }
        return false; // Si ya está usado, lo descarta
      });
  };
  const generarSecciones = (curso, nrcs) => {
    let usados = []
    const [codigoCurso, , numSecciones] = curso;
    console.log("Codigo curso: ",codigoCurso,"nuemro secciones: ",numSecciones)
    const nrcsAsociados = buscarNRCsUnicos(codigoCurso, nrcs, usados);
  
    // Creamos las secciones usando un map sobre un rango de 0 a numSecciones
    return Array.from({ length: numSecciones }, (_, i) => [
      codigoCurso,
      `${i + 1}`,
      i < nrcsAsociados.length ? nrcsAsociados[i] : "sin NRC asociado",
    ]);
  };
  
  const asignarSecciones = (cursos, nrcs) => {
    return cursos.flatMap((curso) => generarSecciones(curso, nrcs));
  };
  
  
  function generar_Entradas(secciones,data_nrc,data_catalogo,hoja_catalogo,hoja_listado_nrc,hoja_presupuesto,hoja_maestro,procesado_presupuesto){
    //Obitene las columnas por nombre
    const col_SCT_Chile_maestro= obtenerNumeroDeColumna(hoja_maestro,"SCT-Chile",1)
    const col_Requisitos_maestro= obtenerNumeroDeColumna(hoja_maestro,"Requisitos",1)
    const col_Habilidades_transversales_maestro= obtenerNumeroDeColumna(hoja_maestro,"Habilidades Transversales",1)
    const col_SCT_Chile_catalogo= obtenerNumeroDeColumna(hoja_catalogo,"SCT-Chile",1)
    const col_Requisitos_catalogo= obtenerNumeroDeColumna(hoja_catalogo,"Requisitos",1)
    const col_Habilidades_catalogo= obtenerNumeroDeColumna(hoja_catalogo,"Habilidades Transversales",1)
    const col_codigo_maestro=obtenerNumeroDeColumna(hoja_maestro,"CURSO",1)
    const col_materia_maestro=obtenerNumeroDeColumna(hoja_maestro,"MATERIA",1)
    const col_area=obtenerNumeroDeColumna(hoja_maestro,"MATERIA",1)
    
    
    return secciones.map((seccion,idx)=>{
  
      let entrada = new Array(obtenerCantidadDeColumnas(hoja_maestro))
      entrada[0]="SI"
      entrada[7]=seccion[0]//codigo ING1101
      entrada[13]=seccion[1]//seccion 1
      entrada[4]=seccion[2]// NRC 5670
      entrada[col_codigo_maestro]=seccion[0].substring(3)
      entrada[col_materia_maestro]=seccion[0].substring(0, 3)//ING
  
      let codigo_seccion = seccion[0]+seccion[1]//ING11011
      entrada[3]= codigo_seccion
      let datos_catalogo=data_catalogo.find((curso)=>curso[0]===seccion[0])
      
      //Puede que no encuentre ningun dato asociado en catalogo
      if (datos_catalogo===undefined){
      datos_catalogo = Array(data_catalogo[0].length) 
      }
      console.log("datos_catalogo",datos_catalogo,seccion[0])
      entrada[1]=datos_catalogo[3]
      entrada[10]=datos_catalogo[4]
      let datos_nrc = data_nrc.find((curso)=>curso[3]===seccion[2])//Busca por nrc
      if (datos_nrc===undefined){
      datos_nrc= Array(data_nrc[0].length) 
      }
      entrada[12]=datos_nrc[28]//cupos de ese NRC si no encuentra devuelve undefined
      
      let detalles = extraerRango(datos_catalogo,obtenerNumeroDeColumna(hoja_catalogo,"Plan Común",1),obtenerNumeroDeColumna(hoja_catalogo,"Sala especial",1))
      console.log(detalles)
      entrada = reemplazarParteLista(entrada,16,35,detalles)
      entrada[col_SCT_Chile_maestro]=datos_catalogo[col_SCT_Chile_catalogo]
      entrada[col_Requisitos_maestro]=datos_catalogo[col_Requisitos_catalogo]
      entrada[col_Habilidades_transversales_maestro]=datos_catalogo[col_Habilidades_catalogo]
  
  
      return entrada
  
  
    })
  
  
  }
  function obtenerCantidadDeColumnas(hoja) {
    // Abre la hoja activa
   
    
    // Obtiene el rango de celdas con datos
    var rango = hoja.getDataRange();
    
    // Obtiene el número de columnas (en el rango con datos)
    var cantidadDeColumnas = rango.getNumColumns();
    
    // Muestra la cantidad de columnas
    return cantidadDeColumnas
  }
  function obtenerRangoColumnas(listaDeListas,inicio,final) {
    
    return columnasRango = listaDeListas.map(fila => fila.slice(inicio,final));
  
  }
  function extraerRango(lista, inicio, fin) {
    if (lista===undefined){
      return new Array(fin-inicio) 
    }
    return lista.slice(inicio, fin + 1); // `fin + 1` porque slice no incluye el último índice
  }
  function reemplazarParteLista(lista, inicio, fin, sublista) {
    // Elimina desde `inicio` hasta `fin` y agrega `sublista` en su lugar.
    console.log("lista:",lista,"remplazada por :",sublista)
    lista.splice(inicio, fin - inicio + 1, ...sublista);
    return lista;
  }
  function obtener_entradas_area_especifica(area,entradas,col_area){
  
    const entradas_por_area=entradas.filter((entrada)=>entrada[col_area]==area)
    return entradas_por_area
  
  
  
  
  
  }
  function obtener_areas(data_maestro,col_area){
  let revisados=[]
  data_maestro.filter((tupla)=>{
  
    if(revisados.includes(tupla[col_area])||tupla[col_area]===''){
      return false
  
    }
    revisados.push(tupla[col_area])
    return true
  
  
  })
  return revisados
  
  
  }
  function mostrarHojaYEnviarArchivo(hojaVisible, usuarioPermitido) {
    const libro = SpreadsheetApp.getActiveSpreadsheet();
    const usuarioActual = Session.getEffectiveUser().getEmail();
    const hojas = libro.getSheets();
  
    if (usuarioActual === usuarioPermitido) {
      // Mostrar solo la hoja permitida
      hojas.forEach((hoja) => {
        
          hoja.showSheet(); // Mostrar la hoja permitida
        
      });
  
      Logger.log(`Usuario ${usuarioActual} puede ver solo la hoja: ${hojaVisible}`);
  
      // Asignar permisos de solo lectura al usuario permitido
      libro.addViewer(usuarioPermitido);
  
      // Enviar correo con enlace al archivo
      const enlaceArchivo = libro.getUrl();
      const asunto = `Acceso al archivo: ${libro.getName()}`;
      const mensaje = `Hola,\n\nSe te ha dado acceso al archivo de Google Sheets para modificar el maestro de tu area con permisos de solo lectura. Puedes accederlo desde el siguiente enlace:\n\n${enlaceArchivo}\n\nSaludos.`;
  
      GmailApp.sendEmail(usuarioPermitido, asunto, mensaje);
  
      Logger.log(`Correo enviado a ${usuarioPermitido} con el enlace al archivo.`);
    } else {
      // Ocultar todas las hojas para usuarios no autorizados
      hojas.forEach((hoja) => hoja.hideSheet());
      Logger.log(`Usuario ${usuarioActual} no autorizado. Hojas ocultas.`);
    }
  
  
  }
  function resaltarCambiosEnHoja(hoja, datosOriginales, filaInicio, columnasClave, columnaEliminar, listaCambiada) {
    // Crear un mapa para buscar elementos de manera eficiente en los datos originales
    const generarClave = (fila, columnas) => columnas.map((col) => fila[col]).join("|");
    const mapaOriginal = new Map(
      datosOriginales.map((fila) => [generarClave(fila, columnasClave), fila])
    );
  
    // Iterar sobre la lista cambiada para pintar directamente en la hoja
    listaCambiada.forEach((filaCambiada, idxCambiado) => {
      const clave = generarClave(filaCambiada, columnasClave);
      const valorEliminar = filaCambiada[columnaEliminar];
      const filaHoja = filaInicio + idxCambiado; // Índice en la hoja para la lista cambiada
  
      if (valorEliminar === -1) {
        // Destacar en rojo si el elemento es para eliminar
        if (mapaOriginal.has(clave)) {
          console.log("Eliminado:", filaCambiada);
          hoja.getRange(filaHoja, 1, 1, filaCambiada.length).setBackground("red");
        }
      } else if (mapaOriginal.has(clave)) {
        // Si existe en la original, revisar si hay cambios
        const filaOriginal = mapaOriginal.get(clave);
        let tieneCambios = false;
  
        filaCambiada.forEach((valor, idx) => {
          if (valor !== filaOriginal[idx]) {
            // Destacar celdas con diferencias en azul
            console.log("Diferencia:", filaCambiada, filaOriginal);
            hoja.getRange(filaHoja, idx + 1).setBackground("blue");
            tieneCambios = true;
          }
        });
  
        if (!tieneCambios) {
          // Si no hay cambios, no se hace nada (puedes personalizar este caso)
        }
      } else {
        // Es un nuevo elemento, destacar toda la fila en verde
        console.log("Nuevo:", filaCambiada);
        hoja.getRange(filaHoja, 1, 1, filaCambiada.length).setBackground("green");
      }
    });
  }
  function actualizarListaOriginal(listaOriginal, listaCambiada, columnaClave, columnaEliminar) {
    // Crea un mapa para buscar elementos de manera eficiente en la lista original
    const mapaOriginal = new Map(
      listaOriginal.map((fila) => [fila[columnaClave], fila])
    );
  
    // Lista para almacenar la lista actualizada
    const listaActualizada = [];
  
    // Procesa los elementos de la lista cambiada
    listaCambiada.forEach((filaCambiada) => {
      const clave = filaCambiada[columnaClave];
      const valorEliminar = filaCambiada[columnaEliminar];
  
      if (valorEliminar === -1) {
        // Si el valor en la columna de eliminación es -1, elimina de listaOriginal
        console.log("eliminar",clave)
        mapaOriginal.delete(clave);
      } else if (mapaOriginal.has(clave)) {
        // Si existe en el mapa original y no hay cambios, se mantiene
        const filaOriginal = mapaOriginal.get(clave);
  
        if (!filaCambiada.every((val, idx) => val === filaOriginal[idx])) {
          // Hay cambios, reemplaza la fila en el mapa
          console.log("actualizar")
          mapaOriginal.set(clave, filaCambiada);
        }
      } else {
        // Es un nuevo elemento, agrégalo al mapa
        console.log("insersion")
        mapaOriginal.set(clave, filaCambiada);
      }
    });
  
    // Reconstruye la lista a partir del mapa actualizado
    mapaOriginal.forEach((fila) => listaActualizada.push(fila));
  
    return listaActualizada;
  }
  
  function horariosPorRut(data){
  const horariosPorRut = data.reduce((acc, [fecha, nombre, rut, dia, hora]) => {
     
      if (!acc[rut]) {
          acc[rut] = {
              rut,
              horarios: {
                  Lunes: [],
                  Martes: [],
                  Miércoles: [],
                  Jueves: [],
                  Viernes: []
              }
          };
      }
      
      
      acc[rut].horarios[dia].push(hora);
      return acc;
  }, {});
  
  
  return Object.values(horariosPorRut).map(profesor => {
      const { rut, horarios } = profesor;
      const horariosConcatenados = Object.keys(horarios).reduce((acc, dia) => {
          
          acc[dia] = horarios[dia].join(",");
          return acc;
      }, {});
  
      return { rut, ...horariosConcatenados };
  });
  
  
  
  
  }
  function interseccion_de_bloques(dia1,dia2){
    const lista1=dia1.split(",")
    const lista2=dia2.split(",")
    const set1 = new Set(lista1);
    const set2 = new Set(lista2);
  
  
    const interseccion = [...set1].filter(item => set2.has(item));
  
    return interseccion.join(",")
  
  
  }
  function verificarCasillasNoVacias(lista, indices) {
    return indices.some(indice => lista[indice] !== "");
  }
  function verificarCasillastodasVacias(lista, indices) {
    return indices.every(indice => lista[indice] === "");
  }
  
  
  
  
  
  
  
  
  
  