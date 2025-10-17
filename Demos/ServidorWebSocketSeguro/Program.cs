using Fleck;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Security.Authentication;
using System.Security.Cryptography.X509Certificates;

namespace ServidorWebSocket
{
    class Program
    {
        static void Main(string[] args)
        {
            //string url = ConfigurationManager.AppSettings["IP"];
            //Console.WriteLine("Demo de Servidor Web Socket");
            //Console.WriteLine("__________________________________");
            //Console.WriteLine("Iniciando Servidor Web Socket en: " + url);
            //WebSocketServer servidor = new WebSocketServer(url);
            //List<IWebSocketConnection> clientes = new List<IWebSocketConnection>();
            //servidor.Start((cliente) =>
            //{
            //    cliente.OnOpen = () =>
            //    {
            //        clientes.Add(cliente);
            //        Console.WriteLine("Se conecto el cliente con IP: {0}", cliente.ConnectionInfo.ClientIpAddress);
            //    };
            //    cliente.OnClose = () =>
            //    {
            //        clientes.Remove(cliente);
            //        Console.WriteLine("Se desconecto el cliente con IP: {0}", cliente.ConnectionInfo.ClientIpAddress);
            //    };
            //    cliente.OnMessage = (string mensaje) =>
            //    {
            //        Console.WriteLine("Mensaje recibido: {0}", mensaje);
            //        foreach (IWebSocketConnection x in clientes) x.Send(mensaje);
            //    };
            //    cliente.OnBinary = (byte[] mensaje) =>
            //    {
            //        Console.WriteLine("Data recibida de tamaño: {0}", mensaje.Length);
            //        foreach (IWebSocketConnection x in clientes) x.Send(mensaje);
            //    };
            //});
            //Console.WriteLine("Pulsa Enter para finalizar");
            //Console.Read();


            // ServidorWebSocket.Program


            string text = ConfigurationManager.AppSettings["IP"];
            string KEY = "LDuenas.-159";
            Console.WriteLine("Demo de Servidor Web Socket");
            Console.WriteLine("__________________________________");
            Console.WriteLine("Iniciando Servidor Web Socket en: " + text);
            WebSocketServer servidor = new WebSocketServer(text, true);
            string fileName = "CertificadoWS.pfx";
            //string password = "daHBibQcc/7I/csupKhzt+dMlnDaimNZSdlMl2tCp/A=";
            servidor.Certificate = new X509Certificate2(fileName, KEY,X509KeyStorageFlags.UserKeySet);

            SslProtocols sslProtocols = SslProtocols.Tls12;
            SecurityProtocolType securityProtocolType = (SecurityProtocolType)sslProtocols;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3 | securityProtocolType;
            servidor.EnabledSslProtocols = SslProtocols.Default | SslProtocols.Tls11 | SslProtocols.Tls12;
            List<IWebSocketConnection> clientes = new List<IWebSocketConnection>();
            servidor.Start((Action<IWebSocketConnection>)delegate (IWebSocketConnection cliente)
            {
                cliente.OnOpen = delegate
                {
                    clientes.Add(cliente);
                    Console.WriteLine("Se conecto el cliente con IP: {0}", cliente.ConnectionInfo.ClientIpAddress);
                };
                cliente.OnClose = delegate
                {
                    clientes.Remove(cliente);
                    Console.WriteLine("Se desconecto el cliente con IP: {0}", cliente.ConnectionInfo.ClientIpAddress);
                };
                cliente.OnMessage = delegate (string mensaje)
                {
                    Console.WriteLine("Mensaje recibido: {0}", mensaje);
                    foreach (IWebSocketConnection item in clientes)
                    {
                        item.Send(mensaje);
                    }
                };
                cliente.OnBinary = delegate (byte[] mensaje)
                {
                    Console.WriteLine("Data recibida de tamaño: {0}", mensaje.Length);
                    foreach (IWebSocketConnection item2 in clientes)
                    {
                        item2.Send(mensaje);
                    }
                };
            });
            Console.WriteLine("Pulsa Enter para finalizar");
            Console.Read();
        }
    }
}
