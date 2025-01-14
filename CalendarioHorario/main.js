var id_hoja_maestro="1o6HftjnQiU4EB1T9mwZ5FntfkZqy9Bj5wkZKbyHl-m0"

function onOpen() {
  const ui = SpreadsheetApp.getUi(); // Crea referencia a la interfaz de usuario de Spreadsheet

  
  ui.createMenu("Programación")
    .addSubMenu(
      ui.createMenu("Templates")
        .addItem("Crear templates", "crear_templates")
        .addItem("Extraer datos maestro", "extaer_datos_maestro")
        .addItem("Enviar maestro","actualizar_maestro")
        .addItem("Actualizar Hojas","actualizarDesplegables")
        
    )
    .addSubMenu(
      ui.createMenu("Plan común")
        
        .addItem("Verificar Horarios Protegidos plan comun","verificar_Horarios_plan_comun")
        .addItem("Verificar Topes mismo semestre plan comun","verificar_topes_mismo_semestre_plan_comun")
        .addItem("Verificar Disponibilidad profesores semestre plan comun","verificar_Disponibilidad_plan_comun")
        .addItem("Verificar Salas Especiales plan comun","verificar_topes_Salas_Especiales_plan_comun")
        .addItem("Crear Visualizacion Plan Comun","visualizarPlanComun")
        
    )
    .addSubMenu(
      ui.createMenu("V, VI semestre")
        
        .addItem("Verificar topes mismo semestre 5to y 6to semestre","verificar_topes_mismo_semestre_5to_y_6to")
        .addItem("Verificar Disponibilidad profesores 5to y 6to semestre","verificar_Disponibilidad_5to_y_6to")
        .addItem("Verificar Salas Especiales 5to y 6to semestre","verificar_topes_Salas_Especiales_5to_y_6to")
        .addItem("Verificar Horarios Protegidos 5to y 6to semestre","verificar_Horarios_5to_y_6to")
        .addItem("Verificar concentraciones 5to y 6to semestre Impar", "verifica_concentraciones_5to_y_6to_primer_semestre")
        .addItem("Verificar concentraciones 5to y 6to semestre Par", "verifica_concentraciones_5to_y_6to_segundo_semestre")
        .addItem("Crear Visualizacion 5to y 6to semestre","visualizar5y6")
    )
    .addSubMenu(
      ui.createMenu("VII, VIII semestre")
        .addItem("Verificar topes mismo semestre 7mo y 8vo","verificar_topes_mismo_semestre_7mo_y_8vo")
        .addItem("Verificar Disponibilidad profesores 7mo y 8vo semestre","verificar_Disponibilidad_7mo_y_8vo")
        .addItem("Verificar Salas Especiales 7mo y 8vo semestre","verificar_topes_Salas_Especiales_7mo_y_8vo")
        .addItem("Verificar concentraciones 7mo y 8vo semestre Impar", "verifica_concentraciones_7mo_y_8vo_primer_semestre")
        .addItem("Verificar concentraciones 7mo y 8vo semestre Par", "verifica_concentraciones_7mo_y_8vo_segundo_semestre")
        .addItem("Crear Visualizacion 7mo y 8vo semestre","visualizar7y8")
    

    )
    .addSubMenu(
      ui.createMenu("Titulación")
      
        .addItem("Verificar topes mismo semestre titulacion","verificar_topes_mismo_semestre_titulacion")
        
        .addItem("Verificar Disponibilidad profesores titulación","verificar_Disponibilidad_titulacion")
        .addItem("Verificar Salas Especiales titulación","verificar_topes_Salas_Especiales_titulacion")
        .addItem("Crear Visualizacion Titulacion","visualizarTitulacion")
    )
    .addToUi()
}
function crear_templates(){

const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();

const hoja_plan_comun = createSheetByName(hojasActuales,"PLAN COMUN")
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
const hoja_5y6_comun = createSheetByName(hojasActuales,"V,VI")
const hoja_7y8_comun = createSheetByName(hojasActuales,"VII,VIII")
const hoja_tutulacion_comun = createSheetByName(hojasActuales,"TITULACION")
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

function verifica_concentraciones_5to_y_6to_primer_semestre(){
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_5y6_comun = hojasActuales.getSheetByName("V,VI")
const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
const bloques4y5 = obtenerBloquesPorHoraYDia(hoja_5y6_comun,hoja_data_maestro)
const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
const data_maestro=hoja_data_maestro.getDataRange().getDisplayValues()
const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(data_detalles_malla[idx]))
const bloques4y5_con_detalles= agregar_detalles(bloques4y5,data_detalles_malla)
const topes_concentraciones=obtener_topes_concentraciones_primer_semestre(bloques4y5_con_detalles)

limpiarBackgroundsYComentarios(hoja_5y6_comun,2,2,"CONCENTRACION TOPANDO CON RAMOS DEL SEMESTRE",data_maestro_con_detalles)
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
const data_maestro=hoja_data_maestro.getDataRange().getDisplayValues()
const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(data_detalles_malla[idx]))

limpiarBackgroundsYComentarios(hoja_5y6_comun,2,2,"CONCENTRACION TOPANDO CON RAMOS DEL SEMESTRE",data_maestro_con_detalles)
const topes_concentraciones=obtener_topes_concentraciones_segundo_semestre(bloques4y5_con_detalles)

pintarCeldasConComentario(hoja_5y6_comun,topes_concentraciones,"CONCENTRACION TOPANDO CON RAMOS DEL SEMESTRE")

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
const data_maestro=hoja_data_maestro.getDataRange().getDisplayValues()
const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(data_detalles_malla[idx]))

limpiarBackgroundsYComentarios(hoja_5y6_comun,2,2,"CONCENTRACION TOPANDO CON RAMOS DEL SEMESTRE",data_maestro_con_detalles)
pintarCeldasConComentario(hoja_5y6_comun,topes_concentraciones,"CONCENTRACION TOPANDO CON RAMOS DEL SEMESTRE")

}
//ARREGLAR EL SISTEMA DE NOMBRES DE ESTAS FUNCIONES
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
const data_maestro=hoja_data_maestro.getDataRange().getDisplayValues()
const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(data_detalles_malla[idx]))

limpiarBackgroundsYComentarios(hoja_5y6_comun,2,2,"CONCENTRACION TOPANDO CON RAMOS DEL SEMESTRE",data_maestro_con_detalles)
pintarCeldasConComentario(hoja_5y6_comun,topes_concentraciones,"CONCENTRACION TOPANDO CON RAMOS DEL SEMESTRE")

}

function verificar_topes_mismo_semestre_plan_comun(){
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();

const hoja_plan_comun = hojasActuales.getSheetByName("PLAN COMUN")
const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")

const bloques = obtenerBloquesPorHoraYDia(hoja_plan_comun,hoja_data_maestro)
const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
const data_maestro=hoja_data_maestro.getDataRange().getDisplayValues()
const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(data_detalles_malla[idx]))
console.log(data_maestro_con_detalles)
limpiarBackgroundsYComentarios(hoja_plan_comun,2,2,"TOPE MISMO SEMESTRE",data_maestro_con_detalles)
const bloques_con_detalles = agregar_detalles(bloques,data_detalles_malla)
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
const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
const data_maestro=hoja_data_maestro.getDataRange().getDisplayValues()
const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(data_detalles_malla[idx]))
limpiarBackgroundsYComentarios(hoja_plan_comun,2,2,"BLOQUE DE HORARIO YA ASIGNADO AL PROFESOR",data_maestro_con_detalles)
limpiarBackgroundsYComentarios(hoja_plan_comun,2,2,"HORARIO FUERA DE LA DISPONIBILIADAD DEL PROFESOR",data_maestro_con_detalles)
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
const data_maestro=hoja_data_maestro.getDataRange().getDisplayValues()
const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(data_detalles_malla[idx]))
limpiarBackgroundsYComentarios(hoja_plan_comun,2,2,"PROGRAMADO EN HORARIO PROTEGIDO",data_maestro_con_detalles)
pintarCeldasConComentario(hoja_plan_comun,topes,"PROGRAMADO EN HORARIO PROTEGIDO")



}
function verificar_topes_Salas_Especiales_plan_comun(){
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
const hoja_plan_comun = hojasActuales.getSheetByName("PLAN COMUN")
const hoja_5y6_comun = hojasActuales.getSheetByName("V,VI")
const hoja_7y8_comun = hojasActuales.getSheetByName("VII,VIII")
const hoja_tutulacion_comun = hojasActuales.getSheetByName("TITULACION")
const bloques = obtenerBloquesPorHoraYDia(hoja_plan_comun,hoja_data_maestro)
console.log("bloques paln comun creados",bloques)
const bloques4y5 = obtenerBloquesPorHoraYDia(hoja_5y6_comun,hoja_data_maestro)//estan mal los numeros pero se entiende la diferencia
console.log("bloques 5y6 creados")
const bloques5y6 = obtenerBloquesPorHoraYDia(hoja_7y8_comun,hoja_data_maestro)
console.log("bloques 7y8 comun creados")
const bloques7y8 = obtenerBloquesPorHoraYDia(hoja_tutulacion_comun,hoja_data_maestro)
console.log("bloques titulacion comun creados")




const topes_sala_especial = obtener_topes_sala_especial(bloques)
console.log("topes encontrados: ",topes_sala_especial)

const topes_sala_esoacial_otras_hojas = obtener_topes_sala_especial_otras_hojas(bloques,bloques4y5,bloques5y6,bloques7y8)


const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
const data_maestro=hoja_data_maestro.getDataRange().getDisplayValues()
const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(data_detalles_malla[idx]))

limpiarBackgroundsYComentarios(hoja_plan_comun,2,2,"SALA ESPECIAL YA ASIGNADA EN ESTE BLOQUE DE HORARIO EN OTRA HOJA",data_maestro_con_detalles)
limpiarBackgroundsYComentarios(hoja_plan_comun,2,2,"MISMA SALA ESPECIAL EN USO PARA DIFERENTES SECCIONES",data_maestro_con_detalles)
pintarCeldasConComentario(hoja_plan_comun,topes_sala_especial,"MISMA SALA ESPECIAL EN USO PARA DIFERENTES SECCIONES")
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
const data_maestro=hoja_data_maestro.getDataRange().getDisplayValues()
const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(data_detalles_malla[idx]))
const topes=obtener_topes_semestre_nuevo(bloques_con_detalles)
limpiarBackgroundsYComentarios(hoja_4y5,2,2,"TOPE MISMO SEMESTRE",data_maestro_con_detalles)
console.log(topes)
pintarCeldasConComentario(hoja_4y5,topes,"TOPE MISMO SEMESTRE")

}
function verificar_Horarios_5to_y_6to(){
const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
const hoja_4y5 = hojasActuales.getSheetByName("V,VI")
const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")

const bloques = obtenerBloquesPorHoraYDia(hoja_4y5,hoja_data_maestro)
const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
const data_maestro=hoja_data_maestro.getDataRange().getDisplayValues()
const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(data_detalles_malla[idx]))
const bloques_con_detalles= agregar_detalles(bloques,data_detalles_malla)
const topes=obtener_topes_horario_protegido_5_y_6(bloques_con_detalles)
console.log(topes)
limpiarBackgroundsYComentarios(hoja_4y5,2,2,"PROGRAMADO EN HORARIO PROTEGIDO",data_maestro_con_detalles)
pintarCeldasConComentario(hoja_4y5,topes,"PROGRAMADO EN HORARIO PROTEGIDO")



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
const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
const data_maestro=hoja_data_maestro.getDataRange().getDisplayValues()
const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(data_detalles_malla[idx]))
limpiarBackgroundsYComentarios(hoja_5y6_comun,2,2,"MISMA SALA ESPECIAL EN USO PARA DIFERENTES SECCIONES",data_maestro_con_detalles)
limpiarBackgroundsYComentarios(hoja_5y6_comun,2,2,"SALA ESPECIAL YA ASIGNADA EN ESTE BLOQUE DE HORARIO EN OTRA HOJA",data_maestro_con_detalles)
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
const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
const data_maestro=hoja_data_maestro.getDataRange().getDisplayValues()
const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(data_detalles_malla[idx]))
limpiarBackgroundsYComentarios(hoja_5y6_comun,2,2,"BLOQUE DE HORARIO YA ASIGNADO AL PROFESOR",data_maestro_con_detalles)
limpiarBackgroundsYComentarios(hoja_5y6_comun,2,2,"HORARIO FUERA DE LA DISPONIBILIADAD DEL PROFESOR",data_maestro_con_detalles)
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
const data_maestro=hoja_data_maestro.getDataRange().getDisplayValues()
const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(data_detalles_malla[idx]))
const topes=obtener_topes_semestre_nuevo(bloques_con_detalles)
console.log(topes)
limpiarBackgroundsYComentarios(hoja_titulacion,2,2,"TOPE MISMO SEMESTRE",data_maestro_con_detalles)
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
const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
const data_maestro=hoja_data_maestro.getDataRange().getDisplayValues()
const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(data_detalles_malla[idx]))
limpiarBackgroundsYComentarios(hoja_tutulacion_comun,2,2,"MISMA SALA ESPECIAL EN USO PARA DIFERENTES SECCIONES",data_maestro_con_detalles)
limpiarBackgroundsYComentarios(hoja_tutulacion_comun,2,2,"SALA ESPECIAL YA ASIGNADA EN ESTE BLOQUE DE HORARIO EN OTRA HOJA",data_maestro_con_detalles)
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
const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
const data_maestro=hoja_data_maestro.getDataRange().getDisplayValues()
const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(data_detalles_malla[idx]))
limpiarBackgroundsYComentarios(hoja_tutulacion_comun,2,2,"BLOQUE DE HORARIO YA ASIGNADO AL PROFESOR",data_maestro_con_detalles)
limpiarBackgroundsYComentarios(hoja_tutulacion_comun,2,2,"HORARIO FUERA DE LA DISPONIBILIADAD DEL PROFESOR",data_maestro_con_detalles)
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
const data_maestro=hoja_data_maestro.getDataRange().getDisplayValues()
const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(data_detalles_malla[idx]))
const topes=obtener_topes_semestre_nuevo(bloques_con_detalles)
console.log(topes)
limpiarBackgroundsYComentarios(hoja_7_y_8,2,2,"TOPE MISMO SEMESTRE",data_maestro_con_detalles)
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
const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
const data_maestro=hoja_data_maestro.getDataRange().getDisplayValues()
const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(data_detalles_malla[idx]))
limpiarBackgroundsYComentarios(hoja_7y8_comun,2,2,"MISMA SALA ESPECIAL EN USO PARA DIFERENTES SECCIONES",data_maestro_con_detalles)
limpiarBackgroundsYComentarios(hoja_7y8_comun,2,2,"SALA ESPECIAL YA ASIGNADA EN ESTE BLOQUE DE HORARIO EN OTRA HOJA",data_maestro_con_detalles)
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
const hoja_detalles_malla= hojasActuales.getSheetByName("DETALLES SEMESTRE")
const data_detalles_malla = hoja_detalles_malla.getDataRange().getDisplayValues()
const data_maestro=hoja_data_maestro.getDataRange().getDisplayValues()
const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(data_detalles_malla[idx]))
const topes_disponibilidad_profesores = obtener_topes_disponibilidad_profesores(bloques5y6,bloques4y5,bloques,bloques7y8)
limpiarBackgroundsYComentarios(hoja_7y8_comun,2,2,"BLOQUE DE HORARIO YA ASIGNADO AL PROFESOR",data_maestro_con_detalles)
limpiarBackgroundsYComentarios(hoja_7y8_comun,2,2,"HORARIO FUERA DE LA DISPONIBILIADAD DEL PROFESOR",data_maestro_con_detalles)
pintarCeldasConComentario(hoja_7y8_comun,topes_disponibilidad_profesores[0],"BLOQUE DE HORARIO YA ASIGNADO AL PROFESOR")
pintarCeldasConComentario(hoja_7y8_comun,topes_disponibilidad_profesores[1],"HORARIO FUERA DE LA DISPONIBILIADAD DEL PROFESOR")


}
function visualizarPlanComun(){
  const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
  const hoja_plan_comun = hojasActuales.getSheetByName("PLAN COMUN")
  const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
  const bloques_plan_comun = obtenerBloquesPorHoraYDia_sin_transformar(hoja_plan_comun,hoja_data_maestro)
  const agrupacion_plan_comun = agruparSecciones(bloques_plan_comun)
  const hoja=crear_hoja_nombre("PLAN COMUN VISUALIZACION",hojasActuales)
  const data_maestro = hoja_data_maestro.getDataRange().getDisplayValues()
  const hoja_detalles = hojasActuales.getSheetByName("DETALLES SEMESTRE")
  const detalle_malla=hoja_detalles.getDataRange().getDisplayValues()
  const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(detalle_malla[idx]))
  escribirEnHojaAgrupacion(agrupacion_plan_comun,hoja,data_maestro_con_detalles)
}
function visualizar5y6(){
  const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
  const hoja_5y6 = hojasActuales.getSheetByName("V,VI")
  const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
  const bloques_5y6 = obtenerBloquesPorHoraYDia_sin_transformar(hoja_5y6,hoja_data_maestro)
  const agrupacion_5y6 = agruparSecciones(bloques_5y6)
  const hoja=crear_hoja_nombre("V,VI VISUALIZACION",hojasActuales)
  const data_maestro = hoja_data_maestro.getDataRange().getDisplayValues()
  const hoja_detalles = hojasActuales.getSheetByName("DETALLES SEMESTRE")
  const detalle_malla=hoja_detalles.getDataRange().getDisplayValues()
  const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(detalle_malla[idx]))
  escribirEnHojaAgrupacion(agrupacion_5y6,hoja,data_maestro_con_detalles)
}
function visualizar7y8(){
  const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
  const hoja_7y8 = hojasActuales.getSheetByName("VII,VIII")
  const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
  const bloques_7y8 = obtenerBloquesPorHoraYDia_sin_transformar(hoja_7y8 ,hoja_data_maestro)
  const agrupacion_5y6 = agruparSecciones(bloques_7y8)
  const hoja=crear_hoja_nombre("VII,VIII VISUALIZACION",hojasActuales)
  const data_maestro = hoja_data_maestro.getDataRange().getDisplayValues()
  const hoja_detalles = hojasActuales.getSheetByName("DETALLES SEMESTRE")
  const detalle_malla=hoja_detalles.getDataRange().getDisplayValues()
  const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(detalle_malla[idx]))
  escribirEnHojaAgrupacion(agrupacion_5y6,hoja,data_maestro_con_detalles)
}
function visualizarTitulacion(){
  const hojasActuales = SpreadsheetApp.getActiveSpreadsheet();
  const hoja_titulacion = hojasActuales.getSheetByName("TITULACION")
  const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
  const bloques_titulacion = obtenerBloquesPorHoraYDia_sin_transformar(hoja_titulacion,hoja_data_maestro)
  const agrupacion_titulacion = agruparSecciones(bloques_titulacion)
  const hoja=crear_hoja_nombre("TITULACION VISUALIZACION",hojasActuales)
  const data_maestro = hoja_data_maestro.getDataRange().getDisplayValues()
  const hoja_detalles = hojasActuales.getSheetByName("DETALLES SEMESTRE")
  const detalle_malla=hoja_detalles.getDataRange().getDisplayValues()
  const data_maestro_con_detalles=data_maestro.map((elemento,idx)=>elemento.concat(detalle_malla[idx]))
  escribirEnHojaAgrupacion(agrupacion_titulacion,hoja,data_maestro_con_detalles)
}
function actualizar_maestro(){
  const hojasActuales = SpreadsheetApp.getActiveSpreadsheet()
  const hoja_plan_comun = hojasActuales.getSheetByName("PLAN COMUN")
  const hoja_5y6 = hojasActuales.getSheetByName("V,VI")
  const hoja_7y8 = hojasActuales.getSheetByName("VII,VIII")
  const hoja_titulacion = hojasActuales.getSheetByName("TITULACION")
  const hoja_data_maestro = hojasActuales.getSheetByName("DATOS MAESTRO")
  const bloques = obtenerBloquesPorHoraYDia(hoja_plan_comun,hoja_data_maestro)
  const bloques_5y6 = obtenerBloquesPorHoraYDia(hoja_5y6,hoja_data_maestro)
  const bloques_7Y8 = obtenerBloquesPorHoraYDia(hoja_7y8,hoja_data_maestro)
  const bloques_titulacion = obtenerBloquesPorHoraYDia(hoja_titulacion,hoja_data_maestro)
  let horarios=agruparHorarios(bloques)
  let horarios_5y6=agruparHorarios(bloques_5y6)
  let horarios_7y8=agruparHorarios(bloques_7Y8)
  let horarios_titulacion=agruparHorarios(bloques_titulacion)
  const horarios_hojas=[horarios,horarios_5y6,horarios_7y8,horarios_titulacion]
  console.log(horarios)
  const idSpreadsheet = id_hoja_maestro;
  const hoja_maestro = SpreadsheetApp.openById(idSpreadsheet).getSheetByName('MAESTRO');
  const col_lunes= obtenerNumeroDeColumna(hoja_maestro,"Lunes",1)
  const col_martes= obtenerNumeroDeColumna(hoja_maestro,"Martes",1)
  const col_miercoles= obtenerNumeroDeColumna(hoja_maestro,"Miercoles",1)
  const col_jueves= obtenerNumeroDeColumna(hoja_maestro,"Jueves",1)
  const col_viernes= obtenerNumeroDeColumna(hoja_maestro,"Viernes",1)
  const col_dias=[col_lunes,col_martes,col_miercoles,col_jueves,col_viernes]
  const dias=["Lunes","Martes","Miercoles","Jueves","Viernes"]
  limpiarColumnas(hoja_maestro,col_dias)
  let data_maestro = hoja_maestro.getDataRange().getDisplayValues();
  data_maestro.shift()


  
  horarios_hojas.forEach((horario)=>{
    data_maestro=actualizar_data_maestro(data_maestro,horario,col_dias,dias)
  })
  
  escribirDatosYResaltar(hoja_maestro,data_maestro)
  agregar_listas_desplegables(data_maestro,hoja_maestro,col_dias,dias)
}
function actualizarDesplegables(){
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
  
actualizar_listas_desplegables(hoja_plan_comun,bloques_plan_comun)


actualizar_listas_desplegables(hoja_5y6_comun,bloques_5y6)


actualizar_listas_desplegables(hoja_7y8_comun,bloques_7y8)


actualizar_listas_desplegables(hoja_tutulacion_comun,bloques_titulacion)

}






