using System; //Exception
using System.Web.Mvc; //ActionResult, File
using System.Configuration; //ConfigurationManager
using System.Threading.Tasks; //Task
using System.Collections.Generic; //List
using io=System.IO; //File
using System.Linq; //ToList()
using Demo20.Filtros; //FiltroAutenticacion
using Demo20.Rutinas; //Captcha, Seguridad

namespace Demo20.Controllers
{
    public class VideoController : Controller
    {

        public ActionResult CrearUsuario()
        {
            return View();
        }

        public async Task<string> crearLogin()
        {
            string rpta = "";
            try
            {
                string usuario = Request.Form["Usuario"];
                string claveXOR = Request.Form["Clave"];
                string claveDescifrada = Seguridad.CifradoXOR(claveXOR, 10);
                string claveAESHex = Seguridad.CifrarAESHex(claveDescifrada);
                string archivoUsuarios = Server.MapPath("~/Data/Usuarios.txt");
                List<string> lista = new List<string>();
                if (io.File.Exists(archivoUsuarios))
                {
                    await Task.Run(() => {
                        lista = io.File.ReadAllLines(archivoUsuarios).ToList();
                    });
                }
                bool encontro = false;
                foreach (string elemento in lista)
                {
                    if (elemento.StartsWith(usuario))
                    {
                        encontro = true;
                        break;
                    }
                }
                if (lista.Count > 0 && encontro) rpta = "El usuario Ya existe";
                else
                {
                    lista.Add(usuario + "=" + claveAESHex);
                    await Task.Run(() => {
                        io.File.WriteAllLines(archivoUsuarios, lista.ToArray());
                    });
                    rpta = "El usuario ha sido registrado con exito";
                }
            }
            catch (Exception ex)
            {
                rpta = "Error: " + ex.Message;
            }
            return rpta;
        }

        public ActionResult Login()
        {
            return View();
        }

        public FileResult crearCaptcha()
        {
            Dictionary<string, byte[]> captcha = Captcha.CrearCaptcha(200, 80, "aqua");
            string codigoGenerado = captcha.Keys.ToList()[0];
            Session["CodigoGenerado"] = codigoGenerado;
            byte[] buffer = captcha[codigoGenerado];
            return File(buffer, "image/png");
        }

        public async Task<string> validarLogin()
        {
            string rpta = "";
            try
            {
                string usuario = Request.Form["Usuario"];
                string claveXOR = Request.Form["Clave"];
                string codigoIngresado = Request.Form["Codigo"];
                string codigoGenerado = Session["CodigoGenerado"].ToString();
                if (codigoGenerado.Equals(codigoIngresado))
                {
                    string claveDescifrada = Seguridad.CifradoXOR(claveXOR, 10);
                    string claveAESHex = Seguridad.CifrarAESHex(claveDescifrada);
                    string archivoUsuarios = Server.MapPath("~/Data/Usuarios.txt");
                    List<string> lista = new List<string>();
                    if (io.File.Exists(archivoUsuarios))
                    {
                        await Task.Run(() => {
                            lista = io.File.ReadAllLines(archivoUsuarios).ToList();
                        });
                    }
                    bool encontro = false;
                    foreach (string elemento in lista)
                    {
                        if (elemento.StartsWith(usuario))
                        {
                            encontro = true;
                            string claveAESHexReal = elemento.Split('=')[1];
                            if (claveAESHex.Equals(claveAESHexReal))
                            {
                                Session["Usuario"] = usuario;
                                rpta = "Login Correcto";
                            }
                            else rpta = "Error: El usuario existe pero la Clave es incorrecta";
                            break;
                        }
                    }
                    if (!encontro) rpta = "Error: El usuario No existe";
                }
                else rpta = "Error: Codigo del Captcha es Incorrecto";
            }
            catch (Exception ex)
            {
                rpta = "Error: " + ex.Message;
            }
            return rpta;
        }

        [FiltroAutenticacion]
        public ActionResult Inicio()
        {
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Captura()
        {
            ViewBag.Usuario = Session["Usuario"];
            ViewBag.IpWebSocket = ConfigurationManager.AppSettings["IpWebSocket"];
            return View();
        }

        [FiltroAutenticacion]
        public ActionResult Reproduccion()
        {
            ViewBag.Usuario = Session["Usuario"];
            ViewBag.IpWebSocket = ConfigurationManager.AppSettings["IpWebSocket"];
            return View();
        }
    }
}