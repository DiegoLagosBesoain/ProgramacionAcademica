# Gestión Académica en Google Sheets 📋
## MAESTRO
### Descripción

Este script automatiza procesos administrativos relacionados con la gestión académica, como la creación y actualización de hojas de cálculo para diferentes áreas, validación de cambios en datos, y asignación de horarios o secciones. 
Está diseñado para usarse en el entorno de Google Sheets, utilizando Google Apps Script para integrar hojas de cálculo con funcionalidades personalizadas, conexion con appWeb de formularios.


### Requisitos

- Acceso a una cuenta de Google.
- Permisos para modificar Google Sheets a través de Google Apps Script de las diferentes hojas.
- Un archivo de hoja de cálculo de Google Sheets con las plantillas y datos necesarios:
    1. Hoja `MAESTRO` con el encabezado pero vacio
    2. `Presupuesto`
    3. `CATALOGO`
    4. `NRC POR PERIODO ESPEJO` semestre espejo con encabezado y la informacion desde la segunda fila
    5. Hoja `CATALOGO ANTIGUO`(opcional)
    6. Hoja `PROFESORES` con la informacion de los profesores de jornada con rut en la segunda columna
    7. Hoja `RESPUESTAS`,`PREFERENCIAS`,`OTROS`,`ENTREGADOS`Creadas y vacias para poder recibir las respuestas de los formularios
- Carpeta en dirve con permisos para crear las hojas de cordinadores


### Instalación

1. Abre tu hoja de cálculo en Google Sheets.
2. Ve a `Extensiones` > `Apps Script`.
3. Copia y pega el código del script en el editor de Apps Script En los archivos creados con el mismo nombre.
4. Guarda los cambios.
5. Asegúrate de otorgar los permisos adecuados para ejecutar el script (autenticación).
6.  Abre el editor de Apps Script y selecciona la función que desees ejecutar.
7. Haz clic en el ícono de "Ejecutar" para iniciar el proceso.

- **Consideraciones:**
  - De cambiar el nombre de las hojas o no existir alguna el programa puede presentar fallas en su funcionamiento.
  - la hoja `NRC POR PERIODO ESPEJO` es improtante no cambiar el orden de las columnas de lo contrario no podra traer los cupos historicos ni los nrc existentes
## CalendarioHorario
### Descripción
Este programa se dedica a la craion y asignacion de horarios para cada tipod e reunion existente en cada asginatura para cada seccion, el programa se centre en la deteccion de restricciones presentes en al programacion de horarios para mas detalles de las restricciones visitar [la documentacion ](https://docs.google.com/document/d/18BQm9B1-aJW8mY22hJDP9fxbyFzg-mBxT-zZ_NI6Zqc/edit?tab=t.0) admeas actualiza automaticamente el maestro con los horarios asignados, adicionalemnte tien un sistema de visualizaciones y sistemas de colores para mejorar la comprension
### Requisitos

- Acceso a una cuenta de Google.
- Permisos para modificar Google Sheets a través de Google Apps Script de las diferentes hojas.
- Un archivo de hoja de cálculo de Google Sheets con las plantillas y datos necesarios:
    1. Hoja `DATOS MAESTRO` vacia
    2. Hoja `DETALLES SEMESTRE` vacia
    3.  Hoja `SALAS ESPECIALES` con una columna de lista que se se usara como desplegable para las salas especiales
   
- Carpeta Hoja maestro creada y que el usuario que esta usando este programa tenga acceso de edicion a ella
    


