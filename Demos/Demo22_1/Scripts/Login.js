window.onload = function () {
    crearCaptcha();

    spnActualizarCaptcha.onclick = function () { crearCaptcha(); }

    btnAceptar.onclick = async function () {
        if (txtUsuario.value == "") {
            alert("Ingresa el Usuario");
            txtUsuario.focus();
            return;
        }
        if (txtClave.value == "") {
            alert("Ingresa la Clave");
            txtClave.focus();
            return;
        }
        if (txtCodigo.value == "") {
            alert("Ingresa el Codigo del Captcha");
            txtCodigo.focus();
            return;
        }
        var claveCifrada = cifradoXOR(txtClave.value, 10);
        txtClave.value = generarCaracteres(10);
        var frm = new FormData();
        frm.append("Usuario", txtUsuario.value);
        frm.append("Clave", claveCifrada);
        frm.append("Codigo", txtCodigo.value);
        var rptaHttp = await fetch(hdfRaiz.value + "Video/validarLogin",
            {
                method: "POST",
                body: frm
            });
        if (rptaHttp.ok) {
            var rptaTexto = await rptaHttp.text();
            if (rptaTexto != "" && !rptaTexto.startsWith("Error")) {
                window.location.href = hdfRaiz.value + "Video/Inicio";
            }
            else alert(rptaTexto);
        }
    }
}

async function crearCaptcha() {
    var rptaHttp = await fetch(hdfRaiz.value + "Video/crearCaptcha",
        {
            method: "GET",
        });
    if (rptaHttp.ok) {
        var rptaBlob = await rptaHttp.blob();
        imgCaptcha.src = URL.createObjectURL(rptaBlob);
    }
}