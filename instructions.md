# Resolución del error de ejecución de scripts en PowerShell

Para poder ejecutar comandos de npm en PowerShell, necesitas cambiar la política de ejecución de scripts. Prueba uno de los siguientes comandos:

## Opción 1: Cambiar política para la sesión actual (temporal)
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

## Opción 2: Cambiar política para tu usuario
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Después de ejecutar uno de estos comandos, intenta nuevamente:
```powershell
npm install standard -D
```

Si necesitas más información sobre las políticas de ejecución, consulta:
https://go.microsoft.com/fwlink/?LinkID=135170

