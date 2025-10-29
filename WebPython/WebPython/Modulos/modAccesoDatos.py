import os
import pyodbc as db
from modUtilidades import beLog, Log
import pandas as pd

class clienteSQL():
    def __init__(self, archivoConfig, archivoLog):
        self.CadenaConexion = ""
        self.ArchivoLog = archivoLog
        try:
            if(os.path.isfile(archivoConfig)):
                with open(archivoConfig, "r") as file:
                    lineas = file.read().split("\n")
                diccionario = {}
                for linea in lineas:
                    campos = linea.split("=")
                    diccionario[campos[0]] = campos[1]
                self.CadenaConexion = "driver={0};server={1};uid={2};pwd={3};database={4}".format(diccionario["driver"],diccionario["servidor"],diccionario["usuario"],diccionario["clave"],diccionario["basedatos"])
            else:
                print("No existe el archivo Config")
        except Exception as errorgeneral:
            obeLog=beLog("modAccesoDatos", "clienteSQL")
            obeLog.setLog("__init__", str(errorgeneral))
            Log.saveLog(obeLog, self.ArchivoLog)
    
    def EjecutarComandoUnaLista(self, sql):
        rpta = None
        try:            
            con = db.connect(self.CadenaConexion)
            cmd = con.cursor()
            cursor = cmd.execute(sql)
            cabeceras = cursor.description
            nCabeceras = len(cabeceras)
            campos = []
            for j in range(nCabeceras):
                campos.append(cabeceras[j][0])
            rpta = []
            rpta.append(",".join(campos))
            
            lista = cursor.fetchall()
            
            nRegistros = len(lista)
            for i in range(nRegistros):
                tupla = lista[i]
                nCampos = len(tupla)
                fila = []
                for j in range(nCampos):
                    fila.append(str(tupla[j]))    
                rpta.append(",".join(fila))
        except Exception as errorgeneral:
            obeLog=beLog("modAccesoDatos", "clienteSQL")
            obeLog.setLog("EjecutarComandoUnaLista", str(errorgeneral))
            Log.saveLog(obeLog, self.ArchivoLog)
        return rpta
    
    def crearLista(self, cursor):
        rpta = []
        cabeceras = cursor.description
        nCabeceras = len(cabeceras)
        campos = []
        for j in range(nCabeceras):
            campos.append(cabeceras[j][0])
        rpta.append(",".join(campos))        
        lista = cursor.fetchall()        
        nRegistros = len(lista)
        for i in range(nRegistros):
            tupla = lista[i]
            nCampos = len(tupla)
            fila = []
            for j in range(nCampos):
                fila.append(str(tupla[j]))    
            rpta.append(",".join(fila))
        return rpta
    
    def EjecutarComandoListas(self, sql):
        rpta = None
        try:            
            con = db.connect(self.CadenaConexion)
            cmd = con.cursor()
            cursor = cmd.execute(sql)
            rpta = []
            rpta.append(self.crearLista(cursor))
            while(cursor.nextset()):
                rpta.append(self.crearLista(cursor))
        except Exception as errorgeneral:
            obeLog=beLog("modAccesoDatos", "clienteSQL")
            obeLog.setLog("EjecutarComandoListas", str(errorgeneral))
            Log.saveLog(obeLog, self.ArchivoLog)
        return rpta
    
    def EjecutarComandoCadena(self, nombreSP, nombreParametro="", valorParametro="", trx=False):
        rpta = None
        try:            
            con = db.connect(self.CadenaConexion)
            cmd = con.cursor()
            if(nombreParametro!="" and valorParametro!=""):
                sql = "exec {0} @{1}=?".format(nombreSP, nombreParametro)
                cursor = con.execute(sql, (valorParametro))
                print("Ejecutando")
            else:
                cursor = cmd.execute(nombreSP)
            rpta = cursor.fetchval()
            print("Rpta: " + rpta)
            if(rpta is None):
                rpta=""
            if(trx==True):
                con.commit()
        except Exception as errorgeneral:
            print("Error: ", str(errorgeneral))
            obeLog=beLog("modAccesoDatos", "clienteSQL")
            obeLog.setLog("EjecutarComandoCadena", str(errorgeneral))
            Log.saveLog(obeLog, self.ArchivoLog)
        return rpta
    
    def EjecutarComandoFila(self, nombreSP, nombreParametro="", valorParametro=""):
        rpta = None
        try:            
            con = db.connect(self.CadenaConexion)
            cmd = con.cursor()
            if(nombreParametro!="" and valorParametro!=""):
                sql = "exec {0} @{1}=?".format(nombreSP, nombreParametro)
                cursor = con.execute(sql, (valorParametro))
            else:
                cursor = cmd.execute(nombreSP)
            rpta = cursor.fetchone()
            if(rpta is None):
                rpta=""
        except Exception as errorgeneral:
            obeLog=beLog("modAccesoDatos", "clienteSQL")
            obeLog.setLog("EjecutarComandoFila", str(errorgeneral))
            Log.saveLog(obeLog, self.ArchivoLog)
        return rpta
    
    def EjecutarComandoDF(self, nombreSP, parametroNombre = "", parametroValor = "" , trx=False):
        df = None
        try:
            con = db.connect(self.CadenaConexion)
            if(parametroNombre!="" and parametroValor!=""):
                sql = "exec {0} @{1}=?".format(nombreSP, parametroNombre)
                df = pd.read_sql_query(sql, con, params = [parametroValor])
            else:
                df = pd.read_sql_query(nombreSP, con)
            if(trx==True):
                con.commit()          
        except Exception as error:
            obeLog=beLog("modAccesoDatos", "clienteSQL")
            obeLog.setLog("EjecutarComandoDF", str(error))
            Log.saveLog(obeLog, self.ArchivoLog)
        return df
    
    def EjecutarComandoVariosDF(self, nombreSP, parametroNombre = "", parametroValor = ""):
        rpta = []
        try:
            con = db.connect(self.CadenaConexion)
            cmd = con.cursor()
            if(parametroNombre!=""):
                cursor = cmd.execute("exec {0} @{1}=?".format(nombreSP, parametroNombre), (parametroValor))
            else:
                cursor = cmd.execute(nombreSP)
                rpta.append(self.crearDataFrameDesdeCursor(cursor))
                while(cursor.nextset()):
                    rpta.append(self.crearDataFrameDesdeCursor(cursor))
            cursor.close()
            con.close()
            
            return rpta
        except Exception as error:
            obeLog=beLog("modAccesoDatos", "clienteSQL")
            obeLog.setLog("EjecutarComandoVariosDF", str(error))
            Log.saveLog(obeLog, self.ArchivoLog)
        return rpta

    def crearDataFrameDesdeCursor(self, cursor):
        cabeceras = []
        for fila in cursor.description:
            cabeceras.append(fila[0])
        lista = cursor.fetchall()
        filas = []
        ncampos = len(cabeceras)
        for i in range(len(lista)):
            fila = []
            for j in range(ncampos):
                fila.append(lista[i][j])
            filas.append(fila)
        df = pd.DataFrame(data=filas, columns=cabeceras)              
        return df