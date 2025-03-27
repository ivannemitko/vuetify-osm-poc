/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Types
import type { App } from 'vue';

// Plugins
import router from '../router';
import pinia from '../stores';
import vuetify from './vuetify';

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia);
}
