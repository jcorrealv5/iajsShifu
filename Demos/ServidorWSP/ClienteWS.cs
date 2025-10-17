using Fleck;

namespace ServidorWSP
{
    public class ClienteWS
    {
        public string Usuario { get; set; }
        public IWebSocketConnection Conexion { get; set; }
    }
}
