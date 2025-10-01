var ctx = canvas.getContext("2d");
var x = -250;

window.onload = function () {
    dibujarTexto();
    requestAnimationFrame(dibujarTexto);
}

function dibujarTexto() {
    var ancho = canvas.width;
    var alto = canvas.height;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ancho, alto);
    ctx.fillStyle = "white";
    ctx.font = "100px Arial";
    ctx.fillText("IAJS", x, 300);   
    if (x < ancho) x = x + 1;
    else x = -250;
    requestAnimationFrame(dibujarTexto);
}