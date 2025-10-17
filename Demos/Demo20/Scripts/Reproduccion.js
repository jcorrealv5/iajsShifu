var numFrames = 0;
var c = 0;
var ctx = canvas.getContext("2d");
var ws = null;

window.onload = function () {
    c = 0;
    ws = new WebSocket(hdfIpWebSocket.value + "?user=" + hdfUsuario.value);
    ws.onopen = function (event) {
        spnEstado.innerText = "Conectado";
    }
    ws.onclose = function (event) {
        spnEstado.innerText = "Desconectado";
    }
    ws.onmessage = async function (event) {
        var data = event.data;        
        if (data.size > 0) {
            var byte1 = data.slice(0, 1);
            var buffer1 = await byte1.arrayBuffer();
            var int1 = new Uint8Array(buffer1);
            var n = int1[0];
            var byteCad = data.slice(1, 1 + n);
            var bufferCad = await byteCad.arrayBuffer();
            var intCad = new Uint8Array(bufferCad);
            var usuario = "";
            for (var i = 0; i < intCad.length; i++) {
                usuario += String.fromCharCode(intCad[i]);
            }
            if (usuario == hdfUsuario.value) {
                var blob = data.slice(1 + n, data.size);
                c++;
                spnFrames.innerText = c;
                var img = new Image(600, 500);
                img.src = URL.createObjectURL(blob);
                img.onload = async function () {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                }
            }
        }
    }
}