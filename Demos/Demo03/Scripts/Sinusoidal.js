var ctx = canvas.getContext("2d");
var ancho = canvas.width;
var alto = canvas.height;
var centerY = alto / 2;
var amplitude = 200;
var frequency = 0.03;
var phase = 0;

window.onload = function () {    
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ancho, alto);
    dibujarOnda("white", Math.sin);
    dibujarOnda("yellow", Math.cos);
    leyendaOnda("white", 100, "Seno");
    leyendaOnda("yellow", 500, "Coseno");
}

function dibujarOnda(color, funcion) {
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = color;
    ctx.moveTo(0, centerY + amplitude * funcion(frequency * 0 + phase));
    for (var x = 0; x < ancho; x++) {
        y = centerY + amplitude * funcion(frequency * x + phase);
        ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.closePath();
}

function leyendaOnda(color, x, texto) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(x, 50);
    ctx.lineTo(x+100, 50);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = "40px Arial";
    ctx.fillText(texto, x+110, 50);
    ctx.closePath();
}