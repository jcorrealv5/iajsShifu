var ctx = canvas.getContext("2d");
var x = -200;
var idAnimacion = null;
var detener = false;
var ancho = canvas.width;
var alto = canvas.height;

window.onload = function () {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ancho, alto);

    btnAnimar.onclick = function () {
        if (this.value == "Animar") {
            idAnimacion = requestAnimationFrame(dibujarTexto);
            this.value = "Detener";
            detener = false;
        }
        else {
            cancelAnimationFrame(idAnimacion);
            this.value = "Animar"
            detener = true;
        }
    }
}

function dibujarTexto() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ancho, alto);
    ctx.fillStyle = dlgColor.value;
    ctx.font = txtSize.value + "px Arial";
    ctx.fillText(txtTexto.value, x, 300);
    if (x < ancho) x = x + (+rngAvance.value);
    else x = -(txtTexto.value.length * +txtSize.value);
    idAnimacion = requestAnimationFrame(dibujarTexto);
    if (detener) cancelAnimationFrame(idAnimacion);
}