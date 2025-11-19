var translator;

function configurarTraduccion() {
    if (window.sessionStorage.getItem("IdiomaDestino") == null) {
        window.sessionStorage.setItem("IdiomaDestino", "");
    }
    btnCastellano.onclick = btnIngles.onclick = btnFrances.onclick = function () {
        window.sessionStorage.setItem("IdiomaDestino", this.getAttribute("data-idioma"));
        cambiarIdioma();
    }
    var idiomaDestino = window.sessionStorage.getItem("IdiomaDestino");
    if (idiomaDestino != "") {
        cambiarIdioma();
    }
}

async function cambiarIdioma() {
    var idiomaOrigen = window.sessionStorage.getItem("IdiomaOrigen");
    var idiomaDestino = window.sessionStorage.getItem("IdiomaDestino");
    if (idiomaDestino != "") {
        translator = await Translator.create({
            sourceLanguage: idiomaOrigen,
            targetLanguage: idiomaDestino,
        });
        await obtenerControles(divPrincipal);
    }
    else window.location.reload();
}

async function obtenerControles(padre) {
    var controles = padre.childNodes;
    var nControles = controles.length;
    var control;
    for (var i = 0; i < nControles; i++) {
        control = controles[i];
        if (control.tagName == "INPUT" && control.type=="button") {
            control.value = await translator.translate(control.value);
        }
        if (control.tagName == "A") {
            control.text = await translator.translate(control.text);
        }
        if (control.tagName == "H1" || "H2" || "H3") {
            if (control.childNodes.length == 1) control.childNodes[0].textContent = await translator.translate(control.childNodes[0].textContent);
            else obtenerControles(control);            
        }
        if (control.tagName == "DIV") {
            obtenerControles(control);
        }        
    }
}