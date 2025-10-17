var c = 0;
var ctx = canvas.getContext("2d");
var enviar = false;
var ws = null;

window.onload = function () {
    ws = new WebSocket(hdfIpWebSocket.value + "?user=" + hdfUsuario.value);
    ws.onopen = function (event) {
        spnEstado.innerText = "Conectado";
    }
    ws.onclose = function (event) {
        spnEstado.innerText = "Desconectado";
    }

    btnActivarCamara.onclick = function () {
        if (btnActivarCamara.value == "Activar Camara") {
            btnActivarCamara.value = "Detener Camara";
            activarCamara();
            enviar = true;
        }
        else {
            btnActivarCamara.value = "Activar Camara";
            video.pause();
            enviar = false;
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
    c++;
    spnFrames.innerText = c;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(function (blob) {
        var sizeBlob = blob.size;
        if (ws != null) ws.send(blob);
    }, "image/jpeg", 0.5);
}