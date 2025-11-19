var idiomaOrigen="";
window.onload = async function () {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@latest/build/pdf.worker.min.mjs';

    cargarLista("");
    var detector = null;

    if ('LanguageDetector' in self) {
        detector = await LanguageDetector.create({
            monitor(m) {
                m.addEventListener('downloadprogress', (e) => {
                    console.log(`Downloaded ${e.loaded * 100}%`);
                });
            },
        });
    }

    if ('Translator' in self) {  
        cboIdioma.disabled = false;
    }
    else alert("No se encuentra disponible la API Translator");

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
            divTexto.innerText = texto;
            if (detector != null) {
                const results = await detector.detect(texto);
                if (results.length > 0) {
                    idiomaOrigen = results[0].detectedLanguage;
                    spnIdiomaActual.innerText = buscarValorLista(idiomaOrigen);
                    cargarLista(idiomaOrigen);
                    spnIdiomaTraducir.innerText = buscarValorLista(cboIdioma.value);
                    validarIdiomas();
                }
            }
        }
        reader.readAsArrayBuffer(file);
    }

    cboIdioma.onchange = function () {
        spnIdiomaTraducir.innerText = buscarValorLista(cboIdioma.value);        
    }

    btnTraducir.onclick = async function () {
        if (divTexto.innerText != "") {
            var translator = await Translator.create({
                sourceLanguage: idiomaOrigen,
                targetLanguage: cboIdioma.value,
            });
            var lineas = divTexto.innerText.split("\n");
            var nLineas = lineas.length;
            var bloque = 1;
            if (nLineas > 100) bloque = Math.floor(nLineas / 100);
            var c = 0;
            var parte = "";
            for (var i = 0; i < nLineas; i++) {
                c++;
                if (c % bloque==0) {
                    progreso.value++;
                    spnProgreso.innerText = progreso.value + " %";
                }
                parte = "\n";
                if (lineas[i] != "") {
                    parte = await translator.translate(lineas[i]);
                    parte += "\n";
                }
                divTraduccion.innerText += parte;
                divTraduccion.scrollTop = divTraduccion.scrollHeight;
                divTexto.scrollTop = divTraduccion.scrollHeight;
            }
            progreso.value = 100;
            spnProgreso.innerText = progreso.value + " %";
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
        divTraduccion.innerText = "";
        spnProgreso.innerText = "";
        progreso.value = 0;
        spnIdiomaActual.innerText = "";
        spnIdiomaTraducir.innerText = "";
        cargarLista("");
    }
}

async function validarIdiomas() {
    try {
        const translatorCapabilities = await Translator.availability({
            sourceLanguage: idiomaOrigen,
            targetLanguage: cboIdioma.value,
        });
        btnTraducir.disabled = false;
    }
    catch (error) {
        btnTraducir.disabled = true;
        alert("No esta disponible la traduccion a ese idioma seleccionado");
    }
}

function cargarLista(itemRemover) {
    var html = "";
    if (itemRemover!="es") html += "<option value='es'>Castellano</option>";
    if (itemRemover!="en") html += "<option value='en'>Ingles</option>";
    if (itemRemover!="fr") html += "<option value='fr'>Frances</option>";
    if (itemRemover!="ja") html += "<option value='ja'>Japones</option>";
    if (itemRemover!="pt") html += "<option value='pt'>Portugues</option>";
    cboIdioma.innerHTML = html;
}

function buscarValorLista(codIdioma) {
    var nombreIdioma = "";
    for (var i = 0; i < cboIdioma.options.length; i++) {
        if (cboIdioma.options[i].value == codIdioma) {
            nombreIdioma = cboIdioma.options[i].text;
            break;
        }
    }
    return nombreIdioma;
}