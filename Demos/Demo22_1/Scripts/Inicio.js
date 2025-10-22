var ctx = canvas.getContext("2d");
var ws = null;

window.onload = function () {
    activarCamara();

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
            var blob = data.slice(1 + n, data.size);
            var id = "div" + usuario;
            if (document.getElementById(id) == null) {
                var html = "<div class='MarcoVideo' id='div";
                html += usuario;
                html += "'>";
                html += "<img id='img";
                html += usuario;
                html += "' src = '";
                html += URL.createObjectURL(blob);
                html += "' class='MarcoImagen2'/>";
                html += "<br/>";
                html += "<span class='Titulo'>";
                html += usuario;
                html += "</span>";
                html += "</div>";
                divPanel.insertAdjacentHTML("afterbegin", html);
            }
            else {
                document.getElementById("img" + usuario).src = URL.createObjectURL(blob);
            }
        }
    }
}

async function activarCamara(){
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;
        video.play();
        setInterval(enviarFrame, 100);
    }
    catch (error) {
        console.log('Error:', error);
    }
}

function enviarFrame() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(function (blob) {
        var sizeBlob = blob.size;
        if (ws != null) ws.send(blob);
    }, "image/jpeg", 0.5);
}