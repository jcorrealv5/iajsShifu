window.onload = async function () {
    btnSeleccionar.onclick = function () {
        fupArchivo.click();
    }

    fupArchivo.onchange = function (event) {
        var file = this.files[0];
        txtArchivo.value = file.name;
        getEntries(file, function (entries) {
            var texto = "";
            entries.forEach(function (entry) {
                if (entry.filename == "word/document.xml") {
                    writer = new zip.BlobWriter();
                    entry.getData(writer, function (blob) {
                        var reader = new FileReader();
                        reader.onloadend = async function (e) {
                            var xmlString = reader.result;
                            var parser = new DOMParser();
                            var xmlDoc = parser.parseFromString(xmlString, "application/xml");
                            var parrafos = xmlDoc.getElementsByTagNameNS("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "p");
                            for (var i = 0; i < parrafos.length; i++) {
                                var textos = parrafos[i].getElementsByTagNameNS("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "t");
                                for (var j = 0; j < textos.length; j++) {
                                    texto += textos[j].textContent;
                                }
                                texto += "\r\n";
                            }
                            if (texto.length < 17 * 1024) {
                                divTexto.innerText = texto;
                                detectarIdioma();
                            }
                            else alert("No se puede traducir documentos con mas de 17KB de texto");
                        }
                        reader.readAsText(blob, "UTF-8");
                    }, function (current, total) {
                        //console.log(current + " de " + total);
                    });
                }
            });
         });
    }

    btnResumir.onclick = async function () {
        if (divTexto.innerText != "") {
            const disponible = await Summarizer.availability();
            console.log("disponible: ", disponible);
            if (disponible == "available") {
                btnResumir.disabled = true;
                const options = {
                    sharedContext: 'This is a scientific article',
                    type: 'key-points',
                    format: 'plain-text',
                    length: 'long',
                    expectedInputLanguages: ['en', 'es'],
                    outputLanguage: 'es',
                };
                var summarizer = await Summarizer.create(options);
                var resumen = await summarizer.summarize(divTexto.innerText, {
                    context: 'This article is intended for a tech-savvy audience.',
                });
                divResumen.innerText = resumen;
                btnResumir.disabled = false;
            }
        }
        else {
            alert("Selecciona el Archivo de Texto a traducir");
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

    btnGrabarResumen.onclick = function () {
        var blob = new Blob([divTraduccion.innerText], {"type":"text/plain"});
        var enlace = document.createElement("a");
        enlace.download = txtArchivo.value.split(".")[0] + "_" + spnIdiomaTraducir.innerText + ".txt";
        enlace.href = URL.createObjectURL(blob);
        enlace.click();
    }
}

function getEntries(file, onend) {
    zip.workerScriptsPath = "/Scripts/";
    zip.createReader(new zip.BlobReader(file), function (zipReader) {
        zipReader.getEntries(onend);
    }, onerror);
}

async function detectarIdioma() {
    if ('LanguageDetector' in self) {
        var detector = await LanguageDetector.create({
            monitor(m) {
                m.addEventListener('downloadprogress', (e) => {
                    console.log(`Downloaded ${e.loaded * 100}%`);
                });
            },
        });
        const results = await detector.detect(divTexto.innerText);
        if (results.length > 0) {
            var idiomaOrigen = results[0].detectedLanguage;
            if (idiomaOrigen == "es") spnIdiomaActual.innerText = "Castellano";
            if (idiomaOrigen == "en") spnIdiomaActual.innerText = "Ingles";
            btnResumir.disabled = !(idiomaOrigen == "es" || idiomaOrigen == "en");
        }
    }
}