using System; //Console
using System.Text;
using System.Collections.Generic; //List
using System.Configuration; //ConfigurationManager
using Fleck; //WebSocketServer

namespace ServidorWSP
{
    class Program
    {
        static List<ClienteWS> clientesWS;
        static void Main(string[] args)
        {
            string ipWebSocket = ConfigurationManager.AppSettings["IpWebSocket"];
            WebSocketServer servidor = new WebSocketServer(ipWebSocket);
            clientesWS = new List<ClienteWS>();            
            servidor.Start((cliente) =>
            {
                string usuario = "";
                cliente.OnOpen = () =>
                {
                    string urlPars = cliente.ConnectionInfo.Path;
                    string pars = urlPars.Substring(2, urlPars.Length - 2);
                    string[] campos = pars.Split('=');
                    usuario = campos[1];
                    Console.WriteLine("Cliente Conectado: " + cliente.ConnectionInfo.ClientIpAddress);
                    Console.WriteLine("Usuario: {0}", usuario);
                    clientesWS.Add(new ClienteWS { Conexion= cliente, Usuario= usuario });
                };
                cliente.OnClose = () =>
                {
                    Console.WriteLine("Cliente Desconectado: " + cliente.ConnectionInfo.ClientIpAddress);
                    clientesWS.Remove(buscarClienteWS(usuario));
                };
                cliente.OnMessage = (string mensaje) =>
                {
                    Console.WriteLine("Size Mensaje de Texto Recibido: " + mensaje.Length.ToString());
                    foreach (ClienteWS x in clientesWS)
                    {
                        x.Conexion.Send(usuario + "|" + mensaje);
                    }
                };
                cliente.OnBinary = (byte[] mensaje) =>
                {
                    List<byte> rpta = new List<byte>();
                    rpta.Add((byte)usuario.Length);
                    rpta.AddRange(Encoding.UTF8.GetBytes(usuario));
                    rpta.AddRange(mensaje);
                    Console.WriteLine("Bytes Recibidos de Tamanio: " + mensaje.Length.ToString());
                    foreach (ClienteWS x in clientesWS)
                    {
                        x.Conexion.Send(rpta.ToArray());
                    }
                };
            });
            Console.WriteLine("Pulsa Cualquier Tecla para Finalizar el Servidor");
            Console.ReadKey();
        }

        static ClienteWS buscarClienteWS(string usuario)
        {
            ClienteWS rpta = null;
            foreach (ClienteWS clienteWS in clientesWS)
            {
                if (clienteWS.Usuario.Equals(usuario))
                {
                    rpta = clienteWS;
                    break;
                }
            }
            return rpta;
        }
    }
}
