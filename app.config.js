import fs from 'fs';

// Solo se referencia google-services.json si existe, para que Expo Go siga
// funcionando antes de tener el archivo de Firebase.
const googleServicesJson =
  process.env.GOOGLE_SERVICES_JSON || './google-services.json';
const googleServicesPlist =
  process.env.GOOGLE_SERVICES_PLIST || './GoogleService-Info.plist';

const androidGoogleServices = fs.existsSync(googleServicesJson)
  ? googleServicesJson
  : undefined;
const iosGoogleServices = fs.existsSync(googleServicesPlist)
  ? googleServicesPlist
  : undefined;

export default {
  expo: {
    name: 'Biblia-help',
    slug: 'biblia-app',
    owner: 'pipealzamora',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#5B6CF0',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'cl.pipeaalzamora.biblia',
      ...(iosGoogleServices ? { googleServicesFile: iosGoogleServices } : {}),
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#5B6CF0',
      },
      package: 'cl.pipeaalzamora.biblia',
      versionCode: 1,
      ...(androidGoogleServices
        ? { googleServicesFile: androidGoogleServices }
        : {}),
      permissions: ['INTERNET'],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: ['@react-native-google-signin/google-signin'],
    extra: {
      eas: {
        projectId: '9fbe9934-78d9-4577-b8a6-84e7541804f1',
      },
    },
  },
};
