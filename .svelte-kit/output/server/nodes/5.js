

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/notifications/_page.svelte.js')).default;
export const universal = {
  "ssr": false,
  "load": null
};
export const universal_id = "src/routes/notifications/+page.ts";
export const imports = ["_app/immutable/nodes/5.aBtjM2gK.js","_app/immutable/chunks/NR9cexEe.js","_app/immutable/chunks/DJ2lXJsJ.js","_app/immutable/chunks/Btsy3k08.js","_app/immutable/chunks/BzcZzo3g.js","_app/immutable/chunks/BAAnMpK1.js","_app/immutable/chunks/DA2NdXXF.js","_app/immutable/chunks/emo1N4DM.js","_app/immutable/chunks/-Te3Ps78.js","_app/immutable/chunks/BtLs4GqB.js","_app/immutable/chunks/B1L6nffc.js","_app/immutable/chunks/5vtCGk4H.js","_app/immutable/chunks/BMVIPWD2.js"];
export const stylesheets = ["_app/immutable/assets/Toaster.imULxUqb.css","_app/immutable/assets/AppLayout.BRUFLwGW.css"];
export const fonts = [];
