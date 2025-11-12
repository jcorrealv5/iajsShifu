window.onload = async function () {
    if ('Translator' in self) {  
        cboIdioma.disabled = false;
        validarIdiomas();
    }
    else alert("No se encuentra disponible la API Translator");

    btnSeleccionar.onclick = function () {
        fupArchivo.click();
    }

    fupArchivo.onchange = function (event) {
        var file = this.files[0];
        txtArchivo.value = file.name;
        var reader = new FileReader();
        reader.onloadend = function (event) {
            divTexto.innerText = reader.result;
        }
        reader.readAsText(file);
    }

    cboIdioma.onchange = function () {
        validarIdiomas();
    }

    btnTraducir.onclick = async function () {
        if (divTexto.innerText != "") {
            var translator = await Translator.create({
                sourceLanguage: 'es',
                targetLanguage: cboIdioma.value,
            });
            var lineas = divTexto.innerText.split("\n");
            var nLineas = lineas.length;
            var bloque = Math.floor(nLineas / 100);
            var c = 0;
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
            }
        }
        else {
            alert("Ingresa el Texto en Castellano");
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
    }
}

async function validarIdiomas() {
    try {
        const translatorCapabilities = await Translator.availability({
            sourceLanguage: 'es',
            targetLanguage: cboIdioma.value,
        });
        btnTraducir.disabled = false;
    }
    catch (error) {
        btnTraducir.disabled = true;
        alert("No esta disponible la traduccion a ese idioma seleccionado");
    }
}