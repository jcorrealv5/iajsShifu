window.onload = async function () {
    if ('Translator' in self) {  
        cboIdioma.disabled = false;
        validarIdiomas();
    }
    else alert("No se encuentra disponible la API Translator");

    cboIdioma.onchange = function () {
        validarIdiomas();
    }

    btnTraducir.onclick = async function () {
        if (txtTexto.value != "") {
            var translator = await Translator.create({
                sourceLanguage: 'es',
                targetLanguage: cboIdioma.value,
            });
            divTraduccion.innerText = await translator.translate(txtTexto.value);            
        }
        else {
            alert("Ingresa el Texto en Castellano");
            txtTexto.focus();
        }
    }

    btnNuevo.onclick = function () {
        txtTexto.value = "";
        divTraduccion.innerText = "";
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