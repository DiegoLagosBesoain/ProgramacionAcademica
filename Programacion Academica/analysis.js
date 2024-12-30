function obtener_bloques(data_maestro,encabezado){
  
  const col_codigo_clases=obtener_nombre_columna_data(encabezado,"Clases A PROGRAMAR")
  const col_codigo_ayudantias=obtener_nombre_columna_data(encabezado,"Ayudantías PROGRAMAR")
  const col_codigo_laboratorios=obtener_nombre_columna_data(encabezado,"Laboratorios o Talleres PROGRAMAR")
  const col_rut_profesor=obtener_nombre_columna_data(encabezado,"RUT PROFESOR 1")
  const col_rut_profesor_lab=obtener_nombre_columna_data(encabezado,"RUT PROFESOR LABT")
  const col_nombre_profesor=obtener_nombre_columna_data(encabezado,"NOMBRE PROFESOR 1 \n(PROFESOR PRINCIPAL SESIÓN 01)")
  const col_nombre_profesor_lab=obtener_nombre_columna_data(encabezado,"PROFESOR LABT ")
  const col_codigos=obtener_nombre_columna_data(encabezado,"CODIGO")
  const col_nombre_curso=obtener_nombre_columna_data(encabezado,"TITULO")
  const col_seccion = obtener_nombre_columna_data(encabezado,"SECCIONES")
  const col_sala_espcial = obtener_nombre_columna_data(encabezado,"Sala especial")
  const col_semestre_plan_comun =  obtener_nombre_columna_data(encabezado,"Plan Común")
  const col_horario_lunes =  obtener_nombre_columna_data(encabezado,"LUNES")
  const col_horario_martes =  obtener_nombre_columna_data(encabezado,"MARTES")
  const col_horario_miercoles=  obtener_nombre_columna_data(encabezado,"MIERCOLES")
  const col_horario_jueves =  obtener_nombre_columna_data(encabezado,"JUEVES")
  const col_horario_viernes =  obtener_nombre_columna_data(encabezado,"VIERNES")
  const col_concentracion = obtener_nombre_columna_data(encabezado,"Concentración")


  const resultados=[]
  const bloques=[]
  const detalles=[]
  data_maestro.forEach((seccion,idx)=>{
    let bloque =[]
    let detalle=[]
    let cant_clases=Number(seccion[col_codigo_clases])
    let cant_ayudantias=Number(seccion[col_codigo_ayudantias])
    let cant_laboratorio=Number(seccion[col_codigo_laboratorios])
    for(let i=0;i<cant_clases;i++){
      bloque =[]
      detalle=[]
      bloque.push(seccion[col_codigos])
      bloque.push(seccion[col_seccion])
      bloque.push(seccion[col_nombre_curso].split(" ").join("-"))
      bloque.push(seccion[col_rut_profesor])
      bloque.push(seccion[col_nombre_profesor].split(" ").join("-"))
      bloque.push("")
      bloque.push("CLAS")
      bloque.push(seccion[col_semestre_plan_comun])
      bloque.push(seccion[col_horario_lunes])
      bloque.push(seccion[col_horario_martes])
      bloque.push(seccion[col_horario_miercoles])
      bloque.push(seccion[col_horario_jueves])
      bloque.push(seccion[col_horario_viernes])
      detalle.push(seccion[col_codigos])
      detalle.push(...seccion.slice(col_semestre_plan_comun,col_concentracion+1))
      detalles.push(detalle)
      bloques.push(bloque)





    }
    for(let i=0;i<cant_ayudantias;i++){
      bloque =[]
      detalle=[]
      bloque.push(seccion[col_codigos])
      bloque.push(seccion[col_seccion])
      bloque.push(seccion[col_nombre_curso].split(" ").join("-"))
      bloque.push(seccion[col_rut_profesor])
      bloque.push(seccion[col_nombre_profesor].split(" ").join("-"))
      bloque.push("")
      bloque.push("AYUD")
      bloque.push(seccion[col_semestre_plan_comun])
      bloque.push(seccion[col_horario_lunes])
      bloque.push(seccion[col_horario_martes])
      bloque.push(seccion[col_horario_miercoles])
      bloque.push(seccion[col_horario_jueves])
      bloque.push(seccion[col_horario_viernes])
      detalle.push(seccion[col_codigos])
      detalle.push(...seccion.slice(col_semestre_plan_comun,col_concentracion+1))
      detalles.push(detalle)
      bloques.push(bloque)
      
    }
    for(let i=0;i<cant_laboratorio;i++){
      bloque =[]
      detalle=[]
      bloque.push(seccion[col_codigos])
      bloque.push(seccion[col_seccion])
      bloque.push(seccion[col_nombre_curso].split(" ").join("-"))
      bloque.push(seccion[col_rut_profesor_lab])
      bloque.push(seccion[col_nombre_profesor_lab].split(" ").join("-"))
      bloque.push(seccion[col_sala_espcial].split(" ").join("-"))
      bloque.push("LAB/TALLER")
      bloque.push(seccion[col_semestre_plan_comun])
      bloque.push(seccion[col_horario_lunes])
      bloque.push(seccion[col_horario_martes])
      bloque.push(seccion[col_horario_miercoles])
      bloque.push(seccion[col_horario_jueves])
      bloque.push(seccion[col_horario_viernes])
      detalle.push(seccion[col_codigos])
      detalle.push(...seccion.slice(col_semestre_plan_comun,col_concentracion+1))
      detalles.push(detalle)
      bloques.push(bloque)
      
    }
  resultados.push(bloques)
  resultados.push(detalles)



  })
  return resultados
  
}
function obtener_nombre_columna_data(encabezados,nombreColumna){
  const indice = encabezados.indexOf(nombreColumna);

  // Si no se encuentra el nombre, lanzar un error o devolver un valor específico
  if (indice === -1) {
    throw new Error(`La columna con el nombre "${nombreColumna}" no fue encontrada}.`);
  }

  // Los índices empiezan desde 0, pero las columnas en Sheets empiezan desde 1
  return indice;
}
function obtener_topes_semestre(bloques){
  let topes = []
  Object.keys(bloques).forEach((hora,idx2)=>{
    Object.keys(bloques[hora]).forEach((dia,idx)=>{
      let revision=bloques[hora][dia].map((valor)=>valor.split(" ")[0])
      
      let repetidos=obtenerIndicesPorElementos(revision)
      
      let indices=repetidos.reduce((acumulado,sublist)=>acumulado.concat(sublist),[])
      let columna=idx+2;
      
      indices.forEach((indice)=>{
      topes.push([2+indice+idx2*10,columna])   
        
    })



    })





  })



  return topes

}
function obtener_topes_semestre_nuevo(bloques){
  let topes = []
  Object.keys(bloques).forEach((hora,idx2)=>{
    Object.keys(bloques[hora]).forEach((dia,idx)=>{

      let revision=bloques[hora][dia].map((valor)=>valor.split(" ").slice(-7,-1))
      let codigos=bloques[hora][dia].map((valor)=>valor.split(" ")[0])
      let repetidos=obtenerIndicesPorCoincidencia(revision,codigos)
      
      let indices=repetidos.reduce((acumulado,sublist)=>acumulado.concat(sublist),[])
      let columna=idx+2;
      
      indices.forEach((indice)=>{
      topes.push([2+indice+idx2*10,columna])   
        
    })



    })





  })



  return topes

}
function obtener_topes_horario_protegido(bloques){
  let topes = []
  Object.keys(bloques).forEach((hora,idx2)=>{
    Object.keys(bloques[hora]).forEach((dia,idx)=>{
      
      let columna = idx+2;
      
      bloques[hora][dia].forEach((entrada,indice)=>{
      let curso=entrada.split(" ")
      
      if(Number(curso[7])>1&&Number(curso[7])<5){
        if(hora=="18:30-19:20"||hora=="17:30-18:20"){
          if(dia=="Martes"){
            topes.push([2+indice+idx2*10,columna])
          }

        }
        if(hora=="10:30-11:20"||hora=="11:30-12:20"){
          if(dia=="Viernes"){
            topes.push([2+indice+idx2*10,columna])
          }

        }
      }
      if(hora=="12:30-13:20"&&entrada!=" "){
          if(dia=="Viernes"){
            topes.push([2+indice+idx2*10,columna])
          }
      }
      
      })
      
         
        
    })



    })



  return topes

}
function obtener_topes_horario_protegido_5_y_6(bloques){
  let topes = []
  Object.keys(bloques).forEach((hora,idx2)=>{
    Object.keys(bloques[hora]).forEach((dia,idx)=>{
      
      let columna = idx+2;
      
      bloques[hora][dia].forEach((entrada,indice)=>{
      let curso=entrada.split(" ")
      
      if(curso.slice(-7).includes("5")){
        if(hora=="18:30-19:20"||hora=="17:30-18:20"){
          if(dia=="Martes"){
            topes.push([2+indice+idx2*10,columna])
          }

        }
        if(hora=="10:30-11:20"||hora=="11:30-12:20"){
          if(dia=="Viernes"){
            topes.push([2+indice+idx2*10,columna])
          }

        }
        
      }
      if(hora=="12:30-13:20"&&entrada!=" "){
          console.log("entrada: ",curso)
          if(dia=="Viernes"){
            topes.push([2+indice+idx2*10,columna])
          }
      }
      
      })
      
         
        
    })



    })



  return topes

}
function obtener_topes_sala_especial(bloques){
  let topes = []
  Object.keys(bloques).forEach((hora,idx2)=>{
    Object.keys(bloques[hora]).forEach((dia,idx)=>{
      
      let columna = idx+2;
      let labs = bloques[hora][dia].map((elemento)=>elemento.split(" ")).filter((curso)=>{
        
        return (curso[6]=="LAB/TALLER"||curso[6]=="AYUD")
      })
      
      if(labs.length>0){
        
        let espacios_concurrentes = obtenerIndicesPorElementos_sala_especial(bloques[hora][dia].map((elemento)=>elemento.split(" ")[5]))
        let indices=espacios_concurrentes.reduce((acumulado,sublist)=>acumulado.concat(sublist),[])
        
        indices=[...new Set(indices)]
        indices.forEach((indice)=>{
        topes.push([2+indice+idx2*10,columna])}) 



      }
      
         
        
    })



    })


  
  return topes

}
function obtener_topes_sala_especial_otras_hojas(bloques,bloques1,bloques2,bloques3){
  let topes = []
  Object.keys(bloques).forEach((hora,idx2)=>{
    Object.keys(bloques[hora]).forEach((dia,idx)=>{
      
      let columna = idx+2;
      bloques[hora][dia].forEach((seccion,indice)=>
      { 
        let curso=seccion.split(" ")
        if (seccion!=""&&(curso[6]=="LAB/TALLER"||curso[6]=="AYUD")&&curso[5]!=""){
          console.log("ayudantia o lab encontrado",curso)
          if(revisar_otras_hojas_salas(bloques1[hora][dia],bloques2[hora][dia],bloques3[hora][dia],curso[5])){
            topes.push([2+indice+idx2*10,columna])

          }



        }

      })
      
              
    })
    })
  return topes

}
function obtener_topes_concentraciones_primer_semestre(bloques){
  let topes = []
  Object.keys(bloques).forEach((hora,idx2)=>{
    Object.keys(bloques[hora]).forEach((dia,idx)=>{
      let columna = idx+2;
      bloques[hora][dia].forEach((entrada,indice)=>{
      let curso=entrada.split(" ")
      
      if(curso[20] != "" &&curso[20]!=undefined){
        let semestre_de_concentracion=curso[20]
        console.log(semestre_de_concentracion,curso)
        if(semestre_de_concentracion.length===2){
        semestre_de_concentracion=semestre_de_concentracion[0]
        }
        if(Number(semestre_de_concentracion)%2!=0){
        let bloque_filtrado=bloques[hora][dia].filter((seccion)=>seccion.split(" ")[0]!=curso[0])
        let columnasPermitidas=buscar_columnas_permitidas(semestre_de_concentracion,curso.slice(-7,-1))
        if(analizar_bloques_concentraciones(semestre_de_concentracion,bloque_filtrado,columnasPermitidas)){
          console.log("concentracion mal asignada",curso)
          topes.push([2+indice+idx2*10,columna])
        }

        }

        



      }
      
      })
      
         
        
    })
    
  })
  
  return topes

}
function obtener_topes_concentraciones_segundo_semestre(bloques){
  let topes = []
  Object.keys(bloques).forEach((hora,idx2)=>{
    Object.keys(bloques[hora]).forEach((dia,idx)=>{
      let columna = idx+2;
      bloques[hora][dia].forEach((entrada,indice)=>{
      let curso=entrada.split(" ")
      
      if(curso[20] != "" &&curso[20]!=undefined){
        let semestre_de_concentracion=curso[20]
        console.log(semestre_de_concentracion,curso)
        if(semestre_de_concentracion.length===2){
        semestre_de_concentracion=semestre_de_concentracion[0]
        }
        if(Number(semestre_de_concentracion)%2==0){
        let bloque_filtrado=bloques[hora][dia].filter((seccion)=>seccion.split(" ")[0]!=curso[0])
        let columnasPermitidas=buscar_columnas_permitidas(semestre_de_concentracion,curso.slice(-7,-1))
        console.log(curso,columnasPermitidas)
        if(analizar_bloques_concentraciones(semestre_de_concentracion,bloque_filtrado,columnasPermitidas)){
          console.log("concentracion mal asignada",curso)
          topes.push([2+indice+idx2*10,columna])
        }

        }



      }
      
      })
      
         
        
    })
    
  })
  
  return topes

}
function obtener_topes_disponibilidad_profesores(bloques,bloques5y6,bloques7y8,bloques_titulacion){
  let topes = []
  let topes_disponibilidad=[]
  let topes_bloque_ya_asignado=[]
  let horarios_usados = {}
  Object.keys(bloques).forEach((hora,idx2)=>{
    horarios_usados[hora]={}
    Object.keys(bloques[hora]).forEach((dia,idx)=>{
      horarios_usados[hora][dia]=[]
      let columna = idx+2;
      
      bloques[hora][dia].forEach((entrada,indice)=>{
      let curso=entrada.split(" ")
      
      if(curso[3]!="" &&curso[6]=="CLAS"){
        
        horarios_usados[hora][dia]
        if(dia=="Lunes"){
            
            if(revisar_otras_hojas(bloques5y6[hora][dia],bloques7y8[hora][dia],bloques_titulacion[hora][dia],curso[3])){
              topes_bloque_ya_asignado.push([2+indice+idx2*10,columna])
              


            }
            if(!curso[8].includes(hora)){
              topes_disponibilidad.push([2+indice+idx2*10,columna])
            }
            else if(horarios_usados[hora][dia].includes(curso[3])){//ese horario ya se ocupo para ese profesor
              topes_bloque_ya_asignado.push([2+indice+idx2*10,columna])
            }
            else {
              horarios_usados[hora][dia].push(curso[3])
            }

            
          

        }
        if(dia=="Martes"){
            if(revisar_otras_hojas(bloques5y6[hora][dia],bloques7y8[hora][dia],bloques_titulacion[hora][dia],curso[3])){
              topes_bloque_ya_asignado.push([2+indice+idx2*10,columna])
              


            }          
          
            if(!curso[9].includes(hora)){
              topes_disponibilidad.push([2+indice+idx2*10,columna])
            }
            else if(horarios_usados[hora][dia].includes(curso[3])){//ese horario ya se ocupo para ese profesor
              topes_bloque_ya_asignado.push([2+indice+idx2*10,columna])
            }
            else {
              horarios_usados[hora][dia].push(curso[3])
            }
          

        }
        if(dia=="Miercoles"){
            if(revisar_otras_hojas(bloques5y6[hora][dia],bloques7y8[hora][dia],bloques_titulacion[hora][dia],curso[3])){
              topes_bloque_ya_asignado.push([2+indice+idx2*10,columna])
              


            }          
            if(!curso[10].includes(hora)){
              topes_disponibilidad.push([2+indice+idx2*10,columna])
            }
            else if(horarios_usados[hora][dia].includes(curso[3])){//ese horario ya se ocupo para ese profesor
              topes_bloque_ya_asignado.push([2+indice+idx2*10,columna])
            }
            else {
              horarios_usados[hora][dia].push(curso[3])
            }
          

        }
        if(dia=="Jueves"){
            if(revisar_otras_hojas(bloques5y6[hora][dia],bloques7y8[hora][dia],bloques_titulacion[hora][dia],curso[3])){
              topes_bloque_ya_asignado.push([2+indice+idx2*10,columna])
              


            }          
            if(!curso[11].includes(hora)){
              topes_disponibilidad.push([2+indice+idx2*10,columna])
            }
            else if(horarios_usados[hora][dia].includes(curso[3])){//ese horario ya se ocupo para ese profesor
              topes_bloque_ya_asignado.push([2+indice+idx2*10,columna])
            }
            else {
              horarios_usados[hora][dia].push(curso[3])
            }
          

        }
        if(dia=="Viernes"){
            if(revisar_otras_hojas(bloques5y6[hora][dia],bloques7y8[hora][dia],bloques_titulacion[hora][dia],curso[3])){
              topes_bloque_ya_asignado.push([2+indice+idx2*10,columna])
              


            }          
            if(!curso[12].includes(hora)){
              topes_disponibilidad.push([2+indice+idx2*10,columna])
            }
            else if(horarios_usados[hora][dia].includes(curso[3])){//ese horario ya se ocupo para ese profesor
              topes_bloque_ya_asignado.push([2+indice+idx2*10,columna])
            }
            else {
              horarios_usados[hora][dia].push(curso[3])
            }
          

        }
        
      }
      
      })
      
         
        
    })



    })

  topes[0]=topes_bloque_ya_asignado
  topes[1]=topes_disponibilidad
  
  return topes

}

function obtenerIndicesPorElementos(lista) {
  let indices = [];
  
  for (let i = 0; i < lista.length; i++) {
    for (let j = i + 1; j < lista.length; j++) {
      // Verificar si los elementos en posiciones 4 y 5 son iguales y los elementos son diferentes
      if (lista[i][3] === lista[j][3] && 
          lista[i][4] === lista[j][4] &&
          lista[i][0] === lista[j][0] &&
          lista[i][1] === lista[j][1] &&
          lista[i][2] === lista[j][2] &&
          JSON.stringify(lista[i]) !== JSON.stringify(lista[j])) {
        indices.push([i, j]); // Guardar los pares de índices
      }
    }
  }

  return indices;
}
function obtenerIndicesPorCoincidencia(lista,codigos) {
  const indices = [];
  const paresEncontrados = new Set(); // Conjunto para evitar duplicados

  for (let i = 0; i < lista.length; i++) {
    for (let j = i + 1; j < lista.length; j++) {  // Solo comparar después de i, para evitar duplicados
      let encontradoCoincidencia = false;

      for (let k = 0; k < lista[i].length; k++) {
        const valorBase = lista[i][k];
        const valorComparado = lista[j][k];

        // Si los valores no están vacíos, se realizan las comparaciones
        if (valorBase !== "" && valorComparado !== "") {
          if(codigos[i]!=codigos[j]){
          // Si ambos valores son iguales, se marca como coincidencia
          if (valorBase === valorComparado) {
            encontradoCoincidencia = true;
            break;
          } 

          // Si ambos son cadenas con un número seguido de una letra
          if (typeof valorBase === "string" && typeof valorComparado === "string") {
            // Comparamos la parte numérica de ambos
            const valorBaseNumerico = valorBase.replace(/[a-zA-Z]$/, "");
            const valorComparadoNumerico = valorComparado.replace(/[a-zA-Z]$/, "");

            // Si las partes numéricas coinciden, pero las letras son diferentes
            if (valorBaseNumerico === valorComparadoNumerico) {
              // Si uno tiene letra y el otro no, debe ser una coincidencia
              if (/[a-zA-Z]/.test(valorBase) && !/[a-zA-Z]/.test(valorComparado)) {
                encontradoCoincidencia = true;
                break;
              }
              if (!/[a-zA-Z]/.test(valorBase) && /[a-zA-Z]/.test(valorComparado)) {
                encontradoCoincidencia = true;
                break;
              }
              // Si las letras son diferentes (como "10f" y "10i"), no coinciden
              if (valorBase.charAt(valorBase.length - 1) !== valorComparado.charAt(valorComparado.length - 1)) {
                encontradoCoincidencia = false;
                break;
              } else {
                // Si las letras coinciden (o si no hay letra), entonces sí hay coincidencia
                encontradoCoincidencia = true;
                break;
              }
            }
          }
        }
      }
      }

      // Si se encontró una coincidencia, se agrega el par de índices
      if (encontradoCoincidencia) {
        const par = [i, j].join(","); // Crear el par como cadena para evitar duplicados
        if (!paresEncontrados.has(par)) {
          paresEncontrados.add(par); // Registrar el par como encontrado
          indices.push([i, j]); // Agregar a la lista de resultados
        }
      }
    }
  }

  return indices;
}






function obtenerIndicesPorElementos_sala_especial(lista) {
  let indices = [];
  

  for (let i = 0; i < lista.length; i++) {
    if (!lista[i]) continue; // Si es vacío, null o undefined, saltar la iteración

    for (let j = i + 1; j < lista.length; j++) {
      if (!lista[j]) continue; // Saltar si es vacío, null o undefined

      // Comparar elementos
      if (lista[i] === lista[j]) {
        indices.push([i, j]); // Guardar los pares de índices
      }
    }
  }

  return indices;
}
function existe_rut_bloque(lista,rut){

  return lista.map((string)=>string.split(" ")).some((lista)=>lista.includes(rut))
}
function revisar_otras_hojas(bloque1,bloque2,bloque3,rut){
  // los 3 otros bloques de los cuales no se esta viendo restricciones lee la hora y el dia especificado
  const bloques= [bloque1,bloque2,bloque3]
  
  return bloques.some((bloque)=>existe_rut_bloque(bloque,rut))




}
function revisar_otras_hojas_salas(bloque1,bloque2,bloque3,sala){
  // los 3 otros bloques de los cuales no se esta viendo restricciones lee la hora y el dia especificado
  const bloques= [bloque1,bloque2,bloque3]
  
  return bloques.some((bloque)=>existe_rut_bloque(bloque,sala))




}
function existe_sala_bloque(lista,sala){

  return lista.some((elemento)=>elemento.includes(sala))
}
function contieneEnRango(lista, inicio, fin) {
  
  return lista.some(elemento => elemento >= inicio && elemento <= fin);
}
function agruparSecciones(diccionario) {
  // Iterar sobre cada bloque de tiempo en el diccionario
  for (let hora in diccionario) {
    let dias = diccionario[hora];
    for (let dia in dias) {
      let datos = dias[dia];

      // Objeto temporal para agrupar por nombre y tipo (CLAS, AYUD, etc.)
      let tipoAgrupado = {};

      // Recorrer todas las entradas del día y agrupar por curso y tipo
      datos.forEach((entrada) => {
        if (entrada.trim()) {
          let partes = entrada.split(" "); // Dividir por espacios
          let nombreCurso = partes.slice(0, -3).join(" "); // Nombre del curso
          let seccion = partes[partes.length - 2]; // Número de sección
          let tipo = partes[partes.length - 1]; // Tipo: CLAS, AYUD, etc.

          let clave = `${nombreCurso} ${tipo}`; // Clave para agrupar

          // Si ya existe, agregar la sección; de lo contrario, inicializar
          if (tipoAgrupado[clave]) {
            tipoAgrupado[clave].push(seccion);
          } else {
            tipoAgrupado[clave] = [seccion];
          }
        }
      });

      // Consolidar los resultados agrupados
      let nuevaLista = [];
      for (let clave in tipoAgrupado) {
        let secciones = tipoAgrupado[clave].join(","); // Unir secciones con coma
        nuevaLista.push(`${clave} seccion ${secciones}`);
      }

      // Actualizar el día con la lista consolidada
      dias[dia] = nuevaLista;
    }
  }
  return diccionario;
}
function agregar_detalles(bloques,data_detalles_malla){
  
  
  Object.keys(bloques).forEach((hora,idx2)=>{
    Object.keys(bloques[hora]).forEach((dia,idx)=>{
      
      
      
      bloques[hora][dia].forEach((entrada,indice)=>{
      let curso = entrada.split(" ")
      
      let detalles = data_detalles_malla.find((elemento)=>curso[0]==elemento[0])
      bloques[hora][dia][indice]=curso.concat(detalles).join(" ")
      
      })
      
         
        
    })



    })



  return bloques






}
function analizar_bloques_concentraciones(semestre_concentracion,bloque_filtrado,columnasPermitidas){
  return bloque_filtrado.some((seccion,idx)=>{
  return seccion.split(" ").slice(-7).customInclude(semestre_concentracion,columnasPermitidas)})
}
function buscar_columnas_permitidas(semestre_concentracion,detalles_de_la_concentracion){
  const columnasPermitidas=[]
  detalles_de_la_concentracion.filter((elemento,idx)=>
  { 
    if(elemento == "P"){
      columnasPermitidas.push(idx)
      return true
    }
    if(elemento!=""){
      columnasPermitidas.push(idx)
      return true
    }
    


  })
  return columnasPermitidas
}

Array.prototype.customInclude = function(value, exclusionIndices) {
  return this.some((element, index) => 
    element === value && !exclusionIndices.includes(index)
  );
};

function eliminarElementosRepetidos(lista) {
  const unico = new Set();
  const resultado = [];

  for (let fila of lista) {
    const clave = JSON.stringify(fila); // Convertir la fila a una cadena única

    if (!unico.has(clave)) {
      unico.add(clave); // Agregar clave al conjunto si no existe
      resultado.push(fila); // Agregar fila al resultado
    }
  }

  return resultado;
}
function agruparHorarios(diccionario) {
  const horariosAgrupados = {};

  // Iterar sobre cada bloque de hora
  for (let hora in diccionario) {
    const dias = diccionario[hora];

    // Iterar sobre cada día de la semana
    for (let dia in dias) {
      const actividades = dias[dia];

      actividades.forEach((actividad) => {
        if (actividad.trim() !== "") {
          // Extraemos el nombre del curso, tipo y sección
          const listadoAsignatura = actividad.split(" ");
          const curso = listadoAsignatura[0];
          const seccion = listadoAsignatura[1];
          const tipo = listadoAsignatura[6];

          // Creamos una clave única para el curso y la sección
          const clave = `${curso} ${seccion}`;

          // Si no existe la clave en el objeto, la inicializamos
          if (!horariosAgrupados[clave]) {
            horariosAgrupados[clave] = {};
          }

          // Inicializamos el día si no existe
          if (!horariosAgrupados[clave][dia]) {
            horariosAgrupados[clave][dia] = [];
          }

          // Obtiene el horario de inicio y fin del bloque actual
          const [horaInicio, horaFin] = hora.split("-");

          // Revisa si hay un bloque existente que pueda ser extendido
          let bloqueAgrupado = false;

          for (let i = 0; i < horariosAgrupados[clave][dia].length; i++) {
  const bloque = horariosAgrupados[clave][dia][i];
  const [bloqueTipo, bloqueHoras] = bloque.split(" ");
  let [bloqueInicio, bloqueFin] = bloqueHoras.replace("'", "").split("-");

  // Verifica si el bloque actual es del mismo tipo y consecutivo
  if (bloqueTipo === tipo) {
    while (horasConsecutivas(bloqueFin, horaInicio)) {
      // Extiende el bloque existente
      bloqueFin = horaFin; // Actualiza el fin del bloque al nuevo horario
      horariosAgrupados[clave][dia][i] = `${bloqueTipo} ${bloqueInicio}-${bloqueFin}`;
      
      // Busca si hay más bloques consecutivos que extender
      const siguienteHora = horariosAgrupados[clave][dia][i + 1];
      if (!siguienteHora) break;

      const [siguienteTipo, siguienteHoras] = siguienteHora.split(" ");
      if (siguienteTipo !== tipo) break;

      const [siguienteInicio, siguienteFin] = siguienteHoras.replace("'", "").split("-");
      if (!horasConsecutivas(bloqueFin, siguienteInicio)) break;

      horaInicio = siguienteInicio;
      horaFin = siguienteFin;
    }
    bloqueAgrupado = true;
  }
}

          // Si no se pudo agrupar, crea un nuevo bloque
          if (!bloqueAgrupado) {
            horariosAgrupados[clave][dia].push(`${tipo} ${hora}`);
          }
        }
      });
    }
  }

  return horariosAgrupados;
}

// Función para verificar si las horas son consecutivas
function horasConsecutivas(horaFin, horaInicio) {
  const [horaF, minutoF] = horaFin.split(":").map(Number);
  const [horaI, minutoI] = horaInicio.split(":").map(Number);

  // Verifica si el horario de inicio comienza justo después del horario de fin
  if (horaF === horaI && minutoF + 10 === minutoI) {
    return true;
  }

  return false;
}
function quitarAcentos(palabra) {
  return palabra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function agregar_datos_dpsa(horarios,dpsa,datos_maestro_programacion){
  Object.keys(horarios).forEach((codigo_seccion)=>{
    let codigo=codigo_seccion.split(" ")[0]
    let seccion=codigo_seccion.split(" ")[1]
    Object.keys(horarios[codigo_seccion]).forEach((dia)=>{
      horarios[codigo_seccion][dia].forEach((bloque)=>{
        let tipo=bloque.trim().split(" ")[0]
        let bloque_tiempo=bloque.trim().split(" ")[1]
        let detalles=datos_maestro_programacion.find((entrada)=>
        entrada[0]==codigo&&entrada[1]==seccion&&entrada[6]==tipo)
        let nueva_entrada=new Array(24)
        nueva_entrada[1]=codigo
        nueva_entrada[2]=codigo.substring(0,3)
        nueva_entrada[3]=codigo.substring(3)
        nueva_entrada[4]=detalles[2]
        nueva_entrada[5]=seccion
        nueva_entrada[6]=""
        nueva_entrada[7]="TEORIA"
        nueva_entrada[8]=codigo=="ING6103"?i:"1"
        nueva_entrada[9]="Y"
        nueva_entrada[10]=""
        nueva_entrada[11]=tipo=="LAB/TALLER"? "LABT":tipo
        nueva_entrada[12]=""
        nueva_entrada[13]=""
        nueva_entrada[14]=dia.toUpperCase()
        nueva_entrada[15]=bloque_tiempo.split("-")[0]
        nueva_entrada[16]=bloque_tiempo.split("-")[1]
        neuva_entrada[17]=tipo=="LAB/TALLER"? "3":tipo=="CLAS"?"1":"2"
        nueva_entrada[18]=""








      })





    })





  })



}
function actualizar_data_maestro(data_maestro,horarios,col_dias,dias){
  Object.keys(horarios).forEach((curso_seccion)=>{
    let codigo=curso_seccion.split(" ")[0]
    let seccion=curso_seccion.split(" ")[1]
    let idx=-1
    nueva_entrada=data_maestro.find((entrada)=>{
      
      idx=idx+1
      return entrada[7]==codigo&&seccion==entrada[13]})
    Object.keys(horarios[curso_seccion]).forEach((dia)=>{
    let indice_dia=dias.findIndex((punto)=>punto==quitarAcentos(dia))
    nueva_entrada[col_dias[indice_dia]]= horarios[curso_seccion][dia].join(" ")
    


    })
    data_maestro[idx]=nueva_entrada



  })

  return data_maestro

}






