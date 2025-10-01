var listaProducto = [];
var maxStock = 0;
var ancho = canvas.width;
var alto = canvas.width;
var ctx = canvas.getContext("2d");
var nRegistros = 0;

window.onload = async function () {
	var rptaHttp = await fetch(hdfRaiz.value + "Consulta/listarProductos",{method:"GET"});
	if (rptaHttp.ok) {
		var rptaTexto = await rptaHttp.text();
		listaProducto = rptaTexto.split("~");
		nRegistros = listaProducto.length;
		//maxStock = listaProducto.reduce(function (max, fila) { return max >= +fila.split("|")[1] ? max : +fila.split("|")[1]; }, 0);
		var campos = [];
		for (var i = 0; i < nRegistros; i++) {
			campos = listaProducto[i].split("|");
			if (+campos[1] > maxStock) maxStock = +campos[1];
        }
		console.log(maxStock);
		divProducto.innerHTML = crearTabla();
		crearGrafico();
	}

	btnDescargar.onclick = function () {
		var enlace = document.createElement("a");
		enlace.href = canvas.toDataURL();
		enlace.download = "Grafico.png";
		enlace.click();
    }
}

function crearTabla() {
	var html = "<table style='width:100%'>";	
	var campos = [];
	for (var i = 0; i < nRegistros; i++) {
		html += "<tr style='background-Color:";
		if (i == 0) html += "gray";
		else html += "white";
		html += "'>";
		if (listaProducto[i] != "") {
			campos = listaProducto[i].split("|");
			html += "<td>";
			html += campos[0];
			html += "</td>";
			html += "<td>";
			html += campos[1];
			html += "</td>";
		}
		html += "</tr>";
    }
	return html;
}

function crearGrafico() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, ancho, alto);
	ctx.font = "30px Arial";
	ctx.fillStyle = "white";
	ctx.fillText("Grafico de Stocks de Productos x Categoria", 200, 30);
	var nombreProducto = "";
	var stock = 0;
	var campos = [];
	var y = 60;
	var escalaH = 900 / maxStock;
	var valor = 0;
	for (var i = 1; i < nRegistros; i++) {
		if (listaProducto[i] != "") {
			campos = listaProducto[i].split("|");
			nombreProducto = campos[0];
			stock = +campos[1];
			valor = Math.floor(escalaH * stock);
			ctx.font = "15px Arial";
			ctx.fillStyle = "yellow";
			ctx.fillText(nombreProducto, 20, y);
			ctx.fillStyle = "aqua";
			ctx.fillRect(20, y + 10, valor, 20);
			ctx.fillStyle = "white";
			ctx.fillText(campos[1], valor + 30, y + 25);
			y += 60;
		}
	}
}