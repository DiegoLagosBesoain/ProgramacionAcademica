# Gestión Académica en Google Sheets 📋
## MAESTRO
### Descripción

Este script automatiza procesos administrativos relacionados con la gestión académica, como la creación y actualización de hojas de cálculo para diferentes áreas, validación de cambios en datos, y asignación de horarios o secciones. 
Está diseñado para usarse en el entorno de Google Sheets, utilizando Google Apps Script para integrar hojas de cálculo con funcionalidades personalizadas, conexion con appWeb de formularios.

### Características

- **Agregar Secciones:** Asigna secciones a los cursos según datos predefinidos.
- **Crear Hojas por Área:** Divide los datos en hojas separadas por área creando hojas en espejo para el maestro y para lso cordinadores de cada area.
- **Validar Cambios:** Resalta y actualiza cambios en los datos según hojas maestras.
- **Crear Horarios:** Asigna horarios automáticamente a los cursos con base en los datos ingresados.
- **Notificaciones Automáticas:** Envia correos electrónicos para cambios relevantes en los datos o actualizaciones importantes.

### Requisitos

- Acceso a una cuenta de Google.
- Permisos para modificar Google Sheets a través de Google Apps Script de las diferentes hojas.
- Un archivo de hoja de cálculo de Google Sheets con las plantillas y datos necesarios:
    -Hoja maestro con el encabezado pero vacio
    -Presupuesto
    -Catalogo
    -Listado NRC semestre espejo
- Carpeta en dirve con permisos para crear las hojas de cordinadores
.

### Instalación

1. Abre tu hoja de cálculo en Google Sheets.
2. Ve a `Extensiones` > `Apps Script`.
3. Copia y pega el código del script en el editor de Apps Script.
4. Guarda los cambios.
5. Asegúrate de otorgar los permisos adecuados para ejecutar el script (autenticación).

### Uso

- **Ejecutar el script manualmente:**
  - Abre el editor de Apps Script y selecciona la función que desees ejecutar.
  - Haz clic en el ícono de "Ejecutar" para iniciar el proceso.

- **Automatizar tareas:**
  - Puedes configurar activadores desde el editor de Apps Script para ejecutar ciertas funciones en intervalos específicos (por ejemplo, cada vez que se edite una celda o se abra el documento).


