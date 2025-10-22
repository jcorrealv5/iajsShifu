window.onload = async function(){
	var rptaHttp = await fetch("ListarDistritos",
		{
			method: "GET"
		});
	if (rptaHttp.ok) {
		var rptaJSON = await rptaHttp.json();
		crearTablaJson(rptaJSON, "divDistritos");
	}
}

function crearTablaJson(json, nombreDiv) {
	var nombres = Object.keys(json);
	var nRegistros = nombres.length;
    var contenido = "<table><thead><tr style='background-color:blue;color:white'>";
    contenido += "<th style='width:40%'>Distrito</th>";
	contenido += "<th style='width:40%'>Ubigeo</th>";
    contenido += "</tr></thead><tbody>";
    for (var i = 0; i < nRegistros; i++) {
        contenido += "<tr style='background-color:white;color:blue'>";
        contenido += "<td>";
		contenido += nombres[i];
		contenido += "</td>";
		contenido += "<td>";
		contenido += json[nombres[i]];
		contenido += "</td>";
        contenido += "</tr>";
    }
    contenido += "</tbody></table>";
    var div = document.getElementById(nombreDiv);
    div.innerHTML = contenido;
}