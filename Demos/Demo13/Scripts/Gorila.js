var ctx = canvas.getContext("2d");
var anchoCanvas = canvas.width;
var altoCanvas = canvas.height;
var imagenSprite = null;
var anchoImagen = 0;
var altoImagen = 0;
var idAnimacion = null;
var detener = true;
var x = 0;
var y = 0;
var posX = 0;

window.onload = function () {
    anchoImagen = +hdfAnchoSprite.value / +hdfColsSprite.value;
    altoImagen = +hdfAltoSprite.value / +hdfFilasSprite.value;
    imagenSprite = new Image(hdfAnchoSprite.value, hdfAltoSprite);
    imagenSprite.src = "http://localhost:63373/Imagenes/Gorila.jpg";
    imagenSprite.onload = function () {
        btnAnimar.style.display = "inline";        
    }

    btnAnimar.onclick = function () {
        if (this.value == "Animar") {
            idAnimacion = setInterval(animarSprite, 50);
            this.value = "Detener";
            detener = false;
        }
        else {
            clearInterval(idAnimacion);
            this.value = "Animar";
            detener = true;
        }
    }
}

function animarSprite() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, anchoCanvas, altoCanvas);
    ctx.drawImage(imagenSprite, x * anchoImagen, y * altoImagen, anchoImagen, altoImagen, posX, 300, 100, 100);
    if (posX < anchoCanvas) posX += 5;
    else posX = -anchoImagen;
    x++;
    if (x == +hdfColsSprite.value) {
        x = 0;
        y++;
        if (y == +hdfFilasSprite.value) {            
            y = 0;
        }
    }
    if (detener) clearInterval(idAnimacion);
}