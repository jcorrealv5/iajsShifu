var c = 0;
var ctx = canvas.getContext("2d");
var enviar = false;

window.onload = function () {
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
        enviarFrame();
    }
    catch (error) {
        console.log('Error:', error);
    }
}

async function enviarFrame() {
    c++;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    var imgBase64 = canvas.toDataURL().replace("data:image/png;base64,","");
    var frm = new FormData();
    frm.append("Item", c);
    frm.append("Frame", imgBase64);
    var rptaHttp = await fetch(hdfRaiz.value + "Video/grabarFrame",
        {
            method: "POST",
            body: frm
        });
    if (rptaHttp.ok) {
        var rptaTexto = await rptaHttp.text();
        if (rptaTexto == "OK") {
            spnFrames.innerText = c;
            if (enviar) await enviarFrame();
        }
    }
}