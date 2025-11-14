# Discord Presence 🙈🙈

Herramienta simple para configurar un estado de discord desde la consola o desde un `.exe`. El programa te pregunta por cada campo necesario (Client ID, textos, imagenes, botones) y mantiene la presencia activa hasta que cierres la ventana.

## Lo que necesitas antes de empezar
- **Node.js 18+** para ejecutar el script y construir el `.exe`.
- **Aplicacion en el Developer Portal**: https://discord.com/developers/applications
  - Tu Client ID sale de la pestaña *General Information*.
  - Las imagenes deben estar en *Rich Presence > Art Assets*. El nombre del asset (por ejemplo `hola`) es la asset que debes escribir. Discord no acepta links directos. [imagen](https://prnt.sc/HrJTQe7JH0zf)
  - Instala dependencias con `npm install` o simplemente abre el .exe (creado con npm run build:exe).

## Como usarlo con `npm start`
1. Ejecuta `npm start` (o `node snelty_presence.js`).
2. Responde cada pregunta:
   - **Discord Application Client ID**: lo copias del portal.
   - **Details / State**: titulo y estado que veran tus amigos.
   - **Imagenes**: escribe los nombres exactos de tus assets. Si dejas el texto del hover vacio, el script no lo envia.
   - **startTimestamp**: responde `y` si quieres mostrar el contador de tiempo.
   - **Botones**: puedes agregar hasta uno; ingresa un label (2-32 caracteres) y una URL https. (tu no lo veras, los demas usuarios sí)
   - **Instance**: normalmente `n`, salvo que quieras marcar la actividad como unica.
3. Deja el programa abierto; actualiza la presencia cada 15s. Presiona `Ctrl+C` para terminar.

## Como generar y usar un `.exe` "nuevo"
1. Instala `pkg` (`npm install --global pkg` o usa `npx pkg`).
2. Ejecuta `npm run build:exe`. Se crea `dist/snelty-presence.exe`.
3. Copia el `.exe` a la carpeta que quieras y abrilo con doble clic. Veras exactamente las mismas preguntas que con `npm start`.
4. El `.exe` tambien necesita que tengas Discord abierto con tu cuenta y que la app tenga los assets configurados.

## Notas utiles
- La presencia solo muestra botones a otros usuarios y en tu propio cliente puede que no se vean.
- Si agregas assets nuevos, espera a que el portal los procese y reinicia Discord para que reconozca las keys.

## Archivos principales
- `snelty_presence.js`: CLI interactiva que usa `discord-rpc`.
- `package.json`: scripts (`start`, `build:exe`) y configuracion de `pkg` para empaquetar todo en un ejecutable.
