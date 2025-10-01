using System.Web.Mvc; //File
using io=System.IO; //File

namespace Demo09.Controllers
{
    public class ConsultaController : Controller
    {
        // GET: Consulta
        public ActionResult Producto()
        {
            return View();
        }

        public string listarProductos()
        {
            string rpta = "";
            string archivo = Server.MapPath("~/Data/Productos.txt");
            if (io.File.Exists(archivo))
            {
                rpta = io.File.ReadAllText(archivo);
                rpta = rpta.Replace("\r\n", "~");
            }
            //System.Threading.Thread.Sleep(5000);
            return rpta;
        }
    }
}