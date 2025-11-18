// const uri = "192.168.20.29"; 

// export const environment = {
//   uri,
//   urlApi: `http://${uri}:7000/api`
// };

export const environment = {
  uri: "api.schoolme.space",
  urlApi: "https://api.schoolme.space/api" 
};

//Elimina Android
//npx expo prebuild --clean --platform android

//Configurar el SDK
//cd android
//Set-Content -Path "local.properties" -Value "sdk.dir=C:\\Users\\alfas\\AppData\\Local\\Android\\Sdk"
/*

mkdir app\src\main\res\xml

network_security_config.xml

<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">10.3.234.130</domain>
    </domain-config>
</network-security-config>

CONFIGURAR PERMISOS DE SEGURIDAD
<application android:name=".MainApplication" android:label="@string/app_name" android:icon="@mipmap/ic_launcher" android:roundIcon="@mipmap/ic_launcher_round" android:allowBackup="true" android:theme="@style/AppTheme" android:networkSecurityConfig="@xml/network_security_config">
*/

//Generador de APk
//.\gradlew.bat assembleRelease