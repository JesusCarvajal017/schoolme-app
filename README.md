# 📱 SchoolMeMovil — Manual de instalación y ejecución

Proyecto móvil construido con **React Native + TypeScript**, conectado a una API real, con arquitectura modular, tipado estricto y diseño visual profesional.

---

## 📦 Requisitos previos

Antes de clonar el proyecto, asegúrate de tener instalado:

- **Node.js** ≥ 18.x  
- **npm** ≥ 9.x  
- **Git**
- **Java JDK** ≥ 11  
- **Android Studio** (con emulador configurado o dispositivo físico conectado)
- **Expo CLI**:
  ```bash
  npm install -g expo-cli
  ```

## 🚀 Instalación paso a paso

### Opción 1: Instalación tradicional

#### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/SchoolMeMovil.git
cd SchoolMeMovil
```

#### 2. Instalar dependencias
```bash
npm install
```

#### 3. Configurar entorno
Verifica que el archivo `src/api/constant/Enviroment.ts` esté apuntando al backend correcto:

```ts
export const environment = {
  urlApi: 'https://api.schoolme.com',
};
```

Si usas `.env`, crea el archivo en la raíz:

```env
API_URL=https://api.schoolme.com
```

#### 4. Ejecutar en modo desarrollo
```bash
expo start
```
Escanea el QR con tu dispositivo físico (con la app Expo Go instalada).

O presiona `a` para abrir en emulador Android.

### Opción 2: Instalación con Docker (Recomendado)

#### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/SchoolMeMovil.git
cd SchoolMeMovil
```

#### 2. Ejecutar con Docker (automático)
```bash
# Ejecuta el script de inicio (Windows)
start.bat

# O manualmente:
docker-compose build
docker-compose up -d
```

#### 3. Acceder al proyecto
- El proyecto estará disponible en `http://localhost:6000`
- Escanea el QR con tu dispositivo físico (con la app Expo Go instalada)
- Para desarrollo USB: conecta tu dispositivo y usa `expo start --lan`

#### 4. Comandos útiles
```bash
# Ver logs
docker-compose logs -f

# Detener el contenedor
docker-compose down

# Reconstruir imagen
docker-compose build --no-cache
```

---

## 📁 Estructura del proyecto
```
src/
├── api/
│   ├── constant/Enviroment.ts
│   ├── services/
│   └── types/
├── components/
├── context/AuthContext.tsx
├── screens/
├── modals/
├── navigation/
```

- **Servicios API**: organizados en `src/api/services`  
- **Tipos centralizados**: en `src/api/types/index.ts`  
- **Contexto global**: `AuthContext` maneja token, user, person  
- **Navegación**: con React Navigation y NativeStack  
- **Estilos**: definidos con `StyleSheet.create`, organizados por pantalla  

---

## 📦 Dependencias necesarias
Instala estas dependencias si aún no están en tu `package.json`:

```bash
npm install react-native react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-screens react-native-vector-icons
npm install @react-navigation/native @react-navigation/native-stack
npm install expo expo-status-bar expo-linear-gradient
npm install jwt-decode
npm install @react-native-async-storage/async-storage
npm install expo-image-picker
npm install expo-file-system
```

formularios avanzados:
```bash
npm install yup react-hook-form
```


## 🧪 Pruebas rápidas
- ✅ Login funcional con email y contraseña reales  
- ✅ Perfil muestra datos dinámicos desde el backend (user, person, photo, roles, etc.)  
- ✅ Botón “Editar perfil” navega correctamente  
- ✅ Validaciones activas en campos de edición  
- ✅ Logout limpia contexto y redirige a LoginScreen  

---

## 🧯 Errores comunes y cómo evitarlos

| Error | Solución |
|-------|----------|
| `StyleSheet doesn't exist` | Verifica que todos los archivos tengan `import { StyleSheet } from 'react-native'` |
| Login inválido | Asegúrate de que el backend devuelva `{ token, user, person }` correctamente |
| `TS2724` en tipos | Revisa que los tipos reexportados en `index.ts` existan en sus archivos originales |
| APK no genera | Usa Expo EAS Build en modo preview para pruebas internas |

---

## 📦 Nota técnica — Generar APK de pruebas con Expo
Si necesitas instalar la app en dispositivos físicos sin pasar por Google Play:

### 1. Instalar EAS CLI
```bash
npm install -g eas-cli
```

### 2. Crear archivo `eas.json`
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### 3. Ejecutar build
```bash
eas build --platform android --profile preview
```

Expo generará un APK que puedes descargar e instalar manualmente en tu dispositivo.

---

## 👨‍💻 Autor
**Santiago Chaparro Riaño**  
📍 Ubicación: Neiva, Huila, Colombia  
📌 Proyecto: SchoolMeMovil  
⚙️ Tecnologías: React Native · TypeScript · Expo · API REST · Context API · Modular Architecture  
