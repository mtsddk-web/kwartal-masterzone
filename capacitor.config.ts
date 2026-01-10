import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'pl.masterzone.kwartal',
  appName: 'Kwartal',
  webDir: 'out',

  // iOS specific settings
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'Kwartal',
  },

  // Android specific settings
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false, // Set true for debugging
  },

  // Server settings (for development with live reload)
  // Uncomment below for live reload during development:
  // server: {
  //   url: 'http://YOUR_IP:3000',
  //   cleartext: true,
  // },

  // Plugins configuration
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0f172a', // night-950 color
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0f172a',
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
