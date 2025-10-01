window.onload = function(){
	var ancho = canvas.width;
	var alto = canvas.height;
	var ctx = canvas.getContext("2d");
	//Dibujar un Fondo Negro en todo el Canvas
	ctx.fillStyle = "black"
	ctx.fillRect(0,0,ancho,alto);
	//Dibujar un Texto Blanco
	ctx.fillStyle = "white"
	ctx.font = "50px Arial"
	ctx.fillText("Curso de IA con JS", 300,50);
	//Dibujar una Linea Amarilla debajo del Texto
	ctx.strokeStyle = "yellow";
	ctx.lineWidth = 5;
	ctx.moveTo(300,60);
	ctx.lineTo(730,60);
	ctx.stroke();
	//Dibujar un Rectangulo con borde amarillo y fondo Verde	
	ctx.fillStyle = "green"
	ctx.strokeStyle = "yellow";
	ctx.lineWidth = 5;
	ctx.rect(50,150,250,200);
	ctx.fillRect(50,150,250,200);
	ctx.stroke();
	//Dibujar un Circulo con fondo rojo
	ctx.beginPath();
	ctx.fillStyle = "red"
	ctx.ellipse(500,250,100,100,0,0,2 * Math.PI);
	ctx.fill();
	ctx.closePath();
	//Dibujar un Triangulo con fondo azul y borde rojo
	ctx.beginPath();
	ctx.fillStyle = "blue";
	ctx.strokeStyle = "red";
	ctx.lineWidth = 5;
	ctx.moveTo(700,350);
	ctx.lineTo(800,150);
	ctx.lineTo(900,350);
	ctx.lineTo(700,350);
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
	
	btnDescargar.onclick = function(){
		var enlace = document.createElement("a");
		enlace.href = canvas.toDataURL();
		enlace.download = "Dibujo.png";
		enlace.click();
	}
}