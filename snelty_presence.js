const rpc = require("discord-rpc");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function question(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}

async function prompt(label, { defaultValue, required = false } = {}) {
    while (true) {
        const suffix = defaultValue !== undefined && defaultValue !== null && defaultValue !== "" ? ` [${defaultValue}]` : "";
        const answer = (await question(`${label}${suffix}: `)).trim();
        if (answer) return answer;
        if (answer === "" && defaultValue !== undefined) return defaultValue;
        if (!required) return "";
        console.log("Este campo es obligatorio. Intenta de nuevo.");
    }
}

async function promptBool(label, defaultValue = false) {
    const suffix = defaultValue ? "Y/n" : "y/N";
    const answer = (await question(`${label} (${suffix}): `)).trim().toLowerCase();
    if (!answer) return defaultValue;
    return ["y", "yes", "s", "si", "true", "1"].includes(answer);
}

function printBanner() {
    console.log(String.raw`
  #########                      ####   #####              
 ###.....###                    ..###  ..###               
.###    ...  ########    ######  .###  #######   ##### ####
..######### ..###..###  ###..### .### ...###.   ..### .### 
 .........### .### .### .#######  .###   .###     .### .### 
 ###    .### .### .### .###..    .###   .### ### .### .### 
..#########  #### #####..######  #####  ..#####  ..####### 
 .........  .... .....  ......  .....    .....    .....### 
                                                  ### .### 
                                                 ..######  
                                                  ......   
                    goat
`);
}

async function buildActivityPayload() {
    const activity = {};

    const details = await prompt("Detalle principal (details)");
    if (details) {
        activity.details = details;
    }

    const state = await prompt("Estado secundario (state)");
    if (state) {
        activity.state = state;
    }

    const largeImage = await prompt("Nombre del asset - imagen grande (rich presence - art assets)");
    if (largeImage) {
        activity.largeImageKey = largeImage;
        const largeText = await prompt("Texto al pasar el mouse por la imagen grande (min 2 caracteres)", { defaultValue: "" });
        if (largeText.length >= 2) {
            activity.largeImageText = largeText;
        } else if (largeText.length === 1) {
            console.log("Aviso: el texto para la imagen grande necesita al menos 2 caracteres; se omitira.");
        }
    }

    const smallImage = await prompt("Nombre del asset - imagen pequena (opcional)");
    if (smallImage) {
        activity.smallImageKey = smallImage;
        const smallText = await prompt("Texto al pasar el mouse por la imagen pequena (min 2 caracteres)", { defaultValue: "" });
        if (smallText.length >= 2) {
            activity.smallImageText = smallText;
        } else if (smallText.length === 1) {
            console.log("Aviso: el texto para la imagen pequena necesita al menos 2 caracteres; se omitira.");
        }
    }

    if (await promptBool("Mostrar contador de tiempo (startTimestamp)", true)) {
        activity.startTimestamp = Math.floor(Date.now() / 1000);
    }

    if (await promptBool("Agregar un boton con link", false)) {
        const label = await prompt("Texto del boton", { required: true });
        const url = await prompt("URL del boton", { required: true });
        activity.buttons = [{ label, url }];
    }

    activity.instance = await promptBool("Marcar actividad como instancia unica (instance)", false);

    return activity;
}

async function main() {
    printBanner();
    console.log("Discord Presence CLI -> By Snelty 🙈🙈\n---------------------------");
    const clientId = await prompt("Discord Application Client ID", { required: true });

    const client = new rpc.Client({ transport: "ipc" });

    client.on("ready", async () => {
        console.log("Conectado. Configurando presencia...");
        const activity = await buildActivityPayload();
        await client.setActivity(activity);
        console.log("Actividad en curso. Manten esta ventana abierta. Ctrl+C para salir.");

        const interval = setInterval(() => {
            client.setActivity(activity).catch((err) => console.error("Error actualizando presencia:", err));
        }, 15 * 1000);

        const cleanExit = () => {
            clearInterval(interval);
            client.clearActivity().finally(() => client.destroy());
            console.log("Actividad cerrada. chao!");
            process.exit(0);
        };

        process.once("SIGINT", cleanExit);
        process.once("SIGTERM", cleanExit);
    });

    client.on("disconnected", () => {
        console.log("Discord RPC desconectado.");
    });

    client.on("error", (err) => {
        console.error("Error en Discord RPC:", err);
    });

    try {
        await client.login({ clientId });
    } catch (error) {
        console.error("No se pudo conectar con Discord RPC:", error.message);
        process.exit(1);
    }
}

main().catch((err) => {
    console.error("Error inesperado:", err);
    process.exit(1);
});

