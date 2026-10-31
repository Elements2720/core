declare global {
  const __webpack_public_path__: string;

  const __webpack_require__: {
    p: string;
  };

  interface ImportMeta {
    env: {
      BASE_URL: string;
    };
  }
}

export const getPublicPath = () => {
  // webpack, rspack, turbopack
  if (typeof __webpack_public_path__ !== 'undefined') return __webpack_public_path__;
  if (typeof __webpack_require__ !== 'undefined' && __webpack_require__.p) return __webpack_require__.p;

  // vite
  if (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) return import.meta.env.BASE_URL;

  // client side parcel, esm
  if (typeof document !== 'undefined' && document.currentScript) {
    return (document.currentScript as HTMLScriptElement).src.replace(/\/[^\/]+$/, '/');
  }

  // server side parcel, esm
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.PUBLIC_URL) return process.env.PUBLIC_URL;
    if (process.env.PARCEL_PUBLIC_URL) return process.env.PARCEL_PUBLIC_URL;
  }

  return '/';
};
