var sesion = null;
var file = null;

window.onload = function () {
    iniciarAPI();

    btnSeleccionar.onclick = function () {
        fupImagen.click();
    }

    fupImagen.onchange = function () {
        file = this.files[0];
        txtArchivo.value = file.name;
        var reader = new FileReader();
        reader.onloadend = function () {
            imgReferencia.src = reader.result;
        }
        reader.readAsDataURL(file);
    }

    btnEnviarMensaje.onclick = async function () {
        this.disabled = true;
        await sesion.append([
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        value: 'Aqui esta la foto para que contestes las preguntas',
                    },
                    { type: 'image', value: file },
                ],
            },
        ]);
        divRespuesta.textContent = await sesion.prompt(txtMensaje.value);
        this.disabled = false;
    }

    btnNuevo.onclick = function () {
        txtArchivo.value = "";
        fupImagen.value = "";
        txtMensaje.value = "";
        imgReferencia.src = "";
        divRespuesta.innerHTML = "";
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
                    { role: 'user', content: "Me puedes ayudar con la imagen" },
                ],
                expectedInputs: [{ type: 'image' }],
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
    else alert("No esta soportada la API LanguageModel");
}