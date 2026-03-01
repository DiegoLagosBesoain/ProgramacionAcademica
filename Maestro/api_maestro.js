function apiMaestroListar(e) {
  const sheet = SpreadsheetApp
    .getActive()
    .getSheetByName("MAESTRO");

  if (!sheet) {
    return json({ error: "Hoja MAESTRO no existe" });
  }

  const values = sheet.getDataRange().getValues();
  const headers = values.shift();

  const data = values.map(row =>
    headers.reduce((obj, key, i) => {
      obj[key] = row[i];
      return obj;
    }, {})
  );

  return json(data);
}
function apiSheetTest(body) {
  console.log("📩 JSON recibido:");
  console.log(body);
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheetMaestro = spreadsheet.getSheetByName('MAESTRO');
  const columnaLunes =obtenerNumeroDeColumna(sheetMaestro,"Lunes",1)
  const columnaMartes =obtenerNumeroDeColumna(sheetMaestro,"Martes",1)
  const columnaMiercoles =obtenerNumeroDeColumna(sheetMaestro,"Miercoles",1)
  const columnaJueves =obtenerNumeroDeColumna(sheetMaestro,"Jueves",1)
  const columnaViernes =obtenerNumeroDeColumna(sheetMaestro,"Viernes",1)
  const columnallave =obtenerNumeroDeColumna(sheetMaestro,"LLAVE Código- sec ",1)
  const data_maestro = leerHojaSinEncabezado("MAESTRO")
  data_maestro.forEach((fila)=>{
    if(body[fila[columnallave]]){
      fila[columnaLunes]=body[fila[columnallave]]["Lunes"].join(", ")
      fila[columnaMartes]=body[fila[columnallave]]["Martes"].join(", ")
      fila[columnaMiercoles]=body[fila[columnallave]]["Miércoles"].join(", ")
      fila[columnaJueves]=body[fila[columnallave]]["Jueves"].join(", ")
      fila[columnaViernes]=body[fila[columnallave]]["Viernes"].join(", ")




    }


  })
  escribirListaDeListasDesdeFila(data_maestro,"MAESTRO",2)

  return json({
    ok: true,
    message: "JSON recibido correctamente",
    content:body
  });
}