var c = 0;
var ctx = canvas.getContext("2d");
var enviar = false;
var ws = null;

window.onload = function () {
    var html = "<options>";
    html += "<option value='1'>Base64</option>";
    html += "<option value='2'>Blob PNG</option>";
    html += "<option value='3'>Blob JPEG</option>";
    html += "<option value='4'>Blob JPEG MC</option>";
    html += "</options>";
    cboTipoFormato.innerHTML = html;

    ws = new WebSocket(hdfIpWebSocket.value);
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
    console.log("Tipo de Formato: ", cboTipoFormato.value);
    if (cboTipoFormato.value == "1") {
        var imgBase64 = canvas.toDataURL().replace("data:image/png;base64,", "");
        var sizeBase64 = imgBase64.length;
        console.log("Imagen como Base64: ", sizeBase64);
        if (ws != null) ws.send(imgBase64);
    }
    else {
        var tipoImagen = "image/png";
        var calidadImagen = 0.92;
        if (cboTipoFormato.value != "2") {
            tipoImagen = "image/jpeg";
            if (cboTipoFormato.value == "4") calidadImagen = 0.5;
        }
        canvas.toBlob(function (blob) {
            var sizeBlob = blob.size;
            console.log("Imagen como Blob: ", sizeBlob);
            if (ws != null) ws.send(blob);
        }, tipoImagen, calidadImagen);
    }
}