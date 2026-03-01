

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "ssr": false,
  "load": null
};
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.8GoFHKPE.js","_app/immutable/chunks/NR9cexEe.js","_app/immutable/chunks/DJ2lXJsJ.js","_app/immutable/chunks/BzcZzo3g.js","_app/immutable/chunks/BAAnMpK1.js","_app/immutable/chunks/-Te3Ps78.js","_app/immutable/chunks/emo1N4DM.js","_app/immutable/chunks/B1L6nffc.js","_app/immutable/chunks/DA2NdXXF.js"];
export const stylesheets = ["_app/immutable/assets/Toaster.imULxUqb.css","_app/immutable/assets/0.D_2s2iBk.css"];
export const fonts = [];
