var id_hoja_programacion='1pQBxylZzoIWAY0RKcbgDMUKrZLg6u0cGIsxd-GleUYE'
var id_archivo_actual="1o6HftjnQiU4EB1T9mwZ5FntfkZqy9Bj5wkZKbyHl-m0"
var id_carpeta_archivos_cordinadores="1_65rwp56jrcRsxoMO-HnBAOFGFI1z9Mc"
function onOpen(){
  const ui = SpreadsheetApp.getUi(); //crea referencia a la interfaz de usuario de Spreadsheet

  ui.createMenu("Macros")
    .addItem("Agregar secciones", "agregar_secciones")
    .addItem("Crear hoja por area","crear_hoja_por_area")
    .addItem("Validar Cambios","validar_cambios")
    .addItem("Crear Calendario","crearCalendario")
    .addItem("Compartir enlaces","compartirYEnviarEnlace")
    .addItem("Quitar permisos de edicion archivos cordinaldores","quitar_permisos")
    .addItem("Extraer datos Hojas cordinadores","extraer_datos")
    .addItem("Actualizar con datos formulario","actualizar_datos")
    .addItem("Envio de formularios Jornada y honorarios","enviarFormulariosCondicional")
    .addItem("Crear archivo para DPSA","crear_template_dpsa")
    .addItem("Crear archivo para Alumnos","crear_template_HorariosING")
    .addItem("Actualizar areas con catalogo antiguo","actualizarCatalogo")
    
    
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

const col_area = obtenerNumeroDeColumna(hoja_maestro,"AREA",1)//NO CAMBIAR NOMBRE A LA COLUMNA
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
  let hojas_area_cordinador=obtenerSpreadsheetDeCarpeta(id_carpeta_archivos_cordinadores,area)
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
function pedirParametro_fechas(mensaje_grande,mensaje_pequeno) {
  const ui = SpreadsheetApp.getUi();
  const respuesta = ui.prompt(mensaje_grande, mensaje_pequeno, ui.ButtonSet.OK_CANCEL);

  // Verificar si el usuario presionó "OK" antes de devolver el texto
  if (respuesta.getSelectedButton() == ui.Button.OK) {
    return respuesta.getResponseText(); // Retorna solo el texto ingresado
  } else {
    return null; // Retorna `null` si el usuario canceló
  }
}
function compartirYEnviarEnlace() {
  const lista_datos =[
    {name:"Diego Lagos",mail:"diego.lagos.besoain@gmail.com",archivos:["MATEMATICA","COMPUTACION"]}
    //cambiar aqui las diferentes areas de cordinacion y sus encargados

  ]
    enviarLinksConPermisos(id_carpeta_archivos_cordinadores,lista_datos)



  
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
const hoja_profesores=hojasActuales.getSheetByName('PROFESORES');
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

const rut_profesores_jornada=hoja_profesores.getDataRange().getValues().map((fila)=>fila[1]);
console.log(rut_profesores_jornada)
limpiarColumnas(hoja_maestro,columnasDias)
const data_maestro = hoja_maestro.getDataRange().getValues();
data_maestro.shift()
console.log(horarios_por_rut)
const horarios_jornada="8:30-9:20,9:30-10:20,10:30-11:20,11:30-12:20,12:30-13:20,13:30-14:20,14:30-15:20,15:30-16:20,16:30-17:20,17:30-18:20,18:30-19:20"
  

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
 
data_maestro.forEach((fila,idx) => {
    const rut = fila[col_rut_profesor];
    const rut2= fila[col_rut_profesor2]
    
    if (condicionPersonalizada(rut,rut_profesores_jornada)) {
      console.log("Rut jornada:",rut)
      columnasDias.forEach((columnaDia, i) => {
              fila[columnaDia] = horarios_jornada
        })

    }
    if (condicionPersonalizada(rut2,rut_profesores_jornada)) {
      columnasDias.forEach((columnaDia, i) => {
              fila[columnaDia] = horarios_jornada
        })

    }

    
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
  const linkFormulario1 = "https://script.google.com/macros/s/AKfycbxSHjR1VZxcZqeYqyuIbQ2D9Y-HXpkL_kL30ym4l3WzAEJkhr-OT43EeTZVrYFTtd2D/exec"; // Cambiar por el link del formulario Honorarios
  const linkFormulario2 = "https://script.google.com/macros/s/AKfycbyobQf5Zffk-bDaIY1JszLMKDSdLVs_IxBWkNtCFFdfXlDElu3D1qiCzxtDjFSbPSAw/exec"; // Cambiar por el link del formulario Jornada

  data.forEach((fila, i) => {
    const email1 = fila[colMail1];
    const email2 = fila[colMail2];
    const rut1 = fila[colRut1 ];
    const rut2 = fila[colRut2];
    
    // Verifica si las columnas de correo y RUT no están vacías
    if (email1 && rut1) {
      // Condición personalizada: Define aquí la lógica
      if (condicionPersonalizada(rut1, rut_profesores_jornada)) {//es un jornada
        enviarCorreo(email1, rut1, linkFormulario1,`Estimado profesor/a,\n\nPor favor, complete el siguiente formulario para su preferencias del semestre: ${linkFormulario2}\n\nMuchas Gracias.\nArea de Analisis Curricular`,"FORMULARIO DE PREFERENCIAS");
      } else {
        enviarCorreo(email1, rut1, linkFormulario1,`Estimado profesor/a,\n\nPor favor, complete el siguiente formulario para su disponibilidad del semestre: ${linkFormulario1}\n\nMuchas Gracias.\nArea de Analisis Curricular`,"FORMULARIO DE DISPONIBILIDAD Y PREFERENCIAS");
      }
    }
    
    if (email2 && rut2) {
      // Condición personalizada: Define aquí la lógica
      if (condicionPersonalizada(rut2,rut_profesores_jornada)) {//es jornada
        enviarCorreo(email2, rut2, linkFormulario2,`Estimado profesor/a,\n\nPor favor, complete el siguiente formulario para su preferencias del semestre: ${linkFormulario2}\n\nMuchas Gracias.\nArea de Analisis Curricular`,"FORMULARIO DE PREFERENCIAS");
      } else {
        enviarCorreo(email2, rut2, linkFormulario2,`Estimado profesor/a,\n\nPor favor, complete el siguiente formulario para su disponibilidad del semestre: ${linkFormulario1}\n\nMuchas Gracias.\nArea de Analisis Curricular`,"FORMULARIO DE DISPONIBILIDAD Y PREFERENCIAS");
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
function crear_template_dpsa(){
  const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
  const hoja_maestro = hojasActuales.getSheetByName("MAESTRO");
  const data_maestro = hoja_maestro.getDataRange().getDisplayValues();
  const encabezado_evaluaciones = hoja_maestro.getDataRange().getValues()[0]
  data_maestro.shift()
  const col_lunes= obtenerNumeroDeColumna(hoja_maestro,"Lunes",1)
  const col_martes= obtenerNumeroDeColumna(hoja_maestro,"Martes",1)
  const col_miercoles= obtenerNumeroDeColumna(hoja_maestro,"Miercoles",1)
  const col_jueves= obtenerNumeroDeColumna(hoja_maestro,"Jueves",1)
  const col_viernes= obtenerNumeroDeColumna(hoja_maestro,"Viernes",1)
  const col_dias=[col_lunes,col_martes,col_miercoles,col_jueves,col_viernes]
  const dias=["Lunes","Martes","Miercoles","Jueves","Viernes"]
  const encabezado=["NRC","MATERIA",	"CURSO",	"TITULO",	"SECC.",	"LISTA CRUZADA",	"TIPO DE HORARIO",	"PARTE PERIODO",	"CALIFICABLE",	"CUPOS TOTALES NRC",	"TIPO DE REUNIÓN",	"INICIO",	"FIN",	"DIA",	"HORA INICIO",	"HORA FIN",	"INDICADOR SESION LINEA/PROFESOR",	"PROFESOR PRINCIPAL",	"OTROS PROFESORES",	"LABORATORIOS",	"SALA CARACTERISTICA ESPECIAL",	"SOBREPASO",	"OBSERVACIONES"," "]
  const encabezado2=["NRC",	"MATERIA","CURSO",	"TITULO",	"SECC.",	"LISTA CRUZADA",	"TIPO DE HORARIO",	"PARTE PERIODO",	"CALIFICABLE",	"CUPOS TOTALES NRC",	"TIPO DE REUNIÓN",	"INICIO",	"FIN",	"DIA",	"HORA INICIO",	"HORA FIN",	"INDICADOR SESION LINEA/PROFESOR",	"PROFESOR PRINCIPAL",	"OTROS PROFESORES",	"LABORATORIOS",	"SALA CARACTERISTICA ESPECIAL",	"SOBREPASO",	"OBSERVACIONES","OBSERVACIONES INTERNA"]
  const fecha_inicio_clases=pedirParametro_fechas("Introduce la fecha de INICIO de clases","dd/mm/aaaa")
  const fecha_fin_clases=pedirParametro_fechas("Introduce la fecha de FIN de clases","dd/mm/aaaa")
  const fecha_inicio_ayud=pedirParametro_fechas("Introduce la fecha de \INICIO de AYUD/LAB","en formato dd/mm/aaaa")
  const fecha_fin_ayud=pedirParametro_fechas("Introduce la fecha de FIN de AYUD/LAB","dd/mm/aaaa")
  const idSpreadsheet = id_hoja_programacion;
  const hoja_programacion = SpreadsheetApp.openById(idSpreadsheet).getSheetByName('DATOS MAESTRO');
  const data_programacion = hoja_programacion.getDataRange().getDisplayValues();
  
  const dPSA=agregar_fechas(rellenar_dpsa(data_maestro,col_dias,dias,hoja_maestro),fecha_inicio_clases,fecha_fin_clases,fecha_inicio_ayud,fecha_fin_ayud,data_programacion)
  
  
  dPSA.unshift(encabezado)
  const hoja_dpsa=crear_hoja_nombre("DPSA",hojasActuales)
  const data_dpsa_anterior=hoja_dpsa.getDataRange().getDisplayValues()
  const hoja_evaluaciones=crear_hoja_nombre("EVALUACIONES",hojasActuales)
  const data_evaluaciones_anterior=hoja_evaluaciones.getDataRange().getDisplayValues()
  const evaluaciones=rellenar_evaluaciones(data_maestro,hoja_maestro,encabezado_evaluaciones)
  evaluaciones.unshift(encabezado2)
  hoja_dpsa.getDataRange().clear()
  hoja_evaluaciones.getDataRange().clear()
  escribirListaDeListas(hoja_dpsa,dPSA,1,1)
  escribirListaDeListas(hoja_evaluaciones,evaluaciones,1,1)

  const hoja_ajustes=crear_hoja_nombre("AJUSTES DPSA",hojasActuales)
  
  const llaves_p=[0,1,2,4,5,10,13]
  const enunciado_evaluaciones=["AJUSTES","HORA-DIA CAMBIO","NRC",	"MATERIA","CURSO",	"TITULO",	"SECC.",	"LISTA CRUZADA",	"TIPO DE HORARIO",	"PARTE PERIODO",	"CALIFICABLE",	"CUPOS TOTALES NRC",	"TIPO DE REUNIÓN",	"INICIO",	"FIN",	"DIA",	"HORA INICIO",	"HORA FIN",	"INDICADOR SESION LINEA/PROFESOR",	"PROFESOR PRINCIPAL",	"OTROS PROFESORES",	"LABORATORIOS",	"SALA CARACTERISTICA ESPECIAL",	"SOBREPASO",	"OBSERVACIONES","OBSERVACIONES INTERNA"]
  const cambios=compareLists(data_dpsa_anterior,dPSA,llaves_p,enunciado_evaluaciones).filter((elemento)=>elemento[0]!="")
  const enunciado=["AJUSTES","HORA-DIA CAMBIO","NRC",	"MATERIA/CURSO",	"MATERIA",	"CURSO",	"TITULO",	"SECC.",	"LISTA CRUZADA",	"TIPO DE HORARIO",	"PARTE PERIODO",	"CALIFICABLE",	"CUPOS TOTALES NRC",	"TIPO DE REUNIÓN",	"INICIO",	"FIN",	"DIA",	"HORA INICIO",	"HORA FIN",	"INDICADOR SESION LINEA/PROFESOR",	"PROFESOR PRINCIPAL",	"OTROS PROFESORES",	"LABORATORIOS",	"SALA CARACTERISTICA ESPECIAL",	"SOBREPASO",	"OBSERVACIONES"]
  const llaves_evaluaciones=[0,1,2,4,5,10,11,12]
  const cambios_evaluaciones=compareLists(data_evaluaciones_anterior,evaluaciones,llaves_evaluaciones,enunciado_evaluaciones).filter((elemento)=>elemento[0]!="")
  
  agregarAlFinal(hoja_ajustes,cambios,enunciado_evaluaciones)
  agregarAlFinal(hoja_ajustes,cambios_evaluaciones,enunciado_evaluaciones)
  







}
function crear_template_HorariosING(){

  const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
  const hoja_maestro = hojasActuales.getSheetByName("MAESTRO");
  const data_maestro = hoja_maestro.getDataRange().getValues(); 
  const encabezado_fechas=data_maestro[0]
  data_maestro.shift()
  const col_lunes= obtenerNumeroDeColumna(hoja_maestro,"Lunes",1)
  const col_martes= obtenerNumeroDeColumna(hoja_maestro,"Martes",1)
  const col_miercoles= obtenerNumeroDeColumna(hoja_maestro,"Miercoles",1)
  const col_jueves= obtenerNumeroDeColumna(hoja_maestro,"Jueves",1)
  const col_viernes= obtenerNumeroDeColumna(hoja_maestro,"Viernes",1)
  const col_dias=[col_lunes,col_martes,col_miercoles,col_jueves,col_viernes]
  const dias=["Lunes","Martes","Miercoles","Jueves","Viernes"]
  const encabezado=["AREA", "PLAN DE ESTUDIO","NRC", "LISTA CRUZADA", "MATERIA", "CURSO", "SECC."," TITULO", "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "INICIO", "FIN", "SALA", "TIPO DE REUNIÓN", "PROFESOR"]//largo 18
  const fecha_inicio_clases=pedirParametro_fechas("Introduce la fecha de INICIO de clases","dd/mm/aaaa")
  const fecha_fin_clases=pedirParametro_fechas("Introduce la fecha de FIN de clases","dd/mm/aaaa")
  const fecha_inicio_ayud=pedirParametro_fechas("Introduce la fecha de \INICIO de AYUD/LAB","en formato dd/mm/aaaa")
  const fecha_fin_ayud=pedirParametro_fechas("Introduce la fecha de FIN de AYUD/LAB","dd/mm/aaaa")
  const idSpreadsheet = id_hoja_programacion;
  const hoja_programacion = SpreadsheetApp.openById(idSpreadsheet).getSheetByName('DATOS MAESTRO');
  const data_programacion = hoja_programacion.getDataRange().getDisplayValues();
  const horario_ing=agregar_fechas_HORARIO_ING(rellenar_HORARIO_ING(data_maestro,col_dias,dias,hoja_maestro),fecha_inicio_clases,fecha_fin_clases,fecha_inicio_ayud,fecha_fin_ayud,data_programacion)
  
  console.log(horario_ing)
  horario_ing.unshift(encabezado)
  const evaluaciones=rellenar_evaluaciones_horarioING(data_maestro,hoja_maestro,encabezado_fechas)
  console.log(evaluaciones)
  const hoja_horario_ing=crear_hoja_nombre("HORARIO ING",hojasActuales)
  hoja_horario_ing.getDataRange().clear()
  escribirListaDeListas(hoja_horario_ing,horario_ing.concat(evaluaciones),1,1)






}
function crearCalendario(){
const fecha_inicio=pedirParametro_fechas("Introduce la fecha de INICIO de programacion","en formato dd/mm/aaaa")
const fecha_fin=pedirParametro_fechas("Introduce la fecha de FIN de programacion","en formato dd/mm/aaaa")
const listaFechas=generarFechasEntre(fecha_inicio, fecha_fin)
const dias_feriados=verificarFinDeSemana(listaFechas)
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_maestro = hojasActuales.getSheetByName("MAESTRO");
const columnainicio=obtenerNumeroDeColumna(hoja_maestro,"OBSERVACION",1)+2




escribirFechasEnFila(listaFechas,dias_feriados,1, columnainicio)






}
function quitar_permisos(){
  const lista_datos =[
    {name:"Diego Lagos",mail:"diego.lagos.besoain@gmail.com",archivos:["MATEMATICA","COMPUTACION"]}
    
    //cambiar aqui las diferentes areas de cordinacion y sus encargados

  ]
  
  removePermissionsFromList(id_carpeta_archivos_cordinadores, lista_datos)


  
}



function actualizarCatalogo(){

const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_catalogo = hojasActuales.getSheetByName("CATALOGO");
const hoja_catalogo_antiguo = hojasActuales.getSheetByName("CATALOGO ANTIGUO");
const data_catalogo=hoja_catalogo.getDataRange().getDisplayValues()
const data_catalogo_antiguo=hoja_catalogo_antiguo.getDataRange().getDisplayValues()
const col_area_antiguo=obtenerNumeroDeColumna(hoja_catalogo_antiguo,"AREA",1)
const col_area_nuevo=obtenerNumeroDeColumna(hoja_catalogo,"AREA",1)//SE TUVO QUE CAMBIAR EL NOMBRE
const col_codigo_antiguo=obtenerNumeroDeColumna(hoja_catalogo_antiguo,"CODIGO",1)
const col_codigo_nuevo=obtenerNumeroDeColumna(hoja_catalogo,"CODIGO",1)
data_catalogo.forEach((curso)=>{
  let area = data_catalogo_antiguo.find((curso_antiguo)=>
  curso_antiguo[col_codigo_antiguo]==curso[col_codigo_nuevo])
  if(area){
  curso[col_area_nuevo]=area[col_area_antiguo]
  }
  

})
console.log(data_catalogo)
hoja_catalogo.getDataRange().clearContent()
escribirListaDeListas(hoja_catalogo,data_catalogo,1,1)





}

