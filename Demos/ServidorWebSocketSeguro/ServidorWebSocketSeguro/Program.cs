using Fleck;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Security.Authentication;
using System.Security.Cryptography.X509Certificates;

namespace ServidorWebSocketSeguro
{
	class Program
	{
		static void Main(string[] args)
		{
			string text = ConfigurationManager.AppSettings["IP"];
			Console.WriteLine("Demo de Servidor Web Socket");
			Console.WriteLine("__________________________________");
			Console.WriteLine("Iniciando Servidor Web Socket en: " + text);
			WebSocketServer webSocketServer = new WebSocketServer(text);
			string fileName = "Certificado.pfx";
			string password = "Password.-1000";
			webSocketServer.Certificate = new X509Certificate2(fileName, password);
			SslProtocols sslProtocols = SslProtocols.Tls12;
			SecurityProtocolType securityProtocolType = (SecurityProtocolType)sslProtocols;
			ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3 | securityProtocolType;
			webSocketServer.EnabledSslProtocols = SslProtocols.Default | SslProtocols.Tls11 | SslProtocols.Tls12;
			List<IWebSocketConnection> clientes = new List<IWebSocketConnection>();
			webSocketServer.Start(delegate (IWebSocketConnection cliente)
			{
				cliente.OnOpen = () =>
				{
					clientes.Add(cliente);
					Console.WriteLine("Se conecto el cliente con IP: {0}", cliente.ConnectionInfo.ClientIpAddress);
				};
				cliente.OnClose = () =>
				{
					clientes.Remove(cliente);
					Console.WriteLine("Se desconecto el cliente con IP: {0}", cliente.ConnectionInfo.ClientIpAddress);
				};
				cliente.OnMessage = (string mensaje) =>
				{
					Console.WriteLine("Mensaje recibido: {0}", mensaje);
					foreach (IWebSocketConnection x in clientes) x.Send(mensaje);
				};
				cliente.OnBinary = (byte[] mensaje) =>
				{
					Console.WriteLine("Data recibida de tamaño: {0}", mensaje.Length);
					foreach (IWebSocketConnection x in clientes) x.Send(mensaje);
				};
			});
			Console.WriteLine("Pulsa Enter para finalizar");
			Console.Read();
		}
	}
}
