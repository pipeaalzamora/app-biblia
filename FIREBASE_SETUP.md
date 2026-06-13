# Autenticación con Google (Firebase Auth)

La app usa **únicamente inicio de sesión con Google** mediante
`@react-native-google-signin/google-signin` + Firebase
(`signInWithCredential`). No hay correo/contraseña.

## Estado (ya configurado y gestionado)

- `google-services.json` en `app-mobile/` (package `cl.pipeaalzamora.biblia`),
  con la huella del keystore de EAS ya incluida.
- `.env` con los valores de Firebase y los client IDs de Google (web + android).
- `app.config.js`: `slug: biblia-app`, `owner: pipealzamora`, package/bundle
  `cl.pipeaalzamora.biblia`, projectId EAS `9fbe9934-78d9-4577-b8a6-84e7541804f1`,
  plugin de Google Sign-In y referencia automática a `google-services.json`.
- `expo-dev-client` instalado (requerido para development build).
- `google-services.json` subido a EAS como variable de archivo secreta
  (`GOOGLE_SERVICES_JSON`, entorno `development`) para que los builds lo incluyan
  sin commitearlo al repo.

## Huellas SHA registradas en Firebase

- **Debug** (keystore local `~/.android/debug.keystore`):
  - SHA1: `36:73:0F:56:DC:EF:4E:89:7D:FD:09:5D:B2:8F:87:22:6B:F3:BD:32`
- **EAS** (keystore remoto `Build Credentials 1RKddnc4bJ`):
  - certificate_hash en google-services.json: `989af1fea06cfee745d0f6c26527dbabdc092b01`

Ambas están en el `google-services.json` actual.

## Requiere development build (no Expo Go)

Google Sign-In es un módulo nativo: **no funciona en Expo Go**. En Expo Go la app
entra en **modo invitado** (se puede usar todo menos el login). El login real
solo funciona en el development/EAS build.

## Comandos

```bash
# Build de development (Android)
eas build --platform android --profile development

# Tras instalar el APK en el dispositivo, levantar el bundler dev-client
npx expo start --dev-client
```

## Habilitar Google en Firebase

Consola → **Authentication → Sign-in method → Google → Habilitar** (con correo de
soporte configurado).

## Probar en Expo Go (sin login)

```bash
npx expo start
```
