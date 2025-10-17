using System;
using System.Linq;
using System.Text; //Encoding
using System.IO; //StreamReader, StreamWriter
using System.Security.Cryptography; //AesCryptoServiceProvider

namespace Demo20.Rutinas
{
    public class Seguridad
    {
        public static string CifradoXOR(string texto, int pwd)
        {
            string rpta = "";
            int nTexto = texto.Length;
            int n = 0;
            for (var i = 0; i < nTexto; i++)
            {
                n = (int)(texto[i]) ^ pwd;
                rpta += (char)n;
            }
            return rpta;
        }

        private static byte[] convertirHexadecimalToBytes(string mensajeHex)
        {
            int n = mensajeHex.Length;
            byte[] bytes = new byte[n / 2];
            for (int i = 0; i < n; i += 2)
                bytes[i / 2] = Convert.ToByte(mensajeHex.Substring(i, 2), 16);
            return bytes;
        }

        public static string CifrarAESHex(string mensaje)
        {
            string dataCifradaHex = "";
            AesCryptoServiceProvider aes = new AesCryptoServiceProvider();
            string strClave = "Curs0P@vn@vMJ".PadRight(32, ' ');
            string strVectorInicio = "Lduenas".PadRight(16, ' ');
            byte[] bufferClave = Encoding.Default.GetBytes(strClave);
            byte[] bufferVectorInicio = Encoding.Default.GetBytes(strVectorInicio);
            using (MemoryStream ms = new MemoryStream())
            {
                try
                {
                    using (CryptoStream cs = new CryptoStream(ms, aes.CreateEncryptor(bufferClave, bufferVectorInicio), CryptoStreamMode.Write))
                    {

                        using (StreamWriter sw = new StreamWriter(cs))
                        {
                            sw.Write(mensaje);
                        }
                        byte[] bufferCifrado = ms.ToArray();
                        dataCifradaHex = BitConverter.ToString(bufferCifrado).Replace("-", "");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error: " + ex.Message);
                }
            }
            return dataCifradaHex;
        }

        public static string DescifrarAESHex(string mensajeHex)
        {
            byte[] dataCifrada = convertirHexadecimalToBytes(mensajeHex);
            AesCryptoServiceProvider aes = new AesCryptoServiceProvider();
            string strClave = "Curs0P@vn@vMJ".PadRight(32, ' ');
            string strVectorInicio = "Lduenas".PadRight(16, ' ');
            byte[] bufferClave = Encoding.Default.GetBytes(strClave);
            byte[] bufferVectorInicio = Encoding.Default.GetBytes(strVectorInicio);
            string dataDescifrada = "";
            using (MemoryStream ms = new MemoryStream(dataCifrada))
            {
                try
                {
                    using (CryptoStream cs = new CryptoStream(ms, aes.CreateDecryptor(bufferClave, bufferVectorInicio), CryptoStreamMode.Read))
                    {

                        using (StreamReader sr = new StreamReader(cs))
                        {
                            dataDescifrada = sr.ReadToEnd();
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error: " + ex.Message);
                }
            }
            return dataDescifrada;
        }
    }
}