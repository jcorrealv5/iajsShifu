window.onload = function () {
    var ctx = canvas.getContext("2d");
    var ancho = canvas.width;
    var alto = canvas.height;
    var grosor = 4;
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ancho, alto);
    var esDibujo = false;
    var color = "white";

    txtGrosor.onchange = function () {
        grosor = +txtGrosor.value;
    }

    txtColor.onchange = function () {
        color = txtColor.value;
    }

    canvas.onclick = function () {
        esDibujo = !esDibujo;
    }

    canvas.onmousemove = function (event) {
        if (esDibujo) {
            var x = event.offsetX;
            var y = event.offsetY;
            ctx.fillStyle = color;
            ctx.fillRect(x - grosor, y - grosor, grosor * 2, grosor*2);
        }
    }

    btnLimpiar.onclick = function () {
        ctx.restore();
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ancho, alto);
    }
}