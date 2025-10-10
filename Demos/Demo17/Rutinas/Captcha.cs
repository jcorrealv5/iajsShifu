using System.Collections.Generic; //Dictionary
using System.IO; //MemoryStream
using System.Drawing; //Bitmap, Graphics, Font
using System.Drawing.Imaging; //ImageFormat
using System.Drawing.Drawing2D; //LinearGradientBrush
using System;
using System.Text;
using System.Threading;

namespace Demo17.Rutinas
{
    public class Captcha
    {
        private static char generarCaracterAzar()
        {
            Random oAzar = new Random();
            int n = 65 + oAzar.Next(26);
            Thread.Sleep(15);
            return (char)n; //A - Z
        }

        private static char generarNumeroAzar()
        {
            Random oAzar = new Random();
            int n = 48 + oAzar.Next(10);
            Thread.Sleep(15);
            return (char)n; //0 - 9
        }

        public static Dictionary<string,byte[]> CrearCaptcha(int ancho, int alto, string colorFondo="green")
        {
            Dictionary<string, byte[]> rpta = new Dictionary<string, byte[]>();
            Bitmap bmp = new Bitmap(ancho, alto);
            Rectangle rec = new Rectangle(0, 0, ancho, alto);
            LinearGradientBrush deg = new LinearGradientBrush(rec, Color.FromName(colorFondo), Color.Black, LinearGradientMode.ForwardDiagonal);
            Graphics grafico = Graphics.FromImage(bmp);
            grafico.FillRectangle(deg, rec);
            StringBuilder sb=new StringBuilder();
            Random oAzar = new Random();
            int n = 0;
            int x = 0;
            int y = 0;
            char c;
            int rojo, verde, azul;
            Color color;
            for(int i=0;i<6;i++)
            {
                n= oAzar.Next(2);
                if (n == 0) c =generarCaracterAzar();
                else c = generarNumeroAzar();
                y = oAzar.Next(alto - 30);
                sb.Append(c);
                rojo = oAzar.Next(255);
                verde = oAzar.Next(255);
                azul = oAzar.Next(255);
                color = Color.FromArgb(rojo, verde, azul);
                grafico.DrawString(c.ToString(), new Font("Arial", 30), new SolidBrush(color), x, y);
                x += 35;
            }
            int x2, y2;
            Pen lapiz = new Pen(Brushes.White, 1);
            for (int i = 0; i < 10; i++)
            {
                x = oAzar.Next(ancho);
                x2 = oAzar.Next(ancho);
                y= oAzar.Next(alto);
                y2 = oAzar.Next(alto);
                grafico.DrawLine(lapiz, x, y, x2, y2);
            }
            using(MemoryStream ms=new MemoryStream())
            {
                bmp.Save(ms, ImageFormat.Png);
                rpta[sb.ToString()] = ms.ToArray();
            }
            return rpta;
        }
    }
}
