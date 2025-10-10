using System; //Exception
using System.Web.Mvc; //Controller, ActionResult
using io=System.IO; //File
using System.Collections.Generic; //List, Dictionary
using System.Linq; //Extension: ToList(), ToArray()
using System.Threading.Tasks; //Task
using Demo17.Rutinas; //Seguridad
using Demo17.Filtros; //FiltroAutenticacion
using System.IO; //Path

namespace Demo17.Controllers
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
            catch(Exception ex)
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
            return View();
        }

        public string grabarFrame()
        {
            string rpta = "";
            string usuario = Session["Usuario"].ToString();
            string item = Request.Form["Item"];
            string imgBase64 = Request.Form["Frame"];
            string rutaVideo = Server.MapPath("~/Videos/" + usuario);
            if (!io.Directory.Exists(rutaVideo)) io.Directory.CreateDirectory(rutaVideo);
            string archivoImagen = Path.Combine(rutaVideo, item + ".png");
            byte[] buffer = Convert.FromBase64String(imgBase64);
            io.File.WriteAllBytes(archivoImagen, buffer);
            rpta = "OK";
            return rpta;
        }

        [FiltroAutenticacion]
        public ActionResult Reproduccion()
        {
            return View();
        }

        public string contarFrames()
        {
            string rpta = "";
            string usuario = Session["Usuario"].ToString();
            string rutaVideo = Server.MapPath("~/Videos/" + usuario);
            if (io.Directory.Exists(rutaVideo))
            {
                string[] archivos = io.Directory.GetFiles(rutaVideo, "*.png");
                rpta = archivos.Length.ToString();
            }         
            return rpta;
        }

        public string obtenerFrame(string item)
        {
            string rpta = "";
            string usuario = Session["Usuario"].ToString();
            string rutaVideo = Server.MapPath("~/Videos/" + usuario);
            if (io.Directory.Exists(rutaVideo))
            {
                string archivoImagen = Path.Combine(rutaVideo, item + ".png");
                byte[] buffer = io.File.ReadAllBytes(archivoImagen);
                rpta = Convert.ToBase64String(buffer);
            }
            return rpta;
        }
    }
}