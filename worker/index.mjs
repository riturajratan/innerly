// Keep the runtime entrypoint free of helper exports: Workers interprets named
// exports as service entrypoints. Unit-testable logic lives in app.mjs.
export { default } from './app.mjs';
