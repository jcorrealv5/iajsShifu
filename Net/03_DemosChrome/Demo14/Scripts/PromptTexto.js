var sesion = null;
var diccionario = {};

window.onload = function () {
    iniciarAPI();

    btnDescargarModelo.onclick = function () {
        iniciarAPI();
    }

    btnEnviarMensaje.onclick = async function () {  
        btnEnviarMensaje.disabled = true;
        divRespuesta.innerText = "";        
        var resultado = await sesion.prompt([
            {
                role: "user",
                content: txtMensaje.value
            },
        ]);
        divRespuesta.innerText = resultado;
        diccionario[txtMensaje.value] = resultado;
        btnEnviarMensaje.disabled = false;
    }

    btnDescargarConversacion.onclick = function () {
        var texto = "";
        var c = 0;
        for (clave in diccionario) {
            c++;
            texto += "Pregunta " + c + ": " + clave;
            texto += "\r\n";
            texto += "Respuesta:";
            texto += "\r\n";
            texto += diccionario[clave];
            texto += "_".repeat(100);
            texto += "\r\n";
        }
        var blob = new Blob([texto], {"type":"text/plain"});
        var enlace = document.createElement("a");
        enlace.href = URL.createObjectURL(blob);
        enlace.download = "Chat.txt";
        enlace.click();
    }
}

async function iniciarAPI() {
    if ("LanguageModel" in self) {
        var disponibilidad = await LanguageModel.availability();
        console.log("disponibilidad: ", disponibilidad);
        if (disponibilidad == "unavailable") {
            alert("La API LanguageModel No puede cargarse por Hardware");
            return;
        }
        if (disponibilidad == "available") {
            var params = await LanguageModel.params();
            console.log("parametros: ", params);
            sesion = await LanguageModel.create({
                temperature: Math.max(params.defaultTemperature * 1.2, 2.0),
                topK: params.defaultTopK,
            });
            sesion = await LanguageModel.create({
                initialPrompts: [
                    { role: 'user', content: "Me puedes ayudar con mis preguntas" },
                ],
            });
            btnEnviarMensaje.disabled = false;
        }
        else {
            sesion = await LanguageModel.create({
                monitor(m) {
                    m.addEventListener('downloadprogress', (e) => {
                        console.log(`Downloaded ${e.loaded * 100}%`);
                    });
                },
            });
        }
    }
    else alert("No esta soportada la API LanguageModel")
}