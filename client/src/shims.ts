import * as setGlobalVars from 'indexeddbshim';

// We'll allow ourselves to use `window.indexedDB` or `indexedDB` as a global
const g = global as any;
g.window = global;
// https://github.com/axemclion/IndexedDBShim/issues/318#issuecomment-411519046
g.shimNS = true;

(setGlobalVars as any)(null, {
  // DEBUG: true,
  checkOrigin: false,
});

