var numFrames = 0;
var c = 0;
var ctx = canvas.getContext("2d");
var ws = null;

window.onload = function () {
    c = 0;
    ws = new WebSocket(hdfIpWebSocket.value);
    ws.onopen = function (event) {
        spnEstado.innerText = "Conectado";
    }
    ws.onclose = function (event) {
        spnEstado.innerText = "Desconectado";
    }
    ws.onmessage = function (event) {
        var data = event.data;
        c++;
        spnFrames.innerText = c;
        var img = new Image(600, 500);
        if (typeof (data) === "string") {
            spnTipoFormato.innerText = "Base 64";
            spnSizeImagen.innerText = data.length;
            if (data!="") {                
                img.src = "data:image/jpeg;base64," + data;
            }
        }
        else {
            if (data.size > 0) {
                spnTipoFormato.innerText = "Blob";
                spnSizeImagen.innerText = data.size;
                //var blob = new Blob([data], { "type": "image/jpeg" });
                img.src = URL.createObjectURL(data);
            }
        }
        img.onload = async function () {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
    }
}