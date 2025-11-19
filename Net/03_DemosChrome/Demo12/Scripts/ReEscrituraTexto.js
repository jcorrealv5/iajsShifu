var rewriter = null;

window.onload = function () {
    iniciarAPI();
    iniciarCombos();

    btnSeleccionar.onclick = function () {
        fupArchivo.click();
    }

    fupArchivo.onchange = function () {
        var file = this.files[0];
        txtArchivo.value = file.name;
        var reader = new FileReader();
        reader.onloadend = function (event) {
            var texto = reader.result;
            divTextoEntrada.innerText = texto;
        }
        reader.readAsText(file);
    }

    btnReEscribir.onclick = async function () {
        if (fupArchivo.value == "") {
            alert("Selecciona el archivo de entrada a re-escribir");
            return;
        }
        if (txtContexto.value == "") {
            alert("Ingresa el contexto para re-escribir");
            return;
        }
        rewriter = await Rewriter.create({
            sharedContext: txtContexto.value,
            expectedInputLanguages: ["en", "es"],
            expectedContextLanguages: ["en", "es"],
            outputLanguage: "es",
            tone: cboTono.value,
            format: cboFormato.value,
            length: cboTamanio.value
        });
        var resultado = await rewriter.rewrite(divTextoEntrada.innerText, {
            context: txtContexto.value
        });
        divTextoSalida.innerText = resultado;
    }

    btnNuevo.onclick = function () {
        txtArchivo.value = "";
        fupArchivo.value = "";
        divTextoEntrada.innerText = "";
        divTextoSalida.innerText = "";
    }
}

async function iniciarAPI() {
    if ('Rewriter' in self) {
        const disponibilidad = await Rewriter.availability();
        console.log("disponibilidad: ", disponibilidad);
        if (disponibilidad === 'unavailable') {
            alert("La API ReWriter No esta disponible por Falta de Requerimientos de Hardware");
            return;
        }
        if (disponibilidad === 'available') {
            rewriter = await Rewriter.create({format: 'plain-text'});
            btnReEscribir.disabled = false;
        } else {
            rewriter = await Rewriter.create({
                monitor(m) {
                    m.addEventListener("downloadprogress", e => {
                        console.log(`Downloaded ${e.loaded * 100}%`);
                    });
                }
            });
        }
    }
    else alert("La API ReWriter No esta soportada");
}

function iniciarCombos() {
    var listaTonos = ["as-is", "more-formal", "more-casual"];
    var listaFormatos = ["as-is", "markdown", "plain-text"];
    var listaTamanios = ["as-is", "shorter", "longer"];
    crearCombo(listaTonos, cboTono);
    crearCombo(listaFormatos, cboFormato);
    crearCombo(listaTamanios, cboTamanio);
}

function crearCombo(lista, cbo, primerItem) {
    primerItem = (primerItem == null ? "" : primerItem);
    var html = "";
    if (primerItem != "") {
        html += "<option value=''>";
        html += primerItem;
        html += "</option>";
    }
    var nRegistros = lista.length;
    var valor = [];
    for (var i = 0; i < nRegistros; i++) {
        valor = lista[i];
        html += "<option value='";
        html += valor;
        html += "'>";
        html += valor;
        html += "</option>";
    }
    cbo.innerHTML = html;
}