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
        if (data != "") {
            c++;
            spnFrames.innerText = c;
            var img = new Image(600, 500);
            img.src = "data:image/png;base64," + data;
            img.onload = async function () {
                spnFrames.innerText = c + " de " + numFrames;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
        }
    }
}