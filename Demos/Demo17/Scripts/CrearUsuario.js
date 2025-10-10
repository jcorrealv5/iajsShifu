window.onload = function () {
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
        if (txtReingresoClave.value == "") {
            alert("Reingresa la Clave");
            txtReingresoClave.focus();
            return;
        }
        if (txtClave.value != txtReingresoClave.value) {
            alert("La Clave Reingresada es Diferente");
            txtReingresoClave.focus();
            return;
        }
        var claveCifrada = cifradoXOR(txtClave.value, 10);
        txtClave.value = generarCaracteres(10);
        txtReingresoClave.value = generarCaracteres(10);
        var frm = new FormData();
        frm.append("Usuario", txtUsuario.value);
        frm.append("Clave", claveCifrada);
        var rptaHttp = await fetch(hdfRaiz.value + "Video/crearLogin",
            {
                method: "POST",
                body: frm
            });
        if (rptaHttp.ok) {
            var rptaTexto = await rptaHttp.text();
            alert(rptaTexto);
        }
    }
}