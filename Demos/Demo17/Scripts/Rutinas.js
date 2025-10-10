function cifradoXOR(texto, pwd) {
    var rpta = "";
    var nTexto = texto.length;
    var n = 0;
    for (var i = 0; i < nTexto; i++) {
        n = texto.charCodeAt(i) ^ pwd;
        rpta += String.fromCharCode(n);
    }
    return rpta;
}

function generarCaracteres(nTexto) {
    var rpta = "";
    var n = 0;
    for (var i = 0; i < nTexto; i++) {
        n = 33 + Math.floor(Math.random() * 96);
        rpta += String.fromCharCode(n);
    }
    return rpta;
}