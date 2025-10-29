window.onload = async function(){
	var idRol = sessionStorage.getItem("idRol");
	var rptaHttp = await fetch("ListarMenus?IdRol=" + idRol,
        {
            method: "GET",
        });
    if (rptaHttp.ok) {
        var rptaTexto = await rptaHttp.text();
		if(rptaTexto!=""){
			var listaMenus = rptaTexto.split("¬");
			var html ="";
			var nRegistros = listaMenus.length;
			var campos = [];
			for(var i=0;i<nRegistros;i++){
				campos = listaMenus[i].split("|");
				html += "<h2>";
				html += "<a id='";
				html += campos[0];
				html += "' href='";
				html += campos[2];
				html += "'>";
				html += campos[1];
				html += "</a>";
				html += "</h2>";
			}
			divMenu.innerHTML = html;
		}
    }
	
	imgCara.onclick = function(){
		this.style.display="none";
	}
}

function crearTablaLista(lista, nombreDiv, indiceBoton) {
	var indiceBoton = (indiceBoton==null?-1:indiceBoton);
	var nRegistros = lista.length;
	var campos = lista[0].split("|");
	var nCampos = campos.length;
	var anchos = lista[1].split("|");
	var tipos = lista[2].split("|");
    var contenido = "<table>";
	contenido += "<thead>";
	contenido += "<tr style='background-color:blue;color:white'>";
	for(var j=0;j<nCampos;j++){
		contenido += "<th style='width:";
		contenido += anchos[j];
		contenido += "'>";
		contenido += campos[j];
		contenido += "</th>";
	}	
    contenido += "</tr>";
	contenido += "</thead>";
	contenido += "<tbody>";
    for (var i = 3; i < nRegistros; i++) {
		campos = lista[i].split("|");
        contenido += "<tr style='background-color:white;color:blue'>";
		for(var j=0;j<nCampos;j++){
			contenido += "<td>";
			if(indiceBoton>-1 && j==indiceBoton){
				contenido += "<input type='button' value='";
				contenido += campos[j];
				contenido += "' onclick='programarBoton(this);'/>";
			}
			else contenido += campos[j];
			contenido += "</td>";
		}        
        contenido += "</tr>";
    }
    contenido += "</tbody>";
	contenido += "</table>";
    var div = document.getElementById(nombreDiv);
    div.innerHTML = contenido;
}

function programarBoton(btn){
	var dni = btn.value;
	obtenerCara(dni);
}

async function obtenerCara(dni){
	var rptaHttp = await fetch("ObtenerCara?DocIdentidad=" + dni,
        {
            method: "GET",
        });
    if (rptaHttp.ok) {
        var blob = await rptaHttp.blob();
		imgCara.style.display="inline";
		imgCara.src = URL.createObjectURL(blob);
   }
}