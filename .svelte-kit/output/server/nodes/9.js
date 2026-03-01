

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/transactions/_page.svelte.js')).default;
export const universal = {
  "ssr": false,
  "load": null
};
export const universal_id = "src/routes/transactions/+page.ts";
export const imports = ["_app/immutable/nodes/9.C4C48iIl.js","_app/immutable/chunks/CXj_nfn1.js","_app/immutable/chunks/Cty6JsUq.js","_app/immutable/chunks/CJ2eY8ap.js","_app/immutable/chunks/BjWX12uN.js","_app/immutable/chunks/6zVDlL-S.js","_app/immutable/chunks/D15QtD5j.js","_app/immutable/chunks/n9CHsz1M.js","_app/immutable/chunks/I4bO1U6J.js","_app/immutable/chunks/B8u6aYDv.js","_app/immutable/chunks/CtHu0RXh.js","_app/immutable/chunks/BH5CEV-m.js","_app/immutable/chunks/B2HfLIcf.js","_app/immutable/chunks/BMVIPWD2.js","_app/immutable/chunks/C9I6Mb5r.js","_app/immutable/chunks/Czo0gS-f.js"];
export const stylesheets = ["_app/immutable/assets/Toaster.imULxUqb.css","_app/immutable/assets/AppLayout.BRUFLwGW.css"];
export const fonts = [];
