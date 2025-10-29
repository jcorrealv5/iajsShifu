from datetime import datetime

class beLog:
    def __init__(self, modulo, clase):
        self.FechaHora = str(datetime.now())
        self.Modulo = modulo
        self.Clase = clase
    
    def setLog(self, metodo, error):
        self.Metodo = metodo
        self.Error = error
    
    def printLog(self):
        print("Fecha y Hora:", self.FechaHora)
        print("Modulo:", self.Modulo)
        print("Clase:", self.Clase)
        print("Metodo:", self.Metodo)
        print("Error:", self.Error)
        
class Log:
    def saveLog(obeLog, archivo):
        with open(archivo, "a") as file:
            file.write("Fecha y Hora: " + obeLog.FechaHora + "\n")
            file.write("Modulo: " + obeLog.Modulo + "\n")
            file.write("Clase: " + obeLog.Clase + "\n")
            file.write("Metodo: " + obeLog.Metodo + "\n")
            file.write("Error: " + obeLog.Error + "\n")
            file.write("_" * 50 + "\n")
