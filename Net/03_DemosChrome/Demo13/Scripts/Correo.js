var rewriter = null;

window.onload = function () {    
    iniciarCombos();
    listarDestinatarios();

    btnDescargar.onclick = function () {
        iniciarAPI();
    }
    
    btnReEscribir.onclick = async function () {
        if (txtContexto.value == "") {
            alert("Ingresa el asunto o contexto para re-escribir");
            return;
        }
        if (txtContenido.value == "") {
            alert("Ingresa el contenido a re-escribir");
            return;
        }
        btnReEscribir.disabled = true;
        rewriter = await Rewriter.create({
            sharedContext: txtContexto.value,
            expectedInputLanguages: ["en", "es"],
            expectedContextLanguages: ["en", "es"],
            outputLanguage: "es",
            tone: cboTono.value,
            format: cboFormato.value,
            length: cboTamanio.value
        });
        var resultado = await rewriter.rewrite(txtContenido.value, {
            context: txtContexto.value
        });
        divMensaje.innerText = resultado;
        btnReEscribir.disabled = false;
    }

    btnNuevo.onclick = function () {
        txtContexto.value = "";
        txtAsunto.value = "";
        txtContenido.value = "";
        divMensaje.innerText = "";
        var checks = document.getElementsByClassName("check");
        var nChecks = checks.length;
        for (var i = 0; i < nChecks; i++) {
            checks[i].checked = false;
        }
    }

    btnEnviarCorreo.onclick = async function () {
        if (txtAsunto.value == "") {
            alert("Ingresa el asunto o contexto para re-escribir");
            return;
        }
        if (txtContenido.value == "") {
            alert("Ingresa el contenido a re-escribir");
            return;
        }
        if (divMensaje.innerText == "") {
            alert("No se ha Re-escrito el mensaje");
            return;
        }
        var ids = [];
        var checks = document.getElementsByClassName("check");
        var nChecks = checks.length;
        for (var i = 0; i < nChecks; i++) {
            if (checks[i].checked) {
                ids.push(checks[i].getAttribute("data-id"));
            }
        }
        if (ids.length == 0) {
            alert("Selecciona al menos un destinatario");
            return;
        }
        btnEnviarCorreo.disabled = true;
        var frm = new FormData();
        frm.append("Asunto", txtAsunto.value);
        var contenido = divMensaje.innerText.replace(/<br>/g, "\n");
        frm.append("Contenido", contenido);
        frm.append("Indices", ids.join("|"));
        var rptaHttp = await fetch(hdfRaiz.value + "Mensaje/enviarCorreos",
            {
                method: "POST",
                body: frm
            });
        if (rptaHttp.ok) {
            var rptaTexto = await rptaHttp.text();
            btnEnviarCorreo.disabled = false;
            alert(rptaTexto);
        }
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

async function listarDestinatarios() {
    var rptaHttp = await fetch(hdfRaiz.value + "Mensaje/listarDestinatarios", {method: "GET"});
    if (rptaHttp.ok) {
        var rptaTexto = await rptaHttp.text();
        var destinarios = rptaTexto.split("\r\n");
        var nRegistros = destinarios.length;
        var html = "";
        for (var i = 0; i < nRegistros; i++) {
            html += "<div>";
            html += "<input type='checkbox' class='check' data-id='";
            html += i;
            html += "'/>";
            html += "<span>";
            html += destinarios[i];
            html += "</span>";
            html += "</div>";
        }
        divDestinatarios.innerHTML = html;
    }
}