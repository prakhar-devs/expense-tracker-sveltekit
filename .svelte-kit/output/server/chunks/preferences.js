import { x as ssr_context, y as lifecycle_function_unavailable } from "./index2.js";
import "clsx";
import { g as get, w as writable } from "./index.js";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function mount() {
  lifecycle_function_unavailable("mount");
}
function unmount() {
  lifecycle_function_unavailable("unmount");
}
async function tick() {
}
const DEFAULT_PREFERENCES = {
  theme: "system",
  accentColor: "#0f172a",
  density: "comfortable",
  currency: "USD",
  firstDayOfWeek: 1,
  sidebarCollapsed: false,
  showAnimations: true,
  appLockEnabled: false,
  appLockPin: "",
  biometricsEnabled: false
};
function createPreferencesStore() {
  const initial = DEFAULT_PREFERENCES;
  const { subscribe, set, update } = writable(initial);
  function applyToDOM(prefs) {
    return;
  }
  function setPreferences(prefs) {
    set(prefs);
  }
  function mergePreferences(patch) {
    update((current) => {
      const next = { ...current, ...patch };
      return next;
    });
  }
  function initApply() {
    applyToDOM(get({ subscribe }));
  }
  return { subscribe, setPreferences, mergePreferences, initApply };
}
const preferencesStore = createPreferencesStore();
export {
  mount as m,
  onDestroy as o,
  preferencesStore as p,
  tick as t,
  unmount as u
};
