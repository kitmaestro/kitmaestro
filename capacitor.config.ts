import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kitmaestro.app',
  appName: 'kit-maestro',
  webDir: 'dist/kit-maestro/browser',
  server: {
    androidScheme: 'https'
  }
};

export default config;
