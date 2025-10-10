using System; //Console
using System.Threading.Tasks;
using System.Collections.Generic; //List
using System.Configuration; //ConfigurationManager
using Fleck; //WebSocketServer

namespace ServidorWebSocket
{
    class Program
    {
        static void Main(string[] args)
        {
            string ipWebSocket = ConfigurationManager.AppSettings["IpWebSocket"];
            WebSocketServer servidor = new WebSocketServer(ipWebSocket);
            List<IWebSocketConnection> clientes = new List<IWebSocketConnection>();
            servidor.Start((cliente) =>
            {
                cliente.OnOpen = () =>
                {
                    Console.WriteLine("Cliente Conectado: " + cliente.ConnectionInfo.ClientIpAddress);
                    clientes.Add(cliente);
                };
                cliente.OnClose = () =>
                {
                    Console.WriteLine("Cliente Desconectado: " + cliente.ConnectionInfo.ClientIpAddress);
                    clientes.Remove(cliente);
                };
                cliente.OnMessage = (string mensaje) =>
                {
                    Console.WriteLine("Size Mensaje de Texto Recibido: " + mensaje.Length.ToString());
                    foreach (IWebSocketConnection x in clientes)
                    {
                        x.Send(mensaje);
                    }                    
                };
                cliente.OnBinary = (byte[] mensaje) =>
                {
                    Console.WriteLine("Bytes Recibidos de Tamanio: " + mensaje.Length.ToString());
                    foreach (IWebSocketConnection x in clientes)
                    {
                        x.Send(mensaje);
                    }
                };
            });
            Console.WriteLine("Pulsa Cualquier Tecla para Finalizar el Servidor");
            Console.ReadKey();
        }
    }
}
