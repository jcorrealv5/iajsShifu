using System;
using io = System.IO;
using System.Web.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace Demo13.Controllers
{
    public class MensajeController : Controller
    {
        public ActionResult Correo()
        {            
            return View();
        }

        public string listarDestinatarios() {
            string rpta = "";
            string archivoAlumnos = @"C:\Users\jhonf\Documents\Shifu\iajsShifu\IAJS03_Alumnos.txt";
            if (io.File.Exists(archivoAlumnos))
            {
                rpta = io.File.ReadAllText(archivoAlumnos);
            }
            return rpta;
        }

        public string enviarCorreos()
        {
            string rpta = "";
            string asunto = Request.Form["Asunto"];
            string contenido = Request.Form["Contenido"].Replace("\n","<br>");
            List<string> indices = Request.Form["Indices"].Split('|').ToList();
            string archivoCorreos = @"C:\Users\jhonf\Documents\Shifu\iajsShifu\IAJS03_Correos.txt";
            if (io.File.Exists(archivoCorreos))
            {
                string[] lineas = io.File.ReadAllLines(archivoCorreos);
                int nLineas = lineas.Length;
                List<string> correos = new List<string>();
                for(var i = 0; i < nLineas; i++)
                {
                    if (indices.IndexOf(i.ToString()) > -1)
                    {
                        correos.Add(lineas[i]);
                    }                    
                }
                rpta = enviarMail(correos.ToArray(), asunto, contenido, "html");
            }
            return rpta;
        }

        private string enviarMail(string[] correoPara, string titulo, string mensaje, string tipo)
        {
            string rpta = "";
            string archivoConfiguracion = @"C:\Users\jhonf\Documents\Shifu\iajsShifu\Correo_JAAC.txt";
            if (io.File.Exists(archivoConfiguracion))
            {
                string[] lineas = io.File.ReadAllLines(archivoConfiguracion);
                string correoServidor = lineas[0].Split('=')[1];
                string correoPuerto = lineas[1].Split('=')[1];
                string correoSSL = lineas[2].Split('=')[1];
                string correoDe = lineas[3].Split('=')[1];
                string correoMascara = lineas[4].Split('=')[1];
                string correoUsuario = lineas[5].Split('=')[1];
                string correoClave = lineas[6].Split('=')[1];
                string _SecurityProtocol = "Tls12";

                System.Net.Mail.MailMessage msg = new System.Net.Mail.MailMessage();
                foreach (string correo in correoPara)
                {
                    msg.To.Add(new System.Net.Mail.MailAddress(correo));
                }
                msg.Subject = titulo;
                msg.SubjectEncoding = System.Text.Encoding.UTF8;

                msg.Body = mensaje;
                msg.BodyEncoding = System.Text.Encoding.UTF8;
                if (tipo.Equals("html")) msg.IsBodyHtml = true;
                msg.From = new System.Net.Mail.MailAddress(correoDe, correoMascara);
                System.Net.Mail.SmtpClient cliente = new System.Net.Mail.SmtpClient();
                cliente.UseDefaultCredentials = false;
                cliente.Credentials = new System.Net.NetworkCredential(correoUsuario, correoClave);
                cliente.Port = int.Parse(correoPuerto);
                cliente.EnableSsl = bool.Parse(correoSSL);
                if (_SecurityProtocol.Equals("Tls12"))
                {
                    System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
                }
                else if (_SecurityProtocol.Equals("Tls11"))
                {
                    System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls11;
                }
                cliente.Host = correoServidor;
                try
                {
                    cliente.Send(msg);
                    rpta = "Correo enviado satisfactoriamente a: " + string.Join(", ", correoPara);
                }
                catch (Exception ex)
                {
                    rpta = "Error Correo: " + ex.Message;
                }
            }
            return rpta;
        }
    }
}