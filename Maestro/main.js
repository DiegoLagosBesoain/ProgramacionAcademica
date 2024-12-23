function onOpen(){
    const ui = SpreadsheetApp.getUi(); //crea referencia a la interfaz de usuario de Spreadsheet
  
    ui.createMenu("Macros")
      .addItem("Agregar secciones", "agregar_secciones")
      .addItem("Crear hoja por area","crear_hoja_por_area")
      .addItem("Validar Cambios","validar_cambios")
      .addItem("mostrarTodasLasHojas","mostrarTodasLasHojas")
      .addItem("Compartir enlaces","compartirYEnviarEnlace")
      .addItem("Extraer datos Hojas cordinadores","extraer_datos")
      .addItem("Actualizar con datos formulario","actualizar_datos")
      .addItem("Envio de formularios Jornada y honorarios","enviarFormulariosCondicional")
      
      
      .addToUi();
  }
  function agregar_secciones(){
  const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
  const hoja_presupuesto = hojasActuales.getSheetByName('Presupuesto');
  const semestre_espejo = Number(pedirParametro())
  const data_presupuesto = hoja_presupuesto.getDataRange().getValues();
  
  const columna_semestre = obtenerNumeroDeColumna(hoja_presupuesto,semestre_espejo,1)
  const columna_curso = obtenerNumeroDeColumna(hoja_presupuesto,"CURSO",1)
  const columna_codigo_curso = obtenerNumeroDeColumna(hoja_presupuesto,"Código curso",1)
  const col_plan_estudio = obtenerNumeroDeColumna(hoja_presupuesto,"Plan",1)
  
  data_presupuesto.shift()
  
  const curso_codigo_nombre = obtener_columnas_especificas(data_presupuesto,[columna_codigo_curso,columna_curso,columna_semestre,col_plan_estudio])
  console.log("curso_codigo_nombre",curso_codigo_nombre)
  //Ahora se obtiene el Curso-Materia
  const hoja_catalogo = hojasActuales.getSheetByName('CATALOGO');
  const data_catalogo = hoja_catalogo.getDataRange().getValues();
  const col_materia = obtenerNumeroDeColumna(hoja_catalogo,"MATERIA",1)
  const col_curso_catalogo = obtenerNumeroDeColumna(hoja_catalogo,"CURSO",1)
  const col_codigo = obtenerNumeroDeColumna(hoja_catalogo,"CODIGO",1)
  
  data_catalogo.shift()
  const curso_materia = obtener_columnas_especificas(data_catalogo,[col_codigo,col_materia,col_curso_catalogo])
  
  
  
  //Se obtienen los nrc
  
  const hoja_listado_nrc = hojasActuales.getSheetByName('NRC POR PERIODO ESPEJO')
  const data_listado_nrc = hoja_listado_nrc.getDataRange().getValues();
  
  const cursosConSecciones = asignarSecciones(curso_codigo_nombre, data_listado_nrc);
  
  const hoja_maestro=hojasActuales.getSheetByName('MAESTRO');
  const col_area_maestro = obtenerNumeroDeColumna(hoja_maestro,"AREA",1)
  const col_curso_maestro = obtenerNumeroDeColumna(hoja_maestro,"CURSO",1)
  const col_materia_maestro = obtenerNumeroDeColumna(hoja_maestro,"MATERIA",1)
  const entradas = generar_Entradas(cursosConSecciones,data_listado_nrc,data_catalogo,hoja_catalogo,hoja_listado_nrc,hoja_presupuesto,hoja_maestro,curso_materia,curso_codigo_nombre).map((entrada)=>{
  
    if (entrada[col_curso_maestro].trim()=="electivos"){
      if(entrada[col_materia_maestro]=="ICC"){
        entrada[col_area_maestro]="COMPUTACION"
      }
      if(entrada[col_materia_maestro]=="ICA"){
        entrada[col_area_maestro]="AMBIENTAL"
      }
      if(entrada[col_materia_maestro]=="ICE"){
        entrada[col_area_maestro]="ELECTRICA"
      }
      if(entrada[col_materia_maestro]=="ICI"){
        entrada[col_area_maestro]="INDUSTRIAL"
      }
      if(entrada[col_materia_maestro]=="IOC"){
        entrada[col_area_maestro]="OBRAS CIVILES"
      }
      return entrada
    }
    return entrada
  
  })
  
  console.log("preambulo de entradas: ",entradas)
  escribirDatosYResaltar(hoja_maestro,entradas)
  
  
  
  
  
  
  }
  function crear_hoja_por_area(){
  const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
  const hoja_maestro = hojasActuales.getSheetByName('MAESTRO');
  const data_maestro = hoja_maestro.getDataRange().getValues();
  const encabezado = data_maestro[0]
  data_maestro.shift()
  
  const col_area = obtenerNumeroDeColumna(hoja_maestro,"AREA",1)
  const areas = obtener_areas(data_maestro,col_area)
  console.log(areas)
  areas.forEach((area)=>{
  
    let entradas=obtener_entradas_area_especifica(area,data_maestro,col_area)
    console.log(entradas)
    let hoja_area = crear_hoja_nombre(area,hojasActuales)
    copiarEncabezado(hoja_maestro,hoja_area)
    escribirDatosYResaltar(hoja_area,entradas)
    let hojas_area_archivo=crearSpreadsheetEnCarpetaConRemplazo(area)
    hoja_area = crear_hoja_nombre(area,hojas_area_archivo)
    copiarEncabezado(hoja_maestro,hoja_area)
    let lista_booleana = 
    escribirDatosYResaltar(hoja_area,entradas)
    deleteSheetByName(hojas_area_archivo,"Hoja 1")
    
  
  
  
  
  })
  
  
  
  
  }
  function extraer_datos(){
  const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();  
  const hoja_maestro = hojasActuales.getSheetByName('MAESTRO');
  const data_maestro = hoja_maestro.getDataRange().getValues();
  
  data_maestro.shift()
  
  const col_area = obtenerNumeroDeColumna(hoja_maestro,"AREA",1)
  const areas = obtener_areas(data_maestro,col_area)
  areas.forEach((area)=>{
    let hojas_area_cordinador=obtenerSpreadsheetDeCarpeta("1_65rwp56jrcRsxoMO-HnBAOFGFI1z9Mc",area)
    let hoja_cordinador=hojas_area_cordinador.getSheetByName(area);
    let data_cordinador= hoja_cordinador.getDataRange().getValues();
    data_cordinador.shift()
    
    
    let hoja_area = crear_hoja_nombre(area,hojasActuales)
    copiarEncabezado(hoja_maestro,hoja_area)
    escribirDatosYResaltar(hoja_area,data_cordinador)
  
    const col_cupos_actuales = obtenerNumeroDeColumna(hoja_area,"CUPOS 202420",1)
    const col_clave = obtenerNumeroDeColumna(hoja_area,"CODIGO",1)
    const col_seccion = obtenerNumeroDeColumna(hoja_area,"SECCIONES",1)
    resaltarCambiosEnHoja(hoja_area,data_maestro,2, [col_clave,col_seccion], col_cupos_actuales, data_cordinador)
    
  
  
  
  
  })
  
  
  
  
  }
  
  
  
  
  function mostrarTodasLasHojas() {
    const libro = SpreadsheetApp.getActiveSpreadsheet();
    const usuarioActual = Session.getEffectiveUser().getEmail();
    const hojas = libro.getSheets();
  
    hojas.forEach((hoja) => hoja.showSheet());
  
    Logger.log(`Todas las hojas son visibles ahora para: ${usuarioActual}`);
  }
  
  
  
  
  
  
  function pedirParametro() {
    const ui = SpreadsheetApp.getUi();
    const respuesta = ui.prompt('Introduce el semestre a programar', 'Escribe el valor que deseas usar más tarde:', ui.ButtonSet.OK_CANCEL);
  
    // Verificar si el usuario presionó "OK" antes de devolver el texto
    if (respuesta.getSelectedButton() == ui.Button.OK) {
      return respuesta.getResponseText(); // Retorna solo el texto ingresado
    } else {
      return null; // Retorna `null` si el usuario canceló
    }
  }
  function compartirYEnviarEnlace() {
    const lista_datos =[
      {name:"Danae",mail:"dolavarria@uandes.cl",archivos:["MATEMATICA","COMPUTACION"]},
      {name:"Diego",mail:"deyzaguirre1@miaundes.cl",archivo:["FISICA","OBRAS CIVILES"]},
      {name:"Andrea",mail:"amirandac@uandes.cl",archivo:["MATEMATICA"]},
      //cambiar aqui las diferentes areas de cordinacion y sus encargados
  
    ]
      enviarLinksConPermisos("1_65rwp56jrcRsxoMO-HnBAOFGFI1z9Mc",lista_datos)
  
  
  
    
  }
  function validar_cambios(){
    const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
    const hoja_actual =hojasActuales.getActiveSheet()
    const data_verificada = hoja_actual.getDataRange().getValues();
    data_verificada.shift()
    const hoja_maestro = hojasActuales.getSheetByName("MAESTRO");
    const data_maestro = hoja_maestro.getDataRange().getValues();
    data_maestro.shift()
    const col_cupos_actuales = obtenerNumeroDeColumna(hoja_actual,"CUPOS 202420",1)
    const col_clave_seccion = obtenerNumeroDeColumna(hoja_actual,"LLAVE Código- sec ",1)
    const data_maestro_actualizada = actualizarListaOriginal(data_maestro, data_verificada, col_clave_seccion, col_cupos_actuales)
    console.log(data_maestro_actualizada)
    escribirDatosYResaltar(hoja_maestro,data_maestro_actualizada)
  
  
  
  
  
  
  }
  function actualizar_datos(){
  const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();  
  const hoja_maestro = hojasActuales.getSheetByName('MAESTRO');
  
  
  
  const hoja_respuestas =hojasActuales.getSheetByName('RESPUESTAS');
  const data_respuestas = hoja_respuestas.getDataRange().getValues();
  const col_lunes=obtenerNumeroDeColumna(hoja_maestro,"LUNES",1)
  const col_martes=obtenerNumeroDeColumna(hoja_maestro,"MARTES",1)
  const col_miercoles=obtenerNumeroDeColumna(hoja_maestro,"MIERCOLES",1)
  const col_jueves=obtenerNumeroDeColumna(hoja_maestro,"JUEVES",1)
  const col_viernes=obtenerNumeroDeColumna(hoja_maestro,"VIERNES",1)
  const col_rut_profesor=obtenerNumeroDeColumna(hoja_maestro,"RUT PROFESOR 1",1)
  const col_rut_profesor2=obtenerNumeroDeColumna(hoja_maestro,"RUT PROFESOR 2",1)
  const horarios_por_rut = horariosPorRut(data_respuestas)
  const columnasDias=[col_lunes,col_martes,col_miercoles,col_jueves,col_viernes]
  limpiarColumnas(hoja_maestro,columnasDias)
  const data_maestro = hoja_maestro.getDataRange().getValues();
  data_maestro.shift()
  console.log(horarios_por_rut)
  
  
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  data_maestro.forEach((fila,idx) => {
      const rut = fila[col_rut_profesor];
      const rut2= fila[col_rut_profesor2]
      const profesores = horarios_por_rut.filter(prof => (prof.rut === rut)||(prof.rut === rut2)); 
      profesores.forEach((profesor)=>{
      if (profesor) {
          // Actualizar cada columna de día con los datos del resultado
          let escrito=verificarCasillasNoVacias(fila,columnasDias,)
          columnasDias.forEach((columnaDia, i) => {
              const dia = dias[i];
              
              if(!escrito){
                fila[columnaDia] = profesor[dia] || "";
              }
              else{ 
              fila[columnaDia]=interseccion_de_bloques(profesor[dia],fila[columnaDia]);
              }
  
  
          }
          
          )
          if(verificarCasillastodasVacias(fila,columnasDias)&&escrito){
                columnasDias.forEach((columnaDia, i) => {
                fila[columnaDia] = "INCOHERENCIA"
                })
              
          };
      }
      })
  });
  const hoja_preferencias= hojasActuales.getSheetByName('PREFERENCIAS');
  const data_preferencias = hoja_preferencias.getDataRange().getValues();
  const col_codigo=obtenerNumeroDeColumna(hoja_maestro,"CODIGO",1)
  const col_seccion=obtenerNumeroDeColumna(hoja_maestro,"SECCIONES",1)
  const col_preferencias=obtenerNumeroDeColumna(hoja_maestro,"2+1 o 3? (distribución horario de clases)",1)
  data_maestro.forEach(fila => {
      
      const curso_seccion = data_preferencias.find(prof => (prof[1] == fila[col_codigo])&&(prof[2] == fila[col_seccion])); 
  
      if (curso_seccion) {
          fila[col_preferencias]=curso_seccion[3]
          // Actualizar cada columna de día con los datos del resultado
          
      }
  });
  const hoja_otros=hojasActuales.getSheetByName('OTROS')
  const data_otros = hoja_otros.getDataRange().getValues();
  const col_comentarios=obtenerNumeroDeColumna(hoja_maestro,"COMENTARIOS PROFESOR",1)
  const col_examen=obtenerNumeroDeColumna(hoja_maestro,"EXAMEN (Sí o No)",1)
  const col_cantidad_evaluaciones=obtenerNumeroDeColumna(hoja_maestro,"CANTIDAD EVALUACIONES (semestrales)",1)
  const col_tipo=obtenerNumeroDeColumna(hoja_maestro,"HORARIO EVALUACIONES (19:30 o en clases o en ayudantías)",1)
  data_maestro.forEach(fila => {
      
      const curso_seccion = data_otros.find(prof => (prof[1] == fila[col_codigo])&&(prof[2] == fila[col_seccion])); 
  
      if (curso_seccion) {
          fila[col_comentarios]=curso_seccion[3]
          fila[col_examen]=curso_seccion[4]
          fila[col_cantidad_evaluaciones]=curso_seccion[5]
          fila[col_tipo]=curso_seccion[6]
          // Actualizar cada columna de día con los datos del resultado
          
      }
  });
  
  
  escribirDatosYResaltar(hoja_maestro,data_maestro)
  
  
  }
  
  function enviarFormulariosCondicional() {
    const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = hojasActuales.getSheetByName("MAESTRO"); // Cambiar al nombre de tu hoja
    const hoja_profesores=hojasActuales.getSheetByName("PROFESORES");
    const rut_profesores_jornada=hoja_profesores.getDataRange().getDisplayValues().map((fila)=>fila[1]);
    
    // Configuración: Números de columnas para correos y RUTs
    const colMail1 = obtenerNumeroDeColumna(sheet,"EMAIL PROFESOR 1",1); // Número de columna de correos 1
    const colMail2 = obtenerNumeroDeColumna(sheet,"EMAIL PROFESOR 2",1); // Número de columna de correos 2
    const colRut1 = obtenerNumeroDeColumna(sheet,"RUT PROFESOR 1",1);  // Número de columna de RUTs 1
    const colRut2 = obtenerNumeroDeColumna(sheet,"RUT PROFESOR 2",1);  // Número de columna de RUTs 2
    
    // Rango de datos, ajusta según tus necesidades
    const data = sheet.getDataRange().getDisplayValues(); 
    data.shift()
    // Links de los formularios
    const linkFormulario1 = "https://script.google.com/macros/s/AKfycbx2eNURsM9bm-aGlQA_Mcq0dnZ1_uUGKgDpgXHMdZ5KtoIJc7FQ5os9_B6Bxqi6lyun/exec"; // Cambiar por el link del formulario Honorarios
    const linkFormulario2 = "https://script.google.com/macros/s/AKfycbyEGSRI-VGzTkcnGLYNCMEh19F4Gqh2Qth_nmLL8LtNmY5pkMJcu7kqMBUxsHibEdZ6Eg/exec"; // Cambiar por el link del formulario Jornada
  
    data.forEach((fila, i) => {
      const email1 = fila[colMail1];
      const email2 = fila[colMail2];
      const rut1 = fila[colRut1 ];
      const rut2 = fila[colRut2];
      
      // Verifica si las columnas de correo y RUT no están vacías
      if (email1 && rut1) {
        // Condición personalizada: Define aquí la lógica
        if (condicionPersonalizada(rut1, rut_profesores_jornada)) {
          enviarCorreo(email1, rut1, linkFormulario1,`Estimado profesor/a,\n\nPor favor, complete el siguiente formulario para su preferencias del semestre: ${linkFormulario2}\n\nMuchas Gracias.\nArea de Analisis Curricular`,"Formulario de preferencias");
        } else {
          enviarCorreo(email1, rut1, linkFormulario1,`Estimado profesor/a,\n\nPor favor, complete el siguiente formulario para su disponibilidad del semestre: ${linkFormulario1}\n\nMuchas Gracias.\nArea de Analisis Curricular`,"Formulario de disponibilidad y preferencias");
        }
      }
      
      if (email2 && rut2) {
        // Condición personalizada: Define aquí la lógica
        if (condicionPersonalizada(rut2,rut_profesores_jornada)) {
          enviarCorreo(email2, rut2, linkFormulario2,`Estimado profesor/a,\n\nPor favor, complete el siguiente formulario para su preferencias del semestre: ${linkFormulario2}\n\nMuchas Gracias.\nArea de Analisis Curricular`,"Formulario de preferencias");
        } else {
          enviarCorreo(email2, rut2, linkFormulario2,`Estimado profesor/a,\n\nPor favor, complete el siguiente formulario para su disponibilidad del semestre: ${linkFormulario1}\n\nMuchas Gracias.\nArea de Analisis Curricular`,"Formulario de disponibilidad y preferencias");
        }
      }
    });
  }
  
  // Función para enviar el correo
  function enviarCorreo(email, rut, linkFormulario,mensaje,asunto) {
    GmailApp.sendEmail(email, asunto, mensaje);
  }
  
  // Ejemplo de una condición personalizada
  function condicionPersonalizada(rut,rut_profesores_jornada) {
    // Define tu lógica aquí, por ejemplo:
    // Retorna true si rut1 termina en 'K' o false en caso contrario
    return rut_profesores_jornada.includes(rut) ;
  }
  
  
  
  