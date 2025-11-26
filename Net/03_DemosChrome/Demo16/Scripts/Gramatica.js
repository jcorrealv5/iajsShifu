var sesion = null;

window.onload = function () {
    btnSeleccionar.onclick = function () {
        fupTexto.click();
    }

    fupTexto.onchange = function () {
        var file = this.files[0];
        txtArchivo.value = file.name;
        var reader = new FileReader();
        reader.onloadend = function (event) {
            divTextoOriginal.innerText = reader.result;
        }
        reader.readAsText(file, "ISO-8859-15");
    }

    btnDescargar.onclick = async function () { 
        this.disabled = true;
        if ("Proofreader" in self) {
            var disponibilidad = await Proofreader.availability();
            console.log("disponibilidad", disponibilidad )
            if (disponibilidad == "downloadable") {
                var options = {
                    expectedInputLanguages: ['en'],
                };
                sesion = await Proofreader.create({
                    monitor(m) {
                        m.addEventListener('downloadprogress', (e) => {
                            console.log(`Downloaded ${e.loaded * 100}%`);
                        });
                    },
                    ...options,
                });
            }
            else {
                if (disponibilidad == "unavailable") alert("NO esta disponible la API Proofreader");
                else {
                    sesion = await Proofreader.create({ expectedInputLanguages: ['en']});
                    btnCorregir.disabled = false;
                }
            }
        }
        else alert("NO esta soportada la API Proofreader");
        this.disabled = false;
    }

    btnCorregir.onclick = async function () {
        this.disabled = true;
        var textoOriginal = divTextoOriginal.innerText;
        var resultado = await sesion.proofread(textoOriginal);
        var textoCorregido = textoOriginal;
        for (var correccion of resultado.corrections) {
            if (correccion.startIndex > 0) {
                posFin = textoOriginal.indexOf(" ", correccion.startIndex);
                palabraMala = textoOriginal.substring(correccion.startIndex, posFin);
                palabraBuena = correccion.correction;
                textoCorregido = textoCorregido.replace(palabraMala, palabraBuena);
            }
        }
        divTextoCorregido.innerText = textoCorregido;
        this.disabled = false;
    }

    btnNuevo.onclick = function () {
        txtArchivo.value = "";
        fupTexto.value = "";
        divTextoOriginal.innerText = "";
        divTextoCorregido.innerText = "";
    }
}