window.onload = async function () {
    if ('Translator' in self) {
        try {
            const translatorCapabilities = await Translator.availability({
                sourceLanguage: 'es',
                targetLanguage: 'en',
            });
            btnTraducir.disabled = false;
        }
        catch (ex) {
            alert("No se puede traducir de Castellano a Ingles");
        }
    }
    else alert("No se encuentra disponible la API Translator");

    btnTraducir.onclick = async function () {
        if (txtTexto.value != "") {
            var translator = await Translator.create({
                sourceLanguage: 'es',
                targetLanguage: 'en',
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