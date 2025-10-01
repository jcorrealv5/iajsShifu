window.onload = function () {
    var ctx = canvas.getContext("2d");
    var ancho = canvas.width;
    var alto = canvas.height;
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ancho, alto);
    var esDibujo = false;

    canvas.onclick = function () {
        esDibujo = !esDibujo;
    }

    canvas.onmousemove = function (event) {
        if (esDibujo) {
            var x = event.offsetX;
            var y = event.offsetY;
            const ancho = 4;
            ctx.fillStyle = "white";
            ctx.fillRect(x - ancho, y-ancho, ancho*2, ancho*2);
        }
    }

    btnLimpiar.onclick = function () {
        ctx.restore();
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ancho, alto);
    }
}