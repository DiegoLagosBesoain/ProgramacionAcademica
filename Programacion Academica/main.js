function onOpen() {
  const ui = SpreadsheetApp.getUi(); // Crea referencia a la interfaz de usuario de Spreadsheet

  
  ui.createMenu("Programación")
    .addSubMenu(
      ui.createMenu("Templates")
        .addItem("Crear templates", "crear_templates")
        .addItem("Extraer datos maestro", "extaer_datos_maestro")
        .addItem("Generar visualizaciones", "visualizar")
    )
    .addSubMenu(
      ui.createMenu("Plan común")
        .addItem("Verificar restricciones Plan Común", "verificar_plan_comun")
        .addItem("Verificar Horarios Protegidos plan comun","verificar_Horarios_plan_comun")
        .addItem("Verificar Topes mismo semestre plan comun","verificar_topes_mismo_semestre_plan_comun")
        .addItem("Verificar Disponibilidad profesores semestre plan comun","verificar_Disponibilidad_plan_comun")
        .addItem("Verificar Salas Especiales plan comun","verificar_topes_Salas_Especiales_plan_comun")
        
    )
    .addSubMenu(
      ui.createMenu("V, VI semestre")
        .addItem("Verificar restricciones 5to y 6to semestre", "verificar_5_6")
        .addItem("Verificar topes mismo semestre 5to y 6to semestre","verificar_topes_mismo_semestre_5to_y_6to")
        .addItem("Verificar Disponibilidad profesores 5to y 6to semestre","verificar_Disponibilidad_5to_y_6to")
        .addItem("Verificar Salas Especiales 5to y 6to semestre","verificar_topes_Salas_Especiales_5to_y_6to")
        .addItem("Verificar concentraciones 5to y 6to primer semestre", "verifica_concentraciones_5to_y_6to_primer_semestre")
        .addItem("Verificar concentraciones 5to y 6to segundo semestre", "verifica_concentraciones_5to_y_6to_segundo_semestre")
    )
    .addSubMenu(
      ui.createMenu("VII, VIII semestre")
        .addItem("Verificar topes mismo semestre 7mo y 8vo","verificar_topes_mismo_semestre_7mo_y_8vo")
        .addItem("Verificar Disponibilidad profesores 7mo y 8vo semestre","verificar_Disponibilidad_7mo_y_8vo")
        .addItem("Verificar Salas Especiales 7mo y 8vo semestre","verificar_topes_Salas_Especiales_7mo_y_8vo")
        .addItem("Verificar concentraciones 7mo y 8vo primer semestre", "verifica_concentraciones_7mo_y_8vo_primer_semestre")
        .addItem("Verificar concentraciones 7mo y 8vo segundo semestre", "verifica_concentraciones_7mo_y_8vo_segundo_semestre")
    

    )
    .addSubMenu(
      ui.createMenu("Titulación")
      
        .addItem("Verificar topes mismo semestre titulacion","verificar_topes_mismo_semestre_titulacion")
        .addItem("Verificar restricciones titulación", "verificar_titulacion")
        .addItem("Verificar Disponibilidad profesores titulación","verificar_Disponibilidad_titulacion")
        .addItem("Verificar Salas Especiales titulación","verificar_topes_Salas_Especiales_titulacion")
    )
    .addToUi()
}
function crear_templates(){

const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_plan_comun = hojasActuales.getSheetByName("PLAN COMUN")
const bloques = hojasActuales.getSheetByName("DATOS MAESTRO").getDataRange().getDisplayValues()
const detalles = hojasActuales.getSheetByName("DETALLES SEMESTRE").getDataRange().getDisplayValues()

const bloques_plan_comun=bloques.filter((bloque,idx)=>contieneEnRango(detalles[idx],1,4)).map((curso)=>{
  return [curso[2],"seccion "+curso[1],curso[6]]
});
const bloques_5y6=bloques.filter((bloque,idx)=>contieneEnRango(detalles[idx],5,6)).map((curso)=>{
  return [curso[2],"seccion "+curso[1],curso[6]]
});
const bloques_7y8=bloques.filter((bloque,idx)=>contieneEnRango(detalles[idx],7,8)).map((curso)=>{
  return [curso[2],"seccion "+curso[1],curso[6]]
});
const bloques_titulacion=bloques.filter((bloque,idx)=>contieneEnRango(detalles[idx],9,11)||(bloque[0][3]=="5")||(bloque[0][3]=="6")).map((curso)=>{
  return [curso[2],"seccion "+curso[1],curso[6]]
});
const hoja_5y6_comun = hojasActuales.getSheetByName("V,VI")
const hoja_7y8_comun = hojasActuales.getSheetByName("VII,VIII")
const hoja_tutulacion_comun = hojasActuales.getSheetByName("TITULACION")
limpiarBackgroundsYComentarios(hoja_plan_comun,2,2)
crear_calendario(hoja_plan_comun,bloques_plan_comun)

limpiarBackgroundsYComentarios(hoja_5y6_comun,2,2)
crear_calendario(hoja_5y6_comun,bloques_5y6)

limpiarBackgroundsYComentarios(hoja_7y8_comun,2,2)
crear_calendario(hoja_7y8_comun,bloques_7y8)

limpiarBackgroundsYComentarios(hoja_tutulacion_comun,2,2)
crear_calendario(hoja_tutulacion_comun,bloques_titulacion)





}
function extaer_datos_maestro(){

  const data_maestro=obterner_data_maestro()
  const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
  const encabezado_maestro= data_maestro.shift()
  const hoja_bloques=hojasActuales.getSheetByName("DATOS MAESTRO")
  const hoja_detalles_malla=hojasActuales.getSheetByName("DETALLES SEMESTRE")
  //const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
  const hoja_salas_especiales=hojasActuales.getSheetByName("SALAS ESPECIALES")
  const bloques=obtener_bloques(data_maestro,encabezado_maestro)
  
  
  escribirListaDeListas(hoja_bloques,bloques[0],1,1,hoja_salas_especiales,1)
  escribirListaDeListas1(hoja_detalles_malla,bloques[1],1,1)
  return bloques

}
function verificar_plan_comun(){
  const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
  const hoja_plan_comun = hojasActuales.getSheetByName("PLAN COMUN")
  const hoja_5y6_comun = hojasActuales.getSheetByName("V,VI")
  const hoja_7y8_comun = hojasActuales.getSheetByName("VII,VIII")
  const hoja_tutulacion_comun = hojasActuales.getSheetByName("TITULACION")
  const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
  //const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
  //const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
  
  const bloques = obtenerBloquesPorHoraYDia(hoja_plan_comun,hoja_data_maestro)
  const bloques4y5 = obtenerBloquesPorHoraYDia(hoja_5y6_comun,hoja_data_maestro)
  const bloques5y6 = obtenerBloquesPorHoraYDia(hoja_7y8_comun,hoja_data_maestro)
  const bloques7y8 = obtenerBloquesPorHoraYDia(hoja_tutulacion_comun,hoja_data_maestro)
  Logger.log("bloques creados")
  const topes=obtener_topes_semestre(bloques)
  
  pintarCeldasConComentario(hoja_plan_comun,topes,"TOPE MISMO SEMESTRE")

  const topes_horario_protegido=obtener_topes_horario_protegido(bloques)
  pintarCeldasConComentario(hoja_plan_comun,topes_horario_protegido,"PROGRAMADO EN HORARIO PROTEGIDO")
  const topes_sala_especial = obtener_topes_sala_especial(bloques)

  pintarCeldasConComentario(hoja_plan_comun,topes_sala_especial,"MISMA SALA ESPECIAL EN USO PARA DIFERENTES SECCIONES")
  const topes_sala_esoacial_otras_hojas = obtener_topes_sala_especial_otras_hojas( bloques,bloques4y5,bloques5y6,bloques7y8)
  console.log(topes_sala_esoacial_otras_hojas)
  pintarCeldasConComentario(hoja_plan_comun,topes_sala_esoacial_otras_hojas,"SALA ESPECIAL YA ASIGNADA EN ESTE BLOQUE DE HORARIO")
  const topes_disponibilidad_profesores = obtener_topes_disponibilidad_profesores(bloques,bloques4y5,bloques5y6,bloques7y8)
  pintarCeldasConComentario(hoja_plan_comun,topes_disponibilidad_profesores[0],"BLOQUE DE HORARIO YA ASIGNADO AL PROFESOR")
  pintarCeldasConComentario(hoja_plan_comun,topes_disponibilidad_profesores[1],"HORARIO FUERA DE LA DISPONIBILIADAD DEL PROFESOR")

}
function verificar_5_6(){

  const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
  const hoja_plan_comun = hojasActuales.getSheetByName("PLAN COMUN")
  const hoja_5y6_comun = hojasActuales.getSheetByName("V,VI")
  const hoja_7y8_comun = hojasActuales.getSheetByName("VII,VIII")
  const hoja_tutulacion_comun = hojasActuales.getSheetByName("TITULACION")
  const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
  const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
  //const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues() 
 
  const bloques = obtenerBloquesPorHoraYDia(hoja_plan_comun,hoja_data_maestro)
  const bloques4y5 = obtenerBloquesPorHoraYDia(hoja_5y6_comun,hoja_data_maestro)//estan mal los numeros pero se entiende la diferencia
  const bloques5y6 = obtenerBloquesPorHoraYDia(hoja_7y8_comun,hoja_data_maestro)
  const bloques7y8 = obtenerBloquesPorHoraYDia(hoja_tutulacion_comun,hoja_data_maestro)
  Logger.log("bloques creados",bloques4y5)
  const topes=obtener_topes_semestre(bloques4y5)
  pintarCeldasConComentario(hoja_5y6_comun,topes,"TOPE MISMO SEMESTRE")

  const topes_sala_especial = obtener_topes_sala_especial(bloques4y5)

  pintarCeldasConComentario(hoja_5y6_comun,topes_sala_especial,"MISMA SALA ESPECIAL EN USO PARA DIFERENTES SECCIONES")
  const topes_disponibilidad_profesores = obtener_topes_disponibilidad_profesores(bloques4y5,bloques,bloques5y6,bloques7y8)
  pintarCeldasConComentario(hoja_5y6_comun,topes_disponibilidad_profesores[0],"BLOQUE DE HORARIO YA ASIGNADO AL PROFESOR")
  pintarCeldasConComentario(hoja_5y6_comun,topes_disponibilidad_profesores[1],"HORARIO FUERA DE LA DISPONIBILIADAD DEL PROFESOR")
  console.log("preparando nuevos bloques")
  //const bloques4y5_con_detalles= agregar_detalles(bloques4y5,data_detalles_malla)
  
  //console.log(bloques4y5_con_detalles)

  




  
}
function visualizar(){
  const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
  const hoja_plan_comun = hojasActuales.getSheetByName("PLAN COMUN")
  const hoja_5y6_comun = hojasActuales.getSheetByName("V,VI")
  const hoja_7y8_comun = hojasActuales.getSheetByName("VII,VIII")
  const hoja_tutulacion_comun = hojasActuales.getSheetByName("TITULACION")
  const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
  const bloques_plan_comun = obtenerBloquesPorHoraYDia_sin_transformar(hoja_plan_comun,hoja_data_maestro)
  const bloques4y5 = obtenerBloquesPorHoraYDia_sin_transformar(hoja_5y6_comun,hoja_data_maestro)//estan mal los numeros pero se entiende la diferencia
  const bloques5y6 = obtenerBloquesPorHoraYDia_sin_transformar(hoja_7y8_comun,hoja_data_maestro)
  const bloques7y8 = obtenerBloquesPorHoraYDia_sin_transformar(hoja_tutulacion_comun,hoja_data_maestro)
  Logger.log("bloques plan comun",bloques_plan_comun)
  const agrupacion_plan_comun = agruparSecciones(bloques_plan_comun)
  const agrupacion_5y6 = agruparSecciones(bloques4y5)
  const agrupacion_7y8 = agruparSecciones(bloques5y6)
  const agrupacion_titulacion = agruparSecciones(bloques7y8)
  console.log(agrupacion_plan_comun)
  let hoja=crear_hoja_nombre("PLAN COMUN VISUALIZACION",hojasActuales)
  escribirEnHojaAgrupacion(agrupacion_plan_comun,hoja)
  hoja=crear_hoja_nombre("V,VI VISUALIZACION",hojasActuales)
  escribirEnHojaAgrupacion(agrupacion_5y6,hoja)
  hoja=crear_hoja_nombre("VII,VIII VISUALIZACION",hojasActuales)
  escribirEnHojaAgrupacion(agrupacion_7y8,hoja)
  hoja=crear_hoja_nombre("TITULACION VISUALIZACION",hojasActuales)
  escribirEnHojaAgrupacion(agrupacion_titulacion,hoja)
  



}
function verifica_concentraciones_5to_y_6to_primer_semestre(){
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_5y6_comun = hojasActuales.getSheetByName("V,VI")
const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
const bloques4y5 = obtenerBloquesPorHoraYDia(hoja_5y6_comun,hoja_data_maestro)
const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
const bloques4y5_con_detalles= agregar_detalles(bloques4y5,data_detalles_malla)
console.log(bloques4y5_con_detalles)
const topes_concentraciones=obtener_topes_concentraciones_primer_semestre(bloques4y5_con_detalles)
console.log(topes_concentraciones)
pintarCeldasConComentario(hoja_5y6_comun,topes_concentraciones,"CONCENTRACION TOPANDO CON RAMOS DEL SEMESTRE")

}
function verifica_concentraciones_5to_y_6to_segundo_semestre(){
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_5y6_comun = hojasActuales.getSheetByName("V,VI")
const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
const bloques4y5 = obtenerBloquesPorHoraYDia(hoja_5y6_comun,hoja_data_maestro)
const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
const bloques4y5_con_detalles= agregar_detalles(bloques4y5,data_detalles_malla)
console.log(bloques4y5_con_detalles)
const topes_concentraciones=obtener_topes_concentraciones_segundo_semestre(bloques4y5_con_detalles)
console.log(topes_concentraciones)
pintarCeldasConComentario(hoja_5y6_comun,topes_concentraciones,"CONCENTRACION TOPANDO CON RAMOS DEL SEMESTRE")

}
function verificar_7_8(){
  const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
  const hoja_plan_comun = hojasActuales.getSheetByName("PLAN COMUN")
  const hoja_5y6_comun = hojasActuales.getSheetByName("V,VI")
  const hoja_7y8_comun = hojasActuales.getSheetByName("VII,VIII")
  const hoja_tutulacion_comun = hojasActuales.getSheetByName("TITULACION")
  const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
  const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
  //const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues() 
 
  const bloques = obtenerBloquesPorHoraYDia(hoja_plan_comun,hoja_data_maestro)
  const bloques4y5 = obtenerBloquesPorHoraYDia(hoja_5y6_comun,hoja_data_maestro)//estan mal los numeros pero se entiende la diferencia
  const bloques5y6 = obtenerBloquesPorHoraYDia(hoja_7y8_comun,hoja_data_maestro)
  const bloques7y8 = obtenerBloquesPorHoraYDia(hoja_tutulacion_comun,hoja_data_maestro)
  Logger.log("bloques creados",bloques7y8)
  const topes=obtener_topes_semestre(bloques7y8)
  pintarCeldasConComentario(hoja_7y8_comun,topes,"TOPE MISMO SEMESTRE")

  const topes_sala_especial = obtener_topes_sala_especial(bloques7y8)

  pintarCeldasConComentario(hoja_7y8_comun,topes_sala_especial,"MISMA SALA ESPECIAL EN USO PARA DIFERENTES SECCIONES")
  const topes_disponibilidad_profesores = obtener_topes_disponibilidad_profesores(bloques5y6,bloques4y5,bloques,bloques7y8)
  pintarCeldasConComentario(hoja_7y8_comun,topes_disponibilidad_profesores[0],"BLOQUE DE HORARIO YA ASIGNADO AL PROFESOR")
  pintarCeldasConComentario(hoja_7y8_comun,topes_disponibilidad_profesores[1],"HORARIO FUERA DE LA DISPONIBILIADAD DEL PROFESOR")
  console.log("preparando nuevos bloques")
  //const bloques4y5_con_detalles= agregar_detalles(bloques4y5,data_detalles_malla)
  
  //console.log(bloques4y5_con_detalles)
}
function verifica_concentraciones_7mo_y_8vo_primer_semestre(){
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_5y6_comun = hojasActuales.getSheetByName("VII,VIII")
const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
const bloques4y5 = obtenerBloquesPorHoraYDia(hoja_5y6_comun,hoja_data_maestro)
const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
const bloques4y5_con_detalles= agregar_detalles(bloques4y5,data_detalles_malla)
console.log(bloques4y5_con_detalles)
const topes_concentraciones=obtener_topes_concentraciones_primer_semestre(bloques4y5_con_detalles)
console.log(topes_concentraciones)
pintarCeldasConComentario(hoja_5y6_comun,topes_concentraciones,"CONCENTRACION TOPANDO CON RAMOS DEL SEMESTRE")

}
function verifica_concentraciones_7mo_y_8vo_segundo_semestre(){
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_5y6_comun = hojasActuales.getSheetByName("VII,VIII")
const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
const bloques4y5 = obtenerBloquesPorHoraYDia(hoja_5y6_comun,hoja_data_maestro)
const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
const bloques4y5_con_detalles= agregar_detalles(bloques4y5,data_detalles_malla)
console.log(bloques4y5_con_detalles)
const topes_concentraciones=obtener_topes_concentraciones_segundo_semestre(bloques4y5_con_detalles)
console.log(topes_concentraciones)
pintarCeldasConComentario(hoja_5y6_comun,topes_concentraciones,"CONCENTRACION TOPANDO CON RAMOS DEL SEMESTRE")

}
function verificar_titulacion(){
  const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
  const hoja_plan_comun = hojasActuales.getSheetByName("PLAN COMUN")
  const hoja_5y6_comun = hojasActuales.getSheetByName("V,VI")
  const hoja_7y8_comun = hojasActuales.getSheetByName("VII,VIII")
  const hoja_tutulacion_comun = hojasActuales.getSheetByName("TITULACION")
  const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
  const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
  //const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues() 
 
  const bloques = obtenerBloquesPorHoraYDia(hoja_plan_comun,hoja_data_maestro)
  const bloques4y5 = obtenerBloquesPorHoraYDia(hoja_5y6_comun,hoja_data_maestro)//estan mal los numeros pero se entiende la diferencia
  const bloques5y6 = obtenerBloquesPorHoraYDia(hoja_7y8_comun,hoja_data_maestro)
  const bloques7y8 = obtenerBloquesPorHoraYDia(hoja_tutulacion_comun,hoja_data_maestro)
  Logger.log("bloques creados",bloques7y8)
  const topes=obtener_topes_semestre(bloques7y8)
  pintarCeldasConComentario(hoja_tutulacion_comun,topes,"TOPE MISMO SEMESTRE")

  const topes_sala_especial = obtener_topes_sala_especial(bloques7y8)

  pintarCeldasConComentario(hoja_tutulacion_comun,topes_sala_especial,"MISMA SALA ESPECIAL EN USO PARA DIFERENTES SECCIONES")
  const topes_disponibilidad_profesores = obtener_topes_disponibilidad_profesores(bloques7y8,bloques5y6,bloques4y5,bloques)
  pintarCeldasConComentario(hoja_tutulacion_comun,topes_disponibilidad_profesores[0],"BLOQUE DE HORARIO YA ASIGNADO AL PROFESOR")
  pintarCeldasConComentario(hoja_tutulacion_comun,topes_disponibilidad_profesores[1],"HORARIO FUERA DE LA DISPONIBILIADAD DEL PROFESOR")
  console.log("preparando nuevos bloques")
  //const bloques4y5_con_detalles= agregar_detalles(bloques4y5,data_detalles_malla)
  
  //console.log(bloques4y5_con_detalles)
}
function verificar_topes_mismo_semestre_plan_comun(){
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();

const hoja_plan_comun = hojasActuales.getSheetByName("PLAN COMUN")
const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")

const bloques = obtenerBloquesPorHoraYDia(hoja_plan_comun,hoja_data_maestro)
const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
const bloques_con_detalles= agregar_detalles(bloques,data_detalles_malla)
const topes=obtener_topes_semestre_nuevo(bloques_con_detalles)
console.log(topes)
pintarCeldasConComentario(hoja_plan_comun,topes,"TOPE MISMO SEMESTRE")

}
function verificar_Disponibilidad_plan_comun(){
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
const hoja_plan_comun = hojasActuales.getSheetByName("PLAN COMUN")
const hoja_5y6_comun = hojasActuales.getSheetByName("V,VI")
const hoja_7y8_comun = hojasActuales.getSheetByName("VII,VIII")
const hoja_tutulacion_comun = hojasActuales.getSheetByName("TITULACION")
const bloques4y5 = obtenerBloquesPorHoraYDia(hoja_5y6_comun,hoja_data_maestro)//estan mal los numeros pero se entiende la diferencia
const bloques5y6 = obtenerBloquesPorHoraYDia(hoja_7y8_comun,hoja_data_maestro)
const bloques7y8 = obtenerBloquesPorHoraYDia(hoja_tutulacion_comun,hoja_data_maestro)

const bloques = obtenerBloquesPorHoraYDia(hoja_plan_comun,hoja_data_maestro)
const topes_disponibilidad_profesores = obtener_topes_disponibilidad_profesores(bloques,bloques4y5,bloques5y6,bloques7y8)
pintarCeldasConComentario(hoja_plan_comun,topes_disponibilidad_profesores[0],"BLOQUE DE HORARIO YA ASIGNADO AL PROFESOR")
pintarCeldasConComentario(hoja_plan_comun,topes_disponibilidad_profesores[1],"HORARIO FUERA DE LA DISPONIBILIADAD DEL PROFESOR")


}
function verificar_Horarios_plan_comun(){
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();

const hoja_plan_comun = hojasActuales.getSheetByName("PLAN COMUN")
const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")

const bloques = obtenerBloquesPorHoraYDia(hoja_plan_comun,hoja_data_maestro)
const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
const bloques_con_detalles= agregar_detalles(bloques,data_detalles_malla)
const topes=obtener_topes_horario_protegido(bloques_con_detalles)
console.log(topes)
pintarCeldasConComentario(hoja_plan_comun,topes,"PROGRAMADO EN HORARIO PROTEGIDO")



}
function verificar_topes_Salas_Especiales_plan_comun(){
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
const hoja_plan_comun = hojasActuales.getSheetByName("PLAN COMUN")
const hoja_5y6_comun = hojasActuales.getSheetByName("V,VI")
const hoja_7y8_comun = hojasActuales.getSheetByName("VII,VIII")
const hoja_tutulacion_comun = hojasActuales.getSheetByName("TITULACION")
const bloques4y5 = obtenerBloquesPorHoraYDia(hoja_5y6_comun,hoja_data_maestro)//estan mal los numeros pero se entiende la diferencia
const bloques5y6 = obtenerBloquesPorHoraYDia(hoja_7y8_comun,hoja_data_maestro)
const bloques7y8 = obtenerBloquesPorHoraYDia(hoja_tutulacion_comun,hoja_data_maestro)
const bloques = obtenerBloquesPorHoraYDia(hoja_plan_comun,hoja_data_maestro)
const topes_sala_especial = obtener_topes_sala_especial(bloques)
pintarCeldasConComentario(hoja_plan_comun,topes_sala_especial,"MISMA SALA ESPECIAL EN USO PARA DIFERENTES SECCIONES")
const topes_sala_esoacial_otras_hojas = obtener_topes_sala_especial_otras_hojas( bloques,bloques4y5,bloques5y6,bloques7y8)
console.log(topes_sala_esoacial_otras_hojas)
pintarCeldasConComentario(hoja_plan_comun,topes_sala_esoacial_otras_hojas,"SALA ESPECIAL YA ASIGNADA EN ESTE BLOQUE DE HORARIO EN OTRA HOJA")
}




function verificar_topes_mismo_semestre_5to_y_6to(){
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_4y5 = hojasActuales.getSheetByName("V,VI")
const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")

const bloques = obtenerBloquesPorHoraYDia(hoja_4y5,hoja_data_maestro)
const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
const bloques_con_detalles= agregar_detalles(bloques,data_detalles_malla)
const topes=obtener_topes_semestre_nuevo(bloques_con_detalles)
console.log(topes)
pintarCeldasConComentario(hoja_4y5,topes,"TOPE MISMO SEMESTRE")

}
function verificar_topes_Salas_Especiales_5to_y_6to(){
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
const hoja_plan_comun = hojasActuales.getSheetByName("PLAN COMUN")
const hoja_5y6_comun = hojasActuales.getSheetByName("V,VI")
const hoja_7y8_comun = hojasActuales.getSheetByName("VII,VIII")
const hoja_tutulacion_comun = hojasActuales.getSheetByName("TITULACION")
const bloques4y5 = obtenerBloquesPorHoraYDia(hoja_5y6_comun,hoja_data_maestro)//estan mal los numeros pero se entiende la diferencia
const bloques5y6 = obtenerBloquesPorHoraYDia(hoja_7y8_comun,hoja_data_maestro)
const bloques7y8 = obtenerBloquesPorHoraYDia(hoja_tutulacion_comun,hoja_data_maestro)
const bloques = obtenerBloquesPorHoraYDia(hoja_plan_comun,hoja_data_maestro)
const topes_sala_especial = obtener_topes_sala_especial(bloques4y5)
pintarCeldasConComentario(hoja_tutulacion_comun,topes_sala_especial,"MISMA SALA ESPECIAL EN USO PARA DIFERENTES SECCIONES")
const topes_sala_esoacial_otras_hojas = obtener_topes_sala_especial_otras_hojas( bloques4y5,bloques,bloques5y6,bloques7y8)
console.log(topes_sala_esoacial_otras_hojas)
pintarCeldasConComentario(hoja_5y6_comun,topes_sala_esoacial_otras_hojas,"SALA ESPECIAL YA ASIGNADA EN ESTE BLOQUE DE HORARIO EN OTRA HOJA")
}
function verificar_Disponibilidad_5to_y_6to(){
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
const hoja_plan_comun = hojasActuales.getSheetByName("PLAN COMUN")
const hoja_5y6_comun = hojasActuales.getSheetByName("V,VI")
const hoja_7y8_comun = hojasActuales.getSheetByName("VII,VIII")
const hoja_tutulacion_comun = hojasActuales.getSheetByName("TITULACION")
const bloques4y5 = obtenerBloquesPorHoraYDia(hoja_5y6_comun,hoja_data_maestro)//estan mal los numeros pero se entiende la diferencia
const bloques5y6 = obtenerBloquesPorHoraYDia(hoja_7y8_comun,hoja_data_maestro)
const bloques7y8 = obtenerBloquesPorHoraYDia(hoja_tutulacion_comun,hoja_data_maestro)

const bloques = obtenerBloquesPorHoraYDia(hoja_plan_comun,hoja_data_maestro)
const topes_disponibilidad_profesores = obtener_topes_disponibilidad_profesores(bloques4y5,bloques,bloques5y6,bloques7y8)
pintarCeldasConComentario(hoja_5y6_comun,topes_disponibilidad_profesores[0],"BLOQUE DE HORARIO YA ASIGNADO AL PROFESOR")
pintarCeldasConComentario(hoja_5y6_comun,topes_disponibilidad_profesores[1],"HORARIO FUERA DE LA DISPONIBILIADAD DEL PROFESOR")


}
function verificar_topes_mismo_semestre_titulacion(){
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_titulacion = hojasActuales.getSheetByName("TITULACION")
const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")

const bloques = obtenerBloquesPorHoraYDia(hoja_titulacion,hoja_data_maestro)
const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
const bloques_con_detalles= agregar_detalles(bloques,data_detalles_malla)
const topes=obtener_topes_semestre_nuevo(bloques_con_detalles)
console.log(topes)
pintarCeldasConComentario(hoja_titulacion,topes,"TOPE MISMO SEMESTRE")

}
function verificar_topes_Salas_Especiales_titulacion(){
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
const hoja_plan_comun = hojasActuales.getSheetByName("PLAN COMUN")
const hoja_5y6_comun = hojasActuales.getSheetByName("V,VI")
const hoja_7y8_comun = hojasActuales.getSheetByName("VII,VIII")
const hoja_tutulacion_comun = hojasActuales.getSheetByName("TITULACION")
const bloques4y5 = obtenerBloquesPorHoraYDia(hoja_5y6_comun,hoja_data_maestro)//estan mal los numeros pero se entiende la diferencia
const bloques5y6 = obtenerBloquesPorHoraYDia(hoja_7y8_comun,hoja_data_maestro)
const bloques7y8 = obtenerBloquesPorHoraYDia(hoja_tutulacion_comun,hoja_data_maestro)
const bloques = obtenerBloquesPorHoraYDia(hoja_plan_comun,hoja_data_maestro)
const topes_sala_especial = obtener_topes_sala_especial(bloques7y8)
pintarCeldasConComentario(hoja_tutulacion_comun,topes_sala_especial,"MISMA SALA ESPECIAL EN USO PARA DIFERENTES SECCIONES")
const topes_sala_esoacial_otras_hojas = obtener_topes_sala_especial_otras_hojas(bloques7y8,bloques5y6,bloques4y5,bloques)
console.log(topes_sala_esoacial_otras_hojas)
pintarCeldasConComentario(hoja_tutulacion_comun,topes_sala_esoacial_otras_hojas,"SALA ESPECIAL YA ASIGNADA EN ESTE BLOQUE DE HORARIO EN OTRA HOJA")
}
function verificar_Disponibilidad_titulacion(){
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
const hoja_plan_comun = hojasActuales.getSheetByName("PLAN COMUN")
const hoja_5y6_comun = hojasActuales.getSheetByName("V,VI")
const hoja_7y8_comun = hojasActuales.getSheetByName("VII,VIII")
const hoja_tutulacion_comun = hojasActuales.getSheetByName("TITULACION")
const bloques4y5 = obtenerBloquesPorHoraYDia(hoja_5y6_comun,hoja_data_maestro)//estan mal los numeros pero se entiende la diferencia
const bloques5y6 = obtenerBloquesPorHoraYDia(hoja_7y8_comun,hoja_data_maestro)
const bloques7y8 = obtenerBloquesPorHoraYDia(hoja_tutulacion_comun,hoja_data_maestro)

const bloques = obtenerBloquesPorHoraYDia(hoja_plan_comun,hoja_data_maestro)
const topes_disponibilidad_profesores = obtener_topes_disponibilidad_profesores(bloques7y8,bloques5y6,bloques4y5,bloques)
pintarCeldasConComentario(hoja_tutulacion_comun,topes_disponibilidad_profesores[0],"BLOQUE DE HORARIO YA ASIGNADO AL PROFESOR")
pintarCeldasConComentario(hoja_tutulacion_comun,topes_disponibilidad_profesores[1],"HORARIO FUERA DE LA DISPONIBILIADAD DEL PROFESOR")


}
function verificar_topes_mismo_semestre_7mo_y_8vo(){
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_7_y_8 = hojasActuales.getSheetByName("VII,VIII")
const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")

const bloques = obtenerBloquesPorHoraYDia(hoja_7_y_8,hoja_data_maestro)
const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
const bloques_con_detalles= agregar_detalles(bloques,data_detalles_malla)
const topes=obtener_topes_semestre_nuevo(bloques_con_detalles)
console.log(topes)
pintarCeldasConComentario(hoja_7_y_8,topes,"TOPE MISMO SEMESTRE")

}
function verificar_topes_Salas_Especiales_7mo_y_8vo(){
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
const hoja_plan_comun = hojasActuales.getSheetByName("PLAN COMUN")
const hoja_5y6_comun = hojasActuales.getSheetByName("V,VI")
const hoja_7y8_comun = hojasActuales.getSheetByName("VII,VIII")
const hoja_tutulacion_comun = hojasActuales.getSheetByName("TITULACION")
const bloques4y5 = obtenerBloquesPorHoraYDia(hoja_5y6_comun,hoja_data_maestro)//estan mal los numeros pero se entiende la diferencia
const bloques5y6 = obtenerBloquesPorHoraYDia(hoja_7y8_comun,hoja_data_maestro)
const bloques7y8 = obtenerBloquesPorHoraYDia(hoja_tutulacion_comun,hoja_data_maestro)
const bloques = obtenerBloquesPorHoraYDia(hoja_plan_comun,hoja_data_maestro)
const topes_sala_especial = obtener_topes_sala_especial(bloques5y6)
pintarCeldasConComentario(hoja_7y8_comun,topes_sala_especial,"MISMA SALA ESPECIAL EN USO PARA DIFERENTES SECCIONES")
const topes_sala_esoacial_otras_hojas = obtener_topes_sala_especial_otras_hojas( bloques5y6,bloques4y5,bloques,bloques7y8)
console.log(topes_sala_esoacial_otras_hojas)
pintarCeldasConComentario(hoja_7y8_comun,topes_sala_esoacial_otras_hojas,"SALA ESPECIAL YA ASIGNADA EN ESTE BLOQUE DE HORARIO EN OTRA HOJA")
}
function verificar_Disponibilidad_7mo_y_8vo(){
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
const hoja_plan_comun = hojasActuales.getSheetByName("PLAN COMUN")
const hoja_5y6_comun = hojasActuales.getSheetByName("V,VI")
const hoja_7y8_comun = hojasActuales.getSheetByName("VII,VIII")
const hoja_tutulacion_comun = hojasActuales.getSheetByName("TITULACION")
const bloques4y5 = obtenerBloquesPorHoraYDia(hoja_5y6_comun,hoja_data_maestro)//estan mal los numeros pero se entiende la diferencia
const bloques5y6 = obtenerBloquesPorHoraYDia(hoja_7y8_comun,hoja_data_maestro)
const bloques7y8 = obtenerBloquesPorHoraYDia(hoja_tutulacion_comun,hoja_data_maestro)

const bloques = obtenerBloquesPorHoraYDia(hoja_plan_comun,hoja_data_maestro)
const topes_disponibilidad_profesores = obtener_topes_disponibilidad_profesores(bloques5y6,bloques4y5,bloques,bloques7y8)
pintarCeldasConComentario(hoja_7y8_comun,topes_disponibilidad_profesores[0],"BLOQUE DE HORARIO YA ASIGNADO AL PROFESOR")
pintarCeldasConComentario(hoja_7y8_comun,topes_disponibilidad_profesores[1],"HORARIO FUERA DE LA DISPONIBILIADAD DEL PROFESOR")


}





