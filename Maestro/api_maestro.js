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

  const columnaLunes = obtenerNumeroDeColumna(sheetMaestro,"Lunes",1)
  const columnaMartes = obtenerNumeroDeColumna(sheetMaestro,"Martes",1)
  const columnaMiercoles = obtenerNumeroDeColumna(sheetMaestro,"Miercoles",1)
  const columnaJueves = obtenerNumeroDeColumna(sheetMaestro,"Jueves",1)
  const columnaViernes = obtenerNumeroDeColumna(sheetMaestro,"Viernes",1)
  const columnallave = obtenerNumeroDeColumna(sheetMaestro,"LLAVE Código- sec ",1)

  const lastRow = sheetMaestro.getLastRow()

  // 🔹 limpiar columnas antes de escribir
  sheetMaestro.getRange(2, columnaLunes, lastRow-1).clearContent()
  sheetMaestro.getRange(2, columnaMartes, lastRow-1).clearContent()
  sheetMaestro.getRange(2, columnaMiercoles, lastRow-1).clearContent()
  sheetMaestro.getRange(2, columnaJueves, lastRow-1).clearContent()
  sheetMaestro.getRange(2, columnaViernes, lastRow-1).clearContent()

  const data_maestro = leerHojaSinEncabezado("MAESTRO")

  data_maestro.forEach((fila)=>{
    if(body[fila[columnallave]]){
      fila[columnaLunes] = body[fila[columnallave]]["Lunes"].join(", ")
      fila[columnaMartes] = body[fila[columnallave]]["Martes"].join(", ")
      fila[columnaMiercoles] = body[fila[columnallave]]["Miércoles"].join(", ")
      fila[columnaJueves] = body[fila[columnallave]]["Jueves"].join(", ")
      fila[columnaViernes] = body[fila[columnallave]]["Viernes"].join(", ")
    }
  })

  escribirListaDeListasDesdeFila(data_maestro,"MAESTRO",2)

  return json({
    ok: true,
    message: "JSON recibido correctamente",
    content: body
  });
}



function apiPruebasFechas(body) {

  console.log("📅 JSON pruebas recibido:");
  console.log(body);

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName("MAESTRO");

  const data = leerHojaSinEncabezado("MAESTRO");

  const colLlave = obtenerNumeroDeColumna(sheet,"LLAVE Código- sec ",1);
  const colObservacion = obtenerNumeroDeColumna(sheet,"OBSERVACION",1);

  const lastColumn = sheet.getLastColumn();

  const headers = sheet.getRange(1,1,1,lastColumn).getValues()[0];

  /*
  =========================
  LIMPIAR FECHAS EN MEMORIA
  =========================
  */

  const inicioFechas = colObservacion + 1; // 0-based

  data.forEach((fila) => {
    for (let c = inicioFechas; c < fila.length; c++) {
      fila[c] = "";
    }
  });

  /*
  =========================
  MAPEAR COLUMNAS DE FECHA
  =========================
  */

  const mapaFechas = {};

  for (let c = colObservacion + 1; c < headers.length; c++) {

    const valor = headers[c];
    if (!valor) continue;

    let fecha;

    if (valor instanceof Date) {
      fecha = Utilities.formatDate(
        valor,
        Session.getScriptTimeZone(),
        "yyyy-MM-dd"
      );
    } else {
      fecha = normalizarFecha(valor);
    }

    mapaFechas[fecha] = c; // sigue siendo 0-based
  }

  /*
  =========================
  RECORRER MAESTRO
  =========================
  */

  data.forEach((fila) => {

    const codigo = fila[colLlave];

    if (!body[codigo]) return;

    const pruebas = body[codigo];

    pruebas.forEach((prueba) => {

      const fecha = prueba.fecha;
      const col = mapaFechas[fecha];

      if (col === undefined) return;

      fila[col] = `${prueba.tipo} ${prueba.horario}`;

    });

  });

  escribirListaDeListasDesdeFila(data,"MAESTRO",2);

  return json({
    ok:true,
    message:"Pruebas escritas correctamente",
    content:body
  });

}
function onEdit(e){

  const sheetName = "MAESTRO";
  const colUIName = "USO_UI";
  const colDataName = "USO_DATA";

  const sheet = e.range.getSheet();
  if(sheet.getName() !== sheetName) return;

  const headers = sheet
    .getRange(1,1,1,sheet.getLastColumn())
    .getValues()[0];

  const colUI = headers.indexOf(colUIName) + 1;
  const colData = headers.indexOf(colDataName) + 1;

  if(colUI === 0 || colData === 0) return;

  if(e.range.columnStart !== colUI) return;
  if(e.range.rowStart === 1) return;

  const valor = e.range.getDisplayValue();

  sheet
    .getRange(e.range.rowStart, colData)
    .setValue(valor);
}

function normalizarFecha(valor){

  const partes = valor.split("/");

  const dia = partes[0].padStart(2,"0");
  const mes = partes[1].padStart(2,"0");
  const año = partes[2];

  return `${año}-${mes}-${dia}`;

}


