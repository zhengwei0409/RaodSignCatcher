import { defineConfig } from 'vite';

// base: './' makes built asset links relative (./assets/...) instead of
// absolute (/assets/...). Absolute links break inside a Capacitor Android app
// because there is no web server root there, so the app would show a blank
// screen. Relative links work both in the browser and inside the app.
export default defineConfig({
  base: './',
});
