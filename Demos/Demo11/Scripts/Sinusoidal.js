var ctx = canvas.getContext("2d");
var ancho = canvas.width;
var alto = canvas.height;
var centerY = alto / 2;
var amplitude = 200;
var frequency = 0.03;
var phase = 0;
var posX = 0;

window.onload = function () {    
    animar();
}

function animar() {
    dibujarFondo();
    dibujarOnda();
    dibujarCirculo();
    requestAnimationFrame(animar);
}

function dibujarFondo() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ancho, alto);
}

function dibujarOnda() {
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    ctx.moveTo(0, centerY + amplitude * Math.sin(frequency * 0 + phase));
    var y = 0;
    for (var x = 0; x < ancho; x++) {
        y = centerY + amplitude * Math.sin(frequency * x + phase);
        ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.closePath();
}

function dibujarCirculo() {
    ctx.beginPath();
    ctx.fillStyle = "red";
    var y = centerY + amplitude * Math.sin(frequency * posX + phase);
    ctx.ellipse(posX, y, 10, 10, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    if (posX < ancho) posX++;
    else posX = 0;
}