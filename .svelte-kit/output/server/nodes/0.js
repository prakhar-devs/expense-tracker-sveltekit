

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "ssr": false,
  "load": null
};
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.CgI7wL44.js","_app/immutable/chunks/CXj_nfn1.js","_app/immutable/chunks/Cty6JsUq.js","_app/immutable/chunks/BjWX12uN.js","_app/immutable/chunks/6zVDlL-S.js","_app/immutable/chunks/I4bO1U6J.js","_app/immutable/chunks/n9CHsz1M.js","_app/immutable/chunks/B8u6aYDv.js","_app/immutable/chunks/D15QtD5j.js","_app/immutable/chunks/DjWwGUU_.js"];
export const stylesheets = ["_app/immutable/assets/Toaster.imULxUqb.css","_app/immutable/assets/0.CDnij0QA.css"];
export const fonts = [];
