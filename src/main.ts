import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

// Styles globaux (reset, thème, layout de base…)
import "./scss/main.scss";

/**
 * main.ts = point d’entrée de l’application.
 *
 * C’est le tout premier fichier exécuté par Vite au chargement :
 * - il crée l’application Vue à partir du composant racine (App.vue)
 * - il branche les “plugins” (ex: router)
 * - puis il monte l’app dans le DOM (dans <div id="app"></div>)
 */

/**
 * Création de l’instance Vue.
 *
 * À partir de maintenant, `app` représente ton application.
 * On va lui “greffer” des fonctionnalités (router, store, etc.)
 * avant de l’afficher réellement à l’écran.
 */
const app = createApp(App);

/**
 * Vue Router :
 * - permet de naviguer entre des pages (routes) sans recharger le navigateur
 * - ex : "/" -> HomeView
 */
app.use(router);

/**
 * Mount :
 * - injecte l’application Vue dans l’élément #app du fichier index.html
 * - si #app n’existe pas, tu auras une page vide (ou une erreur)
 */
app.mount("#app");
