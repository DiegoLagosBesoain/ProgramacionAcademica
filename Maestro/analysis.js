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
  const col_codigo_catalogo = obtenerNumeroDeColumna(hoja_catalogo,"CODIGO",1)
  const col_Habilidades_catalogo= obtenerNumeroDeColumna(hoja_catalogo,"Habilidades Transversales",1)
  const col_codigo_maestro=obtenerNumeroDeColumna(hoja_maestro,"CURSO",1)
  const col_materia_maestro=obtenerNumeroDeColumna(hoja_maestro,"MATERIA",1)
  const col_area_catalogo=obtenerNumeroDeColumna(hoja_catalogo,"AREA",1)
  const col_titulo_catalogo=obtenerNumeroDeColumna(hoja_catalogo,"TITULO",1)
  
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
    let datos_catalogo=data_catalogo.find((curso)=>curso[col_codigo_catalogo]===seccion[0])
    
    //Puede que no encuentre ningun dato asociado en catalogo
    if (datos_catalogo===undefined){
    datos_catalogo = Array(data_catalogo[0].length) 
    }
    
    entrada[1]=datos_catalogo[col_area_catalogo]
    entrada[10]=datos_catalogo[col_titulo_catalogo]
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
function rellenar_dpsa(data_maestro,col_dias,dias,hoja_maestro){
  const col_codigo=obtenerNumeroDeColumna(hoja_maestro,"CODIGO",1)
  const col_NRC=obtenerNumeroDeColumna(hoja_maestro,"NRC",1)
  const col_materia=obtenerNumeroDeColumna(hoja_maestro,"MATERIA",1)
  const col_curso=obtenerNumeroDeColumna(hoja_maestro,"CURSO",1)
  const col_seccion=obtenerNumeroDeColumna(hoja_maestro,"SECCIONES",1)
  const col_titulo=obtenerNumeroDeColumna(hoja_maestro,"TITULO",1)
  const col_Lista_cruzada=obtenerNumeroDeColumna(hoja_maestro,"LC",1)
  const col_profesor1=obtenerNumeroDeColumna(hoja_maestro,"RUT PROFESOR 1",1)
  const col_profesor2=obtenerNumeroDeColumna(hoja_maestro,"RUT PROFESOR 2",1)
  const col_profesor_lab=obtenerNumeroDeColumna(hoja_maestro,"RUT PROFESOR LABT",1)
  const col_cupos=obtenerNumeroDeColumna(hoja_maestro,"CUPOS 202420",1)
  const col_mandante=obtenerNumeroDeColumna(hoja_maestro,"CURSO MANDANTE",1)
  const dPSA=[]
  const col_conector_liga=obtenerNumeroDeColumna(hoja_maestro,"CONECTOR DE LIGA",1)
  console.log("numero de columnas dias",col_dias)
  data_maestro.forEach((entrada)=>{
    col_dias.forEach((columna,idx)=>{
      const bloques=entrada[columna].split(",")
      if (entrada[col_Lista_cruzada]&&entrada[col_mandante]!="SI"){
        console.log("entrada con lista cruzada;",entrada)
        bloques[" "]
      }
      
      bloques.forEach((tipo_hora)=>{
        console.log("curso-tipo,hora:",entrada,tipo_hora)
        if(tipo_hora||(entrada[col_Lista_cruzada]&&entrada[col_mandante]!="SI")){
        let tipo = tipo_hora.trim().split(" ")[0]
        let hora = tipo_hora.trim().split(" ")[1]
        
        let nueva_entrada=new Array(25).fill("")
        nueva_entrada[0]=entrada[col_NRC]
        nueva_entrada[1]=entrada[col_materia]
        nueva_entrada[2]=entrada[col_curso]
        nueva_entrada[3]=entrada[col_titulo]
        nueva_entrada[4]=entrada[col_seccion]
        
        nueva_entrada[5]=entrada[col_Lista_cruzada]
        if((entrada[col_Lista_cruzada]&&entrada[col_mandante]!="SI")){
          entrada[col_Lista_cruzada]=""}
        nueva_entrada[6]=entrada[col_conector_liga]
        nueva_entrada[7]="TEORIA"
        nueva_entrada[8]=entrada[col_codigo]=="ING6103"?"i":"1"
        nueva_entrada[9]="Y"
        nueva_entrada[10]=entrada[col_cupos]
        if(tipo_hora){
        nueva_entrada[11]=tipo=="LAB/TALLER"?"LABT":tipo
        nueva_entrada[12]=""
        nueva_entrada[13]=""
        console.log(dias[idx],dias,idx)
        nueva_entrada[14]=dias[idx].toUpperCase()
        nueva_entrada[15]=hora.split("-")[0]
        nueva_entrada[16]=hora.split("-")[1]
        nueva_entrada[17]=tipo=="CLAS"?"1":tipo=="AYUD"?"2":"3"
        nueva_entrada[18]=tipo=="CLAS"?entrada[col_profesor1]:""
        nueva_entrada[19]=nueva_entrada[11]=="LABT"? entrada[col_profesor_lab]:tipo=="CLAS"?entrada[col_profesor2]:""
        nueva_entrada[20]=""
        nueva_entrada[21]=""
        nueva_entrada[22]=""
        nueva_entrada[23]=""
        }

        dPSA.push(nueva_entrada)




      
    }
    
    })




    })




  })

  return dPSA
  
}
function agregar_fechas(dpsa,fecha_inicio_clases,fecha_fin_clases,fecha_inicio_ayud,fecha_fin_ayud,data_programacion){
  
  return dpsa.map((entrada)=>{
    
    if(!entrada[17]){

      //no hace nada
    }
    else if (entrada[11]=="CLAS"){
    entrada[12]=fecha_inicio_clases
    entrada[13]=fecha_fin_clases
    }
    else{
      entrada[12]=fecha_inicio_ayud
      entrada[13]=fecha_fin_ayud
      let tipo=entrada[11]=="LABT"?"LAB/TALLER":entrada[11]
      let sala_especial=data_programacion.find((fila)=>
      entrada[1]==fila[0].slice(0,3)&&
      entrada[2]==fila[0].slice(-4)&&
      entrada[4]==fila[1]&&
      tipo==fila[6])
      if(sala_especial){
      console.log(entrada)
      console.log(sala_especial)
      entrada[20]=sala_especial[5]}
    }
    return entrada



  })
}
function rellenar_HORARIO_ING(data_maestro,col_dias,dias,hoja_maestro){
  const col_area=obtenerNumeroDeColumna(hoja_maestro,"AREA",1)
  const col_plan_estudio=obtenerNumeroDeColumna(hoja_maestro,"PLAN DE ESTUDIO",1)
  const col_codigo=obtenerNumeroDeColumna(hoja_maestro,"CODIGO",1)
  const col_NRC=obtenerNumeroDeColumna(hoja_maestro,"NRC",1)
  const col_materia=obtenerNumeroDeColumna(hoja_maestro,"MATERIA",1)
  const col_curso=obtenerNumeroDeColumna(hoja_maestro,"CURSO",1)
  const col_seccion=obtenerNumeroDeColumna(hoja_maestro,"SECCIONES",1)
  const col_titulo=obtenerNumeroDeColumna(hoja_maestro,"TITULO",1)
  const col_Lista_cruzada=obtenerNumeroDeColumna(hoja_maestro,"LC",1)
  const col_profesor1=obtenerNumeroDeColumna(hoja_maestro,"RUT PROFESOR 1",1)
  const col_nombre_profesor1=obtenerNumeroDeColumna(hoja_maestro,"NOMBRE PROFESOR BANNER 1 \n(PROFESOR PRINCIPAL SESIÓN 01)",1)
  const col_nombre_profesor2=obtenerNumeroDeColumna(hoja_maestro,"NOMBRE PROFESOR 2\n(2DO PROFESOR - SESIÓN 02)",1)
  const col_nombre_profesorlab=obtenerNumeroDeColumna(hoja_maestro,"PROFESOR LABT ",1)
  const col_mandante=obtenerNumeroDeColumna(hoja_maestro,"CURSO MANDANTE",1)
  const col_profesor2=obtenerNumeroDeColumna(hoja_maestro,"RUT PROFESOR 2",1)
  const col_profesor_lab=obtenerNumeroDeColumna(hoja_maestro,"RUT PROFESOR LABT",1)
  const col_cupos=obtenerNumeroDeColumna(hoja_maestro,"CUPOS 202420",1)
  
  const dPSA=[]
  console.log("numero de columnas dias",col_dias)
  data_maestro.forEach((entrada)=>{
    if(entrada[col_Lista_cruzada]&&entrada[col_mandante]!="SI"){
      let curso_mandante=data_maestro.find((elemento)=>elemento[col_Lista_cruzada]==entrada[col_Lista_cruzada])
      col_dias.forEach((columna)=>{
        entrada[columna]=curso_mandante[columna]
      })
    }
    col_dias.forEach((columna,idx)=>{
      const bloques=entrada[columna].split(",")
      
      bloques.forEach((tipo_hora)=>{
        if(tipo_hora){
        let tipo = tipo_hora.trim().split(" ")[0]
        let hora = tipo_hora.trim().split(" ")[1]
        
        let nueva_entrada=new Array(18).fill("")
        nueva_entrada[0]=entrada[col_area]
        nueva_entrada[1]=entrada[col_plan_estudio]
        nueva_entrada[2]=entrada[col_NRC]
        nueva_entrada[3]=entrada[col_Lista_cruzada]
        nueva_entrada[4]=entrada[col_materia]
        nueva_entrada[5]=entrada[col_curso]
        nueva_entrada[6]=entrada[col_seccion]
        nueva_entrada[7]=entrada[col_titulo]
        if(tipo_hora){
          if(idx==0){
            nueva_entrada[8]=hora
          }
          if(idx==1){
            nueva_entrada[9]=hora
          }
          if(idx==2){
            nueva_entrada[10]=hora
          }
          if(idx==3){
            nueva_entrada[11]=hora
          }
          if(idx==4){
            nueva_entrada[12]=hora
          }
        
        nueva_entrada[13]=""
        nueva_entrada[14]=""
        nueva_entrada[15]=""
        nueva_entrada[16]=tipo=="LAB/TALLER"?"LABT":tipo
        let nombreprofesor=""
        if(tipo=="LAB/TALLER"){
          if(entrada[col_nombre_profesorlab]){
            nombreprofesor=entrada[col_nombre_profesorlab]
          }else{
            nombreprofesor=entrada[col_nombre_profesor1]
            if(entrada[col_nombre_profesor2]!=""){
              nombreprofesor=entrada[col_nombre_profesor1]+"/"+ entrada[col_nombre_profesor2]
            }


          }
        }else{
          nombreprofesor=entrada[col_nombre_profesor1]
          if(entrada[col_nombre_profesor2]!=""){
          nombreprofesor=entrada[col_nombre_profesor1]+"/"+ entrada[col_nombre_profesor2]
          }    
        }
        nueva_entrada[17]=nombreprofesor

        }
        dPSA.push(nueva_entrada)




      
    }
    
    })




    })




  })

  return dPSA
  
}
function rellenar_evaluaciones(data_maestro,hoja_maestro,encabezado){
  const col_codigo=obtenerNumeroDeColumna(hoja_maestro,"CODIGO",1)
  const col_NRC=obtenerNumeroDeColumna(hoja_maestro,"NRC",1)
  const col_materia=obtenerNumeroDeColumna(hoja_maestro,"MATERIA",1)
  const col_curso=obtenerNumeroDeColumna(hoja_maestro,"CURSO",1)
  const col_seccion=obtenerNumeroDeColumna(hoja_maestro,"SECCIONES",1)
  const col_titulo=obtenerNumeroDeColumna(hoja_maestro,"TITULO",1)
  const col_Lista_cruzada=obtenerNumeroDeColumna(hoja_maestro,"LC",1)
  const col_profesor1=obtenerNumeroDeColumna(hoja_maestro,"RUT PROFESOR 1",1)
  const col_profesor2=obtenerNumeroDeColumna(hoja_maestro,"RUT PROFESOR 2",1)
  const col_profesor_lab=obtenerNumeroDeColumna(hoja_maestro,"RUT PROFESOR LABT",1)
  const col_cupos=obtenerNumeroDeColumna(hoja_maestro,"CUPOS 202420",1)
  const col_mandante=obtenerNumeroDeColumna(hoja_maestro,"CURSO MANDANTE",1)
  const col_observaciones=obtenerNumeroDeColumna(hoja_maestro,"OBSERVACION",1)
  const col_area=obtenerNumeroDeColumna(hoja_maestro,"AREA",1)
  const dPSA=[]
  const col_conector_liga=obtenerNumeroDeColumna(hoja_maestro,"CONECTOR DE LIGA",1)
  const diasSemana = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
  const dias = encabezado.slice(col_observaciones)
  data_maestro.forEach((entrada,idx)=>{
    let col_dias=entrada.slice(col_observaciones)
    col_dias.forEach((columna,idx)=>{
      if(columna){
        let salida=columna.trim().split(" ")
        let dia=''
        let tipo=''
        let hora=""
        if (salida.length==2){
        tipo = salida[0]
        hora = salida[1]
        }else if(salida.length==1){
        tipo ="T"
        hora = "19:30-21:20"
        }else{
        dia = salida[0]
        tipo = salida[1]
        hora = salida[2]
        }
        console.log("dia:",dia,"tipo:",tipo,"hora:",hora)
        let nueva_entrada=new Array(25).fill("")
        nueva_entrada[0]=entrada[col_NRC]
        nueva_entrada[1]=entrada[col_materia]
        nueva_entrada[2]=entrada[col_curso]
        nueva_entrada[3]=entrada[col_titulo]
        nueva_entrada[4]=entrada[col_seccion]
        nueva_entrada[5]=entrada[col_Lista_cruzada]
        if((entrada[col_Lista_cruzada]&&entrada[col_mandante]!="SI")){
          entrada[col_Lista_cruzada]=""}
        nueva_entrada[6]=entrada[col_conector_liga]
        nueva_entrada[7]="TEORIA"
        
        nueva_entrada[8]=entrada[col_codigo]=="ING6103"?"i":"1"
        nueva_entrada[9]=""
        nueva_entrada[10]=entrada[col_cupos]
        nueva_entrada[11]=tipo=="EXAM"?"EXAM":"PRBA"
        nueva_entrada[12]=convertirFechaAString(dias[idx])
        nueva_entrada[13]=convertirFechaAString(dias[idx])
        
        nueva_entrada[14]=diasSemana[dias[idx].getDay()]
        nueva_entrada[15]=hora.split("-")[0]
        nueva_entrada[16]=hora.split("-")[1]
        nueva_entrada[17]=''
        nueva_entrada[18]=""
        nueva_entrada[19]=""
        nueva_entrada[20]=""
        nueva_entrada[21]=""
        nueva_entrada[22]=""
        nueva_entrada[23]=""
        nueva_entrada[24]=tipo
        

        dPSA.push(nueva_entrada)




      
    



    }
    })




  })

  return dPSA
  
}
function agregar_fechas_HORARIO_ING(horario_ing,fecha_inicio_clases,fecha_fin_clases,fecha_inicio_ayud,fecha_fin_ayud,data_programacion){
  console.log(data_programacion)
  return horario_ing.map((entrada)=>{
    if(!entrada[16]){}

    else if (entrada[16]=="CLAS"){
    entrada[13]=fecha_inicio_clases
    entrada[14]=fecha_fin_clases
    }
    else{
      entrada[13]=fecha_inicio_ayud
      entrada[14]=fecha_fin_ayud
      
    }
    return entrada



  })
}
function rellenar_evaluaciones_horarioING(data_maestro,hoja_maestro,encabezado){
  
  const col_NRC=obtenerNumeroDeColumna(hoja_maestro,"NRC",1)
  const col_materia=obtenerNumeroDeColumna(hoja_maestro,"MATERIA",1)
  const col_curso=obtenerNumeroDeColumna(hoja_maestro,"CURSO",1)
  const col_seccion=obtenerNumeroDeColumna(hoja_maestro,"SECCIONES",1)
  const col_titulo=obtenerNumeroDeColumna(hoja_maestro,"TITULO",1)
  const col_Lista_cruzada=obtenerNumeroDeColumna(hoja_maestro,"LC",1)
  const col_area=obtenerNumeroDeColumna(hoja_maestro,"AREA",1)
  const col_plan_estudio=obtenerNumeroDeColumna(hoja_maestro,"PLAN DE ESTUDIO",1)
  const col_mandante=obtenerNumeroDeColumna(hoja_maestro,"CURSO MANDANTE",1)
  const col_observaciones=obtenerNumeroDeColumna(hoja_maestro,"OBSERVACION",1)
  const col_nombre_profesor1=obtenerNumeroDeColumna(hoja_maestro,"NOMBRE PROFESOR BANNER 1 \n(PROFESOR PRINCIPAL SESIÓN 01)",1)
  const col_nombre_profesor2=obtenerNumeroDeColumna(hoja_maestro,"NOMBRE PROFESOR 2\n(2DO PROFESOR - SESIÓN 02)",1)
  const col_nombre_profesorlab=obtenerNumeroDeColumna(hoja_maestro,"PROFESOR LABT ",1)
  
  
  const dPSA=[]
  const diasSemana = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
  const dias = encabezado.slice(col_observaciones)
  data_maestro.forEach((entrada,idx)=>{
    let col_dias=entrada.slice(col_observaciones)
    col_dias.forEach((columna,idx)=>{
      if(columna){
        let salida=columna.trim().split(" ")
        let dia=''
        let tipo=''
        let hora=""
        if (salida.length==2){
        tipo = salida[0]
        hora = salida[1]
        }else if(salida.length==1){
        tipo ="T"
        hora = "19:30-21:20"
        }else{
        dia = salida[0]
        tipo = salida[1]
        hora = salida[2]
        }
        console.log("dia:",dia,"tipo:",tipo,"hora:",hora)
        let nueva_entrada=new Array(18).fill("")
        nueva_entrada[0]=entrada[col_area]
        nueva_entrada[1]=entrada[col_plan_estudio]
        nueva_entrada[2]=entrada[col_NRC]
        nueva_entrada[3]=entrada[col_Lista_cruzada]
        nueva_entrada[4]=entrada[col_materia]
        nueva_entrada[5]=entrada[col_curso]
        nueva_entrada[6]=entrada[col_seccion]
        nueva_entrada[7]=entrada[col_titulo]
        console.log("dia de la semana: ",dias[idx],typeof dias[idx])
        let dia_semana=diasSemana[dias[idx].getDay()]
         if(dia_semana=="LUNES"){
          nueva_entrada[8]=hora
        }if(dia_semana=="MARTES"){
          nueva_entrada[9]=hora
        }if(dia_semana=="MIERCOLES"){
          nueva_entrada[10]=hora
        }if(dia_semana=="JUEVES"){
          nueva_entrada[11]=hora
        }if(dia_semana=="VIERNES"){
          nueva_entrada[12]=hora
        }
        
        nueva_entrada[13]=convertirFechaAString(dias[idx])
        nueva_entrada[14]=convertirFechaAString(dias[idx])
        
        nueva_entrada[15]=""
        nueva_entrada[16]=tipo=="EXAM"?"EXAM":"PRBA"
        let nombreprofesor=""
        if(tipo=="LAB/TALLER"){
          if(entrada[col_nombre_profesorlab]){
            nombreprofesor=entrada[col_nombre_profesorlab]
          }else{
            nombreprofesor=entrada[col_nombre_profesor1]
            if(entrada[col_nombre_profesor2]!=""){
              nombreprofesor=entrada[col_nombre_profesor1]+"/"+ entrada[col_nombre_profesor2]
            }


          }
        }else{
          nombreprofesor=entrada[col_nombre_profesor1]
          if(entrada[col_nombre_profesor2]!=""){
          nombreprofesor=entrada[col_nombre_profesor1]+"/"+ entrada[col_nombre_profesor2]
          }    
        }
        nueva_entrada[17]=nombreprofesor
       
      if(entrada[col_Lista_cruzada]!=""){
        let listas_cruzadas=data_maestro.filter((elementos)=>elementos[col_Lista_cruzada]==entrada[col_Lista_cruzada]&&
        elementos[col_mandante]!="SI")
        listas_cruzadas.forEach((lC)=>{
          let entrada_cruzada=[...nueva_entrada]
          entrada_cruzada[2]=lC[col_NRC]
          entrada_cruzada[6]=lC[col_seccion]
          entrada_cruzada[1]=lC[col_plan_estudio]
          dPSA.push(entrada_cruzada)



        })
      }
      dPSA.push(nueva_entrada)




      
    



    }
    })




  })

  return dPSA
  
}
function generarFechasEntre(fInicial, fFinal) {
    const fechas = [];
    const [diaInicio, mesInicio, añoInicio] = fInicial.split('/').map(Number);
    const [diaFin, mesFin, añoFin] = fFinal.split('/').map(Number);

    const inicio = new Date(añoInicio, mesInicio - 1, diaInicio);
    const fin = new Date(añoFin, mesFin - 1, diaFin);

    while (inicio <= fin) {
        const dia = String(inicio.getDate()).padStart(2, '0');
        const mes = String(inicio.getMonth() + 1).padStart(2, '0');
        const año = inicio.getFullYear();
        fechas.push(`${dia}/${mes}/${año}`);
        inicio.setDate(inicio.getDate() + 1); // Incrementa el día
    }

    return fechas;
}
function verificarFinDeSemana(listaFechas) {
    return listaFechas.map(fecha => {
        const [dia, mes, año] = fecha.split('/').map(Number);
        const diaSemana = new Date(año, mes - 1, dia).getDay(); // Obtiene el día de la semana
        return diaSemana !== 0 && diaSemana !== 6; // true si no es fin de semana
    });
}
function compareLists(oldList, newList, keyColumns,enunciado) {
  // Convert both lists to maps using the key as the unique identifier
  function listToMap(list, keyCols) {
  const map = new Map();
  list.forEach(row => {
    const key = keyCols.map(col => row[col]).join('||');
    console.log('Generated key:', key, 'from row:', row);
    map.set(key, row);
  });
  return map;
}

  const oldMap = listToMap(oldList, keyColumns);
  const newMap = listToMap(newList, keyColumns);
  console.log("Antiguo Dpsa",oldList)
  console.log("Nuevo DPSA",newList)

  const differences = [];

  // Compare oldMap and newMap for changes, additions, and removals
  oldMap.forEach((oldRow, key) => {
    if (!newMap.has(key)) {
      // Row was removed
      differences.push([`REMOVED `,getCurrentDateDayAndTime(),...oldRow]);
    } else {
      const newRow = newMap.get(key);
      const changedColumns = [];
      oldRow.forEach((value, colIndex) => {
        // Skip checking key columns
        if (!keyColumns.includes(colIndex) && value != newRow[colIndex]) {
          changedColumns.push([colIndex+3,enunciado[colIndex+2]]);
        }
      });

      if (changedColumns.length > 0) {
        differences.push([`CHANGED ${changedColumns.join('|')}` ,getCurrentDateDayAndTime(), ...newRow]);
      } else {
        // No changes
        differences.push(['',, ...newRow]);
      }
    }
  });

  // Check for added rows
  newMap.forEach((newRow, key) => {
    if (!oldMap.has(key)) {
      differences.push([`ADDED `,getCurrentDateDayAndTime(), ...newRow]);
    }
  });

  return differences;
}
function getCurrentDateDayAndTime() {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const days = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
  const currentDay = days[now.getDay()];
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const currentTime = `${hours}:${minutes}:${seconds}`;
  return `${currentDate}, ${currentTime}`;
}
function convertirFechaAString(fecha) {
  // Verificar si es una instancia válida de Date
  if (!(fecha instanceof Date) || isNaN(fecha)) {
    throw new Error("Entrada inválida: debe ser una fecha válida.");
  }

  // Obtener día, mes y año
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const anio = fecha.getFullYear();

  // Formatear la fecha como "dd/mm/aaaa"
  return `${dia}/${mes}/${anio}`;
}
function removeSpecificPermissions(fileId, emails) {
  // Obtén el archivo por su ID
  var file = DriveApp.getFileById(fileId);

  // Recorre la lista de correos y elimina permisos
  emails.forEach(function(email) {
    try {
      // Intenta eliminar como editor
      file.removeEditor(email);

      // Intenta eliminar como visualizador

      Logger.log("Permisos eliminados para: " + email);
    } catch (e) {
      Logger.log("No se pudieron eliminar permisos para: " + email + ". Error: " + e.message);
    }
  });
}
function removePermissionsFromList(folderId, lista_datos) {
  // Obtén la carpeta por su ID
  var folder = DriveApp.getFolderById(folderId);

  // Recorre cada elemento de la lista
  lista_datos.forEach(function(entry) {
    var email = entry.mail;
    var archivos = entry.archivos;

    // Para cada archivo en la lista del usuario
    archivos.forEach(function(fileName) {
      // Busca el archivo por su nombre dentro de la carpeta
      var files = folder.getFilesByName(fileName);

      if (files.hasNext()) {
        var file = files.next(); // Obtén el archivo

        try {
          // Quita permisos para este correo
          file.removeEditor(email); // Intenta eliminar como editor
          
          Logger.log("Permisos eliminados para " + email + " en el archivo: " + fileName);
        } catch (e) {
          Logger.log("No se pudo eliminar permisos para " + email + " en el archivo: " + fileName + ". Error: " + e.message);
        }
      } else {
        Logger.log("No se encontró el archivo: " + fileName + " en la carpeta para el usuario: " + entry.name);
      }
    });
  });
}
function parseCustomDate(dateString, year = new Date().getFullYear()) {
  
  const monthMap = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
  };

  const [day, monthText] = dateString.split('-');
  const month = monthMap[monthText.toLowerCase()];
  
  if (month === undefined) {
    throw new Error(`Invalid month: ${monthText}`);
  }

  return new Date(year, month, parseInt(day, 10));
}
  






