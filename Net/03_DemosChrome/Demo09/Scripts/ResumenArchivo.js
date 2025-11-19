window.onload = async function () {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@latest/build/pdf.worker.min.mjs';

    btnSeleccionar.onclick = function () {
        fupArchivo.click();
    }

    fupArchivo.onchange = function (event) {
        var file = this.files[0];
        txtArchivo.value = file.name;
        var reader = new FileReader();
        reader.onloadend = async function (event) {
            var texto = "";
            var buffer = reader.result;
            const loadingTask = pdfjsLib.getDocument({ data: buffer });
            const pdfDocument = await loadingTask.promise;
            for (var pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
                var page = await pdfDocument.getPage(pageNum);
                var textContent = await page.getTextContent();
                texto += textContent.items.map(s => s.str).join('\n');
                texto += "\r\n";
            }
            if (texto.length < (15 * 1024)) {
                divTexto.innerText = texto;
                detectarIdioma();
            }
            else alert("No se puede resumir un archivo con mas de 15KB de texto");
        }
        reader.readAsArrayBuffer(file);
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

    btnGrabarResumen.onclick = function () {
        var blob = new Blob([divTraduccion.innerText], {"type":"text/plain"});
        var enlace = document.createElement("a");
        enlace.download = txtArchivo.value.split(".")[0] + ".txt";
        enlace.href = URL.createObjectURL(blob);
        enlace.click();
    }
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