var numFrames = 0;
var c = 0;
var ctx = canvas.getContext("2d");

window.onload = function () {
    btnIniciarReproduccion.onclick = async function () {
        c = 0;
        var rptaHttp = await fetch(hdfRaiz.value + "Video/contarFrames",
            {
                method: "GET"
            });
        if (rptaHttp.ok) {
            var rptaTexto = await rptaHttp.text();
            numFrames = +rptaTexto;
            if (numFrames > 0) obtenerFrame();
            else alert("NO existe Imagenes en el Video");
        }
    }
}

async function obtenerFrame() {
    c++;
    var rptaHttp = await fetch(hdfRaiz.value + "Video/obtenerFrame?item=" + c,
        {
            method: "GET"
        });
    if (rptaHttp.ok) {
        var rptaTexto = await rptaHttp.text();
        var img = new Image(600, 500);
        img.src = "data:image/png;base64," + rptaTexto;
        img.onload = async function () {  
            spnFrames.innerText = c + " de " + numFrames;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            if (c < numFrames) await obtenerFrame();
        }
    }
}