var writer = null;

window.onload = function () {
    iniciarAPI();

    btnEscribir.onclick = async function () {
        if (txtSolicitud.value == "") {
            alert("Ingresa la Solicitud o Prompt");
            txtSolicitud.focus();
            return;
        }
        if (txtContexto.value == "") {
            alert("Ingresa el Contexto de la Solicitud");
            txtContexto.focus();
            return;
        }
        btnEscribir.disabled = true;
        writer = await Writer.create({
            tone: "formal",
            expectedInputLanguages: ["es"],
            expectedContextLanguages: ["es"],
            outputLanguage: "es",
            sharedContext: txtContexto.value
        });
        var resultado = await writer.write(txtSolicitud.value, { context: txtContexto.value });
        divTextoGenerado.innerText = resultado;
        btnEscribir.disabled = false;
        btnMejorar.disabled = false;
    }

    btnMejorar.onclick = async function () {
        btnEscribir.disabled = true;
        btnMejorar.disabled = true;
        var revision = await Promise.all(
            Array.from(
                document.querySelectorAll("#divTextoGenerado"),
                (reviewEl) => writer.write(reviewEl.textContent)
            ),
        );
        divTextoGenerado.innerText = revision;
        btnEscribir.disabled = false;
        btnMejorar.disabled = false;
    }
}

async function iniciarAPI() {
    const options = {
        sharedContext: 'This is an email to acquaintances about an upcoming event.',
        tone: 'casual',
        format: 'plain-text',
        length: 'medium',
    };
    const available = await Writer.availability();
    if (available === 'unavailable') {
        alert("La API Writer No esta disponible por Falta de Requerimientos de Hardware");
        return;
    }
    if (available === 'available') {
        writer = await Writer.create(options);
        btnEscribir.disabled = false;
    } else {
        writer = await Writer.create({
            ...options,
            monitor(m) {
                m.addEventListener("downloadprogress", e => {
                    console.log(`Downloaded ${e.loaded * 100}%`);
                });
            }
        });
    }
}