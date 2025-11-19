var idiomaOrigen = "";
var summarizer = null;

window.onload = function () {
    btnDescargar.onclick = async function () {
        if ('Summarizer' in self) {
            const disponible = await Summarizer.availability();
            console.log("disponible: ", disponible);
            if (disponible == "downloadable") {
                const options = {
                    sharedContext: 'This is a scientific article',
                    type: 'key-points',
                    format: 'plain-text',
                    length: 'medium',
                    expectedInputLanguages: ['en', 'es'],
                    outputLanguage: 'es',
                    monitor(m) {
                        m.addEventListener('downloadprogress', (e) => {
                            console.log(`Downloaded ${e.loaded * 100}%`);
                        });
                    }
                };
                summarizer = await Summarizer.create(options);                
            }
        }
        else alert("No se encuentra disponible la API Summarizer");
    }

    btnSeleccionar.onclick = function () {
        fupArchivo.click();
    }

    fupArchivo.onchange = function (event) {
        var file = this.files[0];
        txtArchivo.value = file.name;
        if (file.size < 15 * 1024) {
            var reader = new FileReader();
            reader.onloadend = async function (event) {
                var texto = reader.result;
                divTexto.innerText = texto;
                if ('LanguageDetector' in self) {
                    detector = await LanguageDetector.create({
                        monitor(m) {
                            m.addEventListener('downloadprogress', (e) => {
                                console.log(`Downloaded ${e.loaded * 100}%`);
                            });
                        },
                    });
                    const results = await detector.detect(texto);
                    if (results.length > 0) {
                        var idiomaOrigen = results[0].detectedLanguage;
                        if (idiomaOrigen == "es") spnIdiomaActual.innerText = "Castellano";
                        if (idiomaOrigen == "en") spnIdiomaActual.innerText = "Ingles";
                        btnResumir.disabled = !(idiomaOrigen == "es" || idiomaOrigen == "en");
                    }
                }
            }
            reader.readAsText(file);
        }
        else alert("Solo se puede traducir archivos hasta 15 KB");
    }

    btnResumir.onclick = async function () {
        if (divTexto.innerText != "") {
            const disponible = await Summarizer.availability();
            console.log("disponible: ", disponible);
            if (disponible == "available") {
                btnDescargar.disabled = true;
                btnResumir.disabled = true;
                const options = {
                    sharedContext: 'This is a scientific article',
                    type: 'key-points',
                    format: 'plain-text',
                    length: 'long',
                    expectedInputLanguages: ['en', 'es'],
                    outputLanguage: 'es',
                };
                summarizer = await Summarizer.create(options);
                var resumen = await summarizer.summarize(divTexto.innerText, {
                    context: 'This article is intended for a tech-savvy audience.',
                });
                divResumen.innerText = resumen;
                btnDescargar.disabled = false;
                btnResumir.disabled = false;
            }
        }
        else {
            alert("Selecciona el Archivo de Texto a resumir");
            txtTexto.focus();
        }
    }

    btnNuevo.onclick = function () {
        txtArchivo.value = "";
        fupArchivo.value = "";
        divTexto.innerText = "";
        divResumen.innerText = "";
        spnIdiomaActual.innerText = "";
    }
}