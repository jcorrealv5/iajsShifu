var faceDetection;
var ctx, ancho, alto, ctxCara;
var hayCara = false;

window.onload = function(){
	ctx = canvas.getContext("2d");
	ctxCara = canvasCara.getContext("2d");
	anchoCanvas = canvas.width;
	altoCanvas = canvas.height;
	iniciarDeteccion();
	
	btnActivarCamara.onclick = function(){
		iniciarCamara();
	}

	btnTomarFoto.onclick = function(){
		if(hayCara) {
			imgCara.src = canvasCara.toDataURL();
		}
		else alert("No hay cara para la toma");
	}
}

function iniciarDeteccion(){
	faceDetection = new FaceDetection({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4.1646425229/${file}`;
        }
    });
    faceDetection.setOptions({
        modelSelection: 0,
        model: "short",
        minDetectionConfidence: 0.5
    });
    faceDetection.onResults(mostrarImagen);
}

function iniciarCamara(){
	var camara = new Camera(video, {
		onFrame: async () => {
			await faceDetection.send({ image: video });
		},
		width: 800,
		height: 700
    });
    camara.start();
}

function mostrarImagen(rpta){
	var imagen = rpta.image;
	var resultados = rpta.detections;
	//ctx.save();
	ctx.drawImage(imagen, 0, 0, anchoCanvas, altoCanvas);	
	if(resultados.length>0){
		hayCara = true;
		var resultado = resultados[0];
		var cuadro = resultado.boundingBox;
		var marcas = resultado.landmarks;
		var nMarcas = marcas.length;
		ctx.lineWidth = 3;
		ctx.strokeStyle = "green";
		var ancho = cuadro.width * anchoCanvas;
        var alto = cuadro.height * altoCanvas;
		var x = Math.floor((cuadro.xCenter - (cuadro.width/2)) * anchoCanvas);
		var y = Math.floor((cuadro.yCenter - (cuadro.height/2)) * altoCanvas);
		ctxCara.drawImage(canvas,x,y,ancho,alto,0,0,canvasCara.width,canvasCara.height);
		ctx.strokeRect(x,y,ancho,alto);
		var posX, posY;		
		for(var i=0;i<nMarcas;i++){
			posX = marcas[i].x * anchoCanvas;
			posY = marcas[i].y * altoCanvas;
			if(i==0 || i==1) ctx.fillStyle = "green";
			else if(i==2) ctx.fillStyle = "red";
			else if(i==3) ctx.fillStyle = "blue";
			else ctx.fillStyle = "yellow";
			ctx.beginPath();
			ctx.arc(posX, posY, 10, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
		}
	}
	else hayCara = false;
}