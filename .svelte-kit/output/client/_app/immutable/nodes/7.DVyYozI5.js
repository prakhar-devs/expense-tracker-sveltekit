import{s as Tt}from"../chunks/NR9cexEe.js";import{l as ut,c as Pe,g as we,a as r,p as Je,h as zt,r as Nt,k as rt,j as jt,i as L,f as l,s as p,t as h}from"../chunks/BzcZzo3g.js";import{s as $t,a as Ct,b as St,i as Dt,f as Fe,g as Et,d as xe}from"../chunks/BAAnMpK1.js";import{f as $,p as xt,e as Lt,a as gt,v as ge,w as qt,t as w,s as n,c as d,b as me,x as M,g as e,r as s,n as x,y as o,z as he,A as st}from"../chunks/DJ2lXJsJ.js";import{I as mt,b as Bt,e as It,c as Ot,B as $e,a as Ve,C as Ge}from"../chunks/BtLs4GqB.js";import{R as ot,T as nt,A as dt,a as it,b as ct,c as lt,d as vt,e as _t,f as pt}from"../chunks/DL7qcDyJ.js";import{d as Qt,e as Ut,g as Ft,A as Vt,T as Gt,P as Ht,R as He,f as B,p as I}from"../chunks/Btsy3k08.js";import{a as Jt,p as Kt}from"../chunks/B1L6nffc.js";import{a as ye}from"../chunks/BMVIPWD2.js";import{T as ft}from"../chunks/B6HN1MfR.js";function Wt(T,v){const k=ut(v,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.575.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2026 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const A=[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1"}]];mt(T,Pe({name:"pause"},()=>k,{get iconNode(){return A},children:(q,re)=>{var _=we(),z=$(_);$t(z,v,"default",{},null),r(q,_)},$$slots:{default:!0}}))}function Xt(T,v){const k=ut(v,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.575.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2026 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const A=[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"}]];mt(T,Pe({name:"play"},()=>k,{get iconNode(){return A},children:(q,re)=>{var _=we(),z=$(_);$t(z,v,"default",{},null),r(q,_)},$$slots:{default:!0}}))}const Yt=async({parent:T})=>{const{session:v}=await T();if(!(v!=null&&v.user))return{preloaded:null};const{data:k}=await Tt.from("recurring_transactions").select("*").eq("user_id",v.user.id).order("created_at",{ascending:!1}).limit(200);return{preloaded:{recurring:k||[]}}},Sa=Object.freeze(Object.defineProperty({__proto__:null,load:Yt},Symbol.toStringTag,{value:"Module"})),Zt=Bt({base:"focus:ring-ring inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/80 border-transparent",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent",outline:"text-foreground"}},defaultVariants:{variant:"default"}});function be(T,v){xt(v,!0);let k=Je(v,"ref",15,null),A=Je(v,"variant",3,"default"),q=Nt(v,["$$slots","$$events","$$legacy","ref","href","class","variant","children"]);var re=we(),_=$(re);It(_,()=>v.href?"a":"span",!1,(z,R)=>{zt(z,se=>k(se),()=>k()),Ct(z,se=>({href:v.href,class:se,...q}),[()=>Ot(Zt({variant:A()}),v.class)]);var O=we(),ne=$(O);St(ne,()=>v.children??Lt),r(R,O)}),r(T,re),gt()}var ea=l("<!> New Recurring",1),ta=l('<div class="h-24 animate-pulse rounded-lg bg-muted"></div>'),aa=l('<div class="space-y-3"></div>'),ra=l(`<!> <p class="font-medium text-muted-foreground">No recurring transactions</p> <p class="text-sm text-muted-foreground/70">Create a transaction and toggle "Make this
                            recurring"</p>`,1),sa=l("<span> </span>"),oa=l("<span> </span>"),na=l('<p class="text-xs text-muted-foreground/70 mt-0.5 truncate"> </p>'),da=l("<!> <!>",1),ia=l("<!> <!>",1),ca=l("<!> <!>",1),la=l("<!> <!>",1),va=l('<div class="flex items-start justify-between gap-4"><div class="flex items-start gap-3 min-w-0"><div><!></div> <div class="min-w-0"><div class="flex items-center gap-2 flex-wrap"><span class="font-semibold text-foreground"> </span> <!> <!></div> <p> </p> <div class="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground mt-1"><span> </span> <span> </span> <!> <!></div> <!></div></div> <div class="flex items-center gap-1 shrink-0"><!> <!></div></div>'),_a=l('<div><h2 class="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Active</h2> <div class="space-y-3"></div></div>'),pa=l("<span> </span>"),fa=l("<span> </span>"),ua=l('<p class="text-xs text-muted-foreground/70 mt-0.5 truncate"> </p>'),$a=l("<!> <!>",1),xa=l("<!> <!>",1),ga=l("<!> <!>",1),ma=l("<!> <!>",1),ha=l('<div class="flex items-start justify-between gap-4"><div class="flex items-start gap-3 min-w-0"><div><!></div> <div class="min-w-0"><div class="flex items-center gap-2 flex-wrap"><span class="font-semibold text-foreground"> </span> <!> <!></div> <p> </p> <div class="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground mt-1"><span> </span> <span> </span> <!> <!></div> <!></div></div> <div class="flex items-center gap-1 shrink-0"><!> <!></div></div>'),ya=l('<div><h2 class="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Paused</h2> <div class="space-y-3"></div></div>'),ba=l("<!> <!>",1),Pa=l('<div class="flex flex-col h-full animate-fade-in overflow-hidden"><div class="shrink-0 bg-background pb-4 pt-2 border-b border-border/40"><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="font-display text-3xl font-bold text-foreground">Recurring Transactions</h1> <p class="text-muted-foreground"> </p></div> <!></div></div> <div class="flex-1 overflow-y-auto pt-6 pb-6 space-y-6"><!></div></div>');function Da(T,v){var Ye;xt(v,!1);const k=()=>rt(Jt,"$auth",q),A=()=>rt(Kt,"$preferencesStore",q),[q,re]=jt(),_=he(),z=he(),R=he(),O=he();let ne=Je(v,"data",8);const se=Qt(()=>{var g;return(g=k().user)==null?void 0:g.id},(Ye=ne().preloaded)==null?void 0:Ye.recurring),ht=Ut(),Ke=Ft(),We={daily:"Every day",weekly:"Every week",monthly:"Every month",yearly:"Every year"};function Xe(g,Ze){ht.mutate({id:g,is_active:!Ze})}ge(()=>M(ne()),()=>{var g;me(_,se.data||((g=ne().preloaded)==null?void 0:g.recurring)||[])}),ge(()=>e(_),()=>{me(z,se.isLoading&&e(_).length===0)}),ge(()=>e(_),()=>{me(R,e(_).filter(g=>g.is_active))}),ge(()=>e(_),()=>{me(O,e(_).filter(g=>!g.is_active))}),qt(),Dt(),Vt(T,{children:(g,Ze)=>{var Me=Pa(),ke=d(Me),et=d(ke),Ae=d(et),tt=n(d(Ae),2),yt=d(tt);s(tt),s(Ae);var bt=n(Ae,2);Gt(bt,{children:(y,N)=>{$e(y,{class:"gap-2",children:(Q,de)=>{var U=ea(),oe=$(U);Ht(oe,{class:"h-4 w-4"}),x(),r(Q,U)},$$slots:{default:!0}})},$$slots:{default:!0}}),s(et),s(ke);var at=n(ke,2),Pt=d(at);{var wt=y=>{var N=aa();Fe(N,4,()=>[1,2,3],Et,(Q,de)=>{var U=ta();r(Q,U)}),s(N),r(y,N)},Mt=y=>{Ve(y,{class:"border-dashed border-border",children:(N,Q)=>{Ge(N,{class:"flex flex-col items-center justify-center py-16 text-center gap-3",children:(de,U)=>{var oe=ra(),j=$(oe);He(j,{class:"h-10 w-10 text-muted-foreground/40"}),x(4),r(de,oe)},$$slots:{default:!0}})},$$slots:{default:!0}})},kt=y=>{var N=ba(),Q=$(N);{var de=j=>{var F=_a(),ie=n(d(F),2);Fe(ie,5,()=>e(R),V=>V.id,(V,t)=>{Ve(V,{class:"border-border/50 shadow-sm",children:(Re,At)=>{Ge(Re,{class:"p-4",children:(Te,Rt)=>{var G=va(),H=d(G),C=d(H),ze=d(C);{let a=st(()=>(e(t),o(()=>e(t).type==="income"?"text-income":"text-expense")));He(ze,{get class(){return`h-4 w-4 ${e(a)??""}`}})}s(C);var ce=n(C,2),J=d(ce),K=d(J),Ne=d(K,!0);s(K);var le=n(K,2);be(le,{variant:"default",class:"text-xs",children:(a,i)=>{x();var c=h("Active");r(a,c)},$$slots:{default:!0}});var je=n(le,2);be(je,{variant:"outline",class:"text-xs",children:(a,i)=>{x();var c=h();w(()=>p(c,(e(t),o(()=>We[e(t).frequency])))),r(a,c)},$$slots:{default:!0}}),s(J);var S=n(J,2),Ce=d(S);s(S);var W=n(S,2),X=d(W),Se=d(X);s(X);var Y=n(X,2),De=d(Y);s(Y);var ve=n(Y,2);{var Ee=a=>{var i=sa(),c=d(i);s(i),w(D=>p(c,`Until: ${D??""}`),[()=>(M(B),M(I),e(t),o(()=>B(I(e(t).end_date),"MMM d, yyyy")))]),r(a,i)};L(ve,a=>{e(t),o(()=>e(t).end_date)&&a(Ee)})}var Le=n(ve,2);{var qe=a=>{var i=oa(),c=d(i);s(i),w(()=>p(c,`Max: ${e(t),o(()=>e(t).max_occurrences)??""}`)),r(a,i)};L(Le,a=>{e(t),o(()=>e(t).max_occurrences)&&a(qe)})}s(W);var Be=n(W,2);{var Ie=a=>{var i=na(),c=d(i,!0);s(i),w(()=>p(c,(e(t),o(()=>e(t).note)))),r(a,i)};L(Be,a=>{e(t),o(()=>e(t).note)&&a(Ie)})}s(ce),s(H);var _e=n(H,2),pe=d(_e);$e(pe,{variant:"ghost",size:"icon",class:"h-8 w-8",onclick:()=>Xe(e(t).id,e(t).is_active),title:"Pause",children:(a,i)=>{Wt(a,{class:"h-4 w-4"})},$$slots:{default:!0}});var Oe=n(pe,2);ot(Oe,{children:(a,i)=>{var c=la(),D=$(c);nt(D,{child:(ue,m)=>{$e(ue,Pe(()=>m==null?void 0:m().props,{variant:"ghost",size:"icon",class:"h-8 w-8 text-destructive hover:text-destructive",children:(ee,E)=>{ft(ee,{class:"h-4 w-4"})},$$slots:{default:!0}}))},$$slots:{child:!0}});var Qe=n(D,2);dt(Qe,{children:(fe,ue)=>{var m=ca(),Z=$(m);it(Z,{children:(E,Ue)=>{var b=da(),P=$(b);ct(P,{children:(f,ae)=>{x();var u=h(`Delete
                                                                recurring rule?`);r(f,u)},$$slots:{default:!0}});var te=n(P,2);lt(te,{children:(f,ae)=>{x();var u=h(`This will stop
                                                                future automatic
                                                                transactions.
                                                                Past
                                                                transactions
                                                                will not be
                                                                affected.`);r(f,u)},$$slots:{default:!0}}),r(E,b)},$$slots:{default:!0}});var ee=n(Z,2);vt(ee,{children:(E,Ue)=>{var b=ia(),P=$(b);_t(P,{children:(f,ae)=>{x();var u=h("Cancel");r(f,u)},$$slots:{default:!0}});var te=n(P,2);pt(te,{onclick:()=>Ke.mutate(e(t).id),class:"bg-destructive text-destructive-foreground hover:bg-destructive/90",children:(f,ae)=>{x();var u=h("Delete");r(f,u)},$$slots:{default:!0}}),r(E,b)},$$slots:{default:!0}}),r(fe,m)},$$slots:{default:!0}}),r(a,c)},$$slots:{default:!0}}),s(_e),s(G),w((a,i)=>{xe(C,1,`mt-0.5 rounded-full p-1.5 ${e(t),o(()=>e(t).type==="income"?"bg-income/10":"bg-expense/10")??""}`),p(Ne,(e(t),o(()=>e(t).category))),xe(S,1,`text-lg font-bold mt-0.5 ${e(t),o(()=>e(t).type==="income"?"text-income":"text-expense")??""}`),p(Ce,`${e(t),o(()=>e(t).type==="expense"?"−":"+")??""}${a??""}`),p(Se,`Next: ${i??""}`),p(De,`Runs: ${e(t),o(()=>e(t).occurrences_created)??""}
                                                            time${e(t),o(()=>e(t).occurrences_created!==1?"s":"")??""}`)},[()=>(M(ye),e(t),A(),o(()=>ye(e(t).amount,A()))),()=>(M(B),M(I),e(t),o(()=>B(I(e(t).next_run_date),"MMM d, yyyy")))]),r(Te,G)},$$slots:{default:!0}})},$$slots:{default:!0}})}),s(ie),s(F),r(j,F)};L(Q,j=>{e(R),o(()=>e(R).length>0)&&j(de)})}var U=n(Q,2);{var oe=j=>{var F=ya(),ie=n(d(F),2);Fe(ie,5,()=>e(O),V=>V.id,(V,t)=>{Ve(V,{class:"border-border/50 shadow-sm opacity-75",children:(Re,At)=>{Ge(Re,{class:"p-4",children:(Te,Rt)=>{var G=ha(),H=d(G),C=d(H),ze=d(C);{let a=st(()=>(e(t),o(()=>e(t).type==="income"?"text-income":"text-expense")));He(ze,{get class(){return`h-4 w-4 ${e(a)??""}`}})}s(C);var ce=n(C,2),J=d(ce),K=d(J),Ne=d(K,!0);s(K);var le=n(K,2);be(le,{variant:"secondary",class:"text-xs",children:(a,i)=>{x();var c=h("Paused");r(a,c)},$$slots:{default:!0}});var je=n(le,2);be(je,{variant:"outline",class:"text-xs",children:(a,i)=>{x();var c=h();w(()=>p(c,(e(t),o(()=>We[e(t).frequency])))),r(a,c)},$$slots:{default:!0}}),s(J);var S=n(J,2),Ce=d(S);s(S);var W=n(S,2),X=d(W),Se=d(X);s(X);var Y=n(X,2),De=d(Y);s(Y);var ve=n(Y,2);{var Ee=a=>{var i=pa(),c=d(i);s(i),w(D=>p(c,`Until: ${D??""}`),[()=>(M(B),M(I),e(t),o(()=>B(I(e(t).end_date),"MMM d, yyyy")))]),r(a,i)};L(ve,a=>{e(t),o(()=>e(t).end_date)&&a(Ee)})}var Le=n(ve,2);{var qe=a=>{var i=fa(),c=d(i);s(i),w(()=>p(c,`Max: ${e(t),o(()=>e(t).max_occurrences)??""}`)),r(a,i)};L(Le,a=>{e(t),o(()=>e(t).max_occurrences)&&a(qe)})}s(W);var Be=n(W,2);{var Ie=a=>{var i=ua(),c=d(i,!0);s(i),w(()=>p(c,(e(t),o(()=>e(t).note)))),r(a,i)};L(Be,a=>{e(t),o(()=>e(t).note)&&a(Ie)})}s(ce),s(H);var _e=n(H,2),pe=d(_e);$e(pe,{variant:"ghost",size:"icon",class:"h-8 w-8",onclick:()=>Xe(e(t).id,e(t).is_active),title:"Resume",children:(a,i)=>{Xt(a,{class:"h-4 w-4"})},$$slots:{default:!0}});var Oe=n(pe,2);ot(Oe,{children:(a,i)=>{var c=ma(),D=$(c);nt(D,{child:(ue,m)=>{$e(ue,Pe(()=>m==null?void 0:m().props,{variant:"ghost",size:"icon",class:"h-8 w-8 text-destructive hover:text-destructive",children:(ee,E)=>{ft(ee,{class:"h-4 w-4"})},$$slots:{default:!0}}))},$$slots:{child:!0}});var Qe=n(D,2);dt(Qe,{children:(fe,ue)=>{var m=ga(),Z=$(m);it(Z,{children:(E,Ue)=>{var b=$a(),P=$(b);ct(P,{children:(f,ae)=>{x();var u=h(`Delete
                                                                recurring rule?`);r(f,u)},$$slots:{default:!0}});var te=n(P,2);lt(te,{children:(f,ae)=>{x();var u=h(`This will stop
                                                                future automatic
                                                                transactions.
                                                                Past
                                                                transactions
                                                                will not be
                                                                affected.`);r(f,u)},$$slots:{default:!0}}),r(E,b)},$$slots:{default:!0}});var ee=n(Z,2);vt(ee,{children:(E,Ue)=>{var b=xa(),P=$(b);_t(P,{children:(f,ae)=>{x();var u=h("Cancel");r(f,u)},$$slots:{default:!0}});var te=n(P,2);pt(te,{onclick:()=>Ke.mutate(e(t).id),class:"bg-destructive text-destructive-foreground hover:bg-destructive/90",children:(f,ae)=>{x();var u=h("Delete");r(f,u)},$$slots:{default:!0}}),r(E,b)},$$slots:{default:!0}}),r(fe,m)},$$slots:{default:!0}}),r(a,c)},$$slots:{default:!0}}),s(_e),s(G),w((a,i)=>{xe(C,1,`mt-0.5 rounded-full p-1.5 ${e(t),o(()=>e(t).type==="income"?"bg-income/10":"bg-expense/10")??""}`),p(Ne,(e(t),o(()=>e(t).category))),xe(S,1,`text-lg font-bold mt-0.5 ${e(t),o(()=>e(t).type==="income"?"text-income":"text-expense")??""}`),p(Ce,`${e(t),o(()=>e(t).type==="expense"?"−":"+")??""}${a??""}`),p(Se,`Next: ${i??""}`),p(De,`Runs: ${e(t),o(()=>e(t).occurrences_created)??""}
                                                            time${e(t),o(()=>e(t).occurrences_created!==1?"s":"")??""}`)},[()=>(M(ye),e(t),A(),o(()=>ye(e(t).amount,A()))),()=>(M(B),M(I),e(t),o(()=>B(I(e(t).next_run_date),"MMM d, yyyy")))]),r(Te,G)},$$slots:{default:!0}})},$$slots:{default:!0}})}),s(ie),s(F),r(j,F)};L(U,j=>{e(O),o(()=>e(O).length>0)&&j(oe)})}r(y,N)};L(Pt,y=>{e(z)?y(wt):(e(_),o(()=>!e(_).length)?y(Mt,1):y(kt,!1))})}s(at),s(Me),w(()=>p(yt,`${e(R),o(()=>e(R).length)??""} active rule${e(R),o(()=>e(R).length!==1?"s":"")??""}`)),r(g,Me)},$$slots:{default:!0}}),gt(),re()}export{Da as component,Sa as universal};
