var ctx = canvas.getContext("2d");
var anchoCanvas = canvas.width;
var altoCanvas = canvas.height;
var posX = 0;
var x = 0;
var imgFondo, imgSprite;
var idAnimacion = null;
var detener = true;

window.onload = function () {
    imgFondo  = new Image(anchoCanvas, altoCanvas);
    imgFondo.src = "http://localhost:60749/Images/Fondo.jpg";
    imgFondo.onload = function () {
        ctx.drawImage(imgFondo, 0, 0, anchoCanvas, altoCanvas);
    }
    imgSprite = new Image(624, 151);
    imgSprite.src = "http://localhost:60749/Images/CaminanteID.png";

    imgSprite.onload = function () {
        btnAnimar.style.display = "inline";        
    }

    btnAnimar.onclick = function () {
        if (btnAnimar.value == "Animar") {
            detener = false;
            idAnimacion = setInterval(animarCaminante, 50);
            btnAnimar.value = "Detener";
        }
        else {
            detener = true;
            clearInterval(idAnimacion);
            btnAnimar.value = "Animar";
        }
    }

    btnDescargar.onclick = function () {
        var enlace = document.createElement("a");
        enlace.download = "Caminante.png";
        enlace.href = canvas.toDataURL();
        enlace.click();
    }
}

function animarCaminante() {
    ctx.drawImage(imgFondo, 0, 0, anchoCanvas, altoCanvas);
    ctx.drawImage(imgSprite, x * 104, 0, 104, 151, posX, 450, 50, 50);
    if (posX < anchoCanvas) posX += 5;
    else posX = -100;
    x++;
    if (x == 6) x = 0;
    if (detener) clearInterval(idAnimacion);
    //requestAnimationFrame(animarCaminante);
}