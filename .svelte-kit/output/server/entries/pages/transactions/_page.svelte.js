import { s as sanitize_props, i as spread_props, j as slot, d as attr_class, g as clsx, k as escape_html, e as ensure_array_like, m as derived, c as store_get, u as unsubscribe_stores } from "../../../chunks/index2.js";
import { A as AppLayout, T as TransactionForm, q as Root, r as Select_trigger, s as Select_content, t as Select_item, u as Root$1, v as Trigger, P as Popover_content, w as Calendar_1, C as Calendar } from "../../../chunks/AppLayout.js";
import { T as TransactionItem } from "../../../chunks/TransactionItem.js";
import { B as Button, C as Card, a as Card_content } from "../../../chunks/card-content.js";
import { j as createTransactionsPagedQuery } from "../../../chunks/data.js";
import { I as Icon, c as cn } from "../../../chunks/utils2.js";
import { I as Input } from "../../../chunks/label.js";
import { l as auth } from "../../../chunks/auth.js";
import { format } from "date-fns";
import { getLocalTimeZone } from "@internationalized/date";
import { P as Plus } from "../../../chunks/plus.js";
function Funnel($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
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
   */
  const iconNode = [
    [
      "path",
      {
        "d": "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "funnel" },
    $$sanitized_props,
    {
      /**
       * @component @name Funnel
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMjBhMSAxIDAgMCAwIC41NTMuODk1bDIgMUExIDEgMCAwIDAgMTQgMjF2LTdhMiAyIDAgMCAxIC41MTctMS4zNDFMMjEuNzQgNC42N0ExIDEgMCAwIDAgMjEgM0gzYTEgMSAwIDAgMC0uNzQyIDEuNjdsNy4yMjUgNy45ODlBMiAyIDAgMCAxIDEwIDE0eiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/funnel
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Rotate_ccw($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
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
   */
  const iconNode = [
    [
      "path",
      { "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }
    ],
    ["path", { "d": "M3 3v5h5" }]
  ];
  Icon($$renderer, spread_props([
    { name: "rotate-ccw" },
    $$sanitized_props,
    {
      /**
       * @component @name RotateCcw
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmE5IDkgMCAxIDAgOS05IDkuNzUgOS43NSAwIDAgMC02Ljc0IDIuNzRMMyA4IiAvPgogIDxwYXRoIGQ9Ik0zIDN2NWg1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/rotate-ccw
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Search($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
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
   */
  const iconNode = [
    ["path", { "d": "m21 21-4.34-4.34" }],
    ["circle", { "cx": "11", "cy": "11", "r": "8" }]
  ];
  Icon($$renderer, spread_props([
    { name: "search" },
    $$sanitized_props,
    {
      /**
       * @component @name Search
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMjEgMjEtNC4zNC00LjM0IiAvPgogIDxjaXJjbGUgY3g9IjExIiBjeT0iMTEiIHI9IjgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/search
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function X($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
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
   */
  const iconNode = [
    ["path", { "d": "M18 6 6 18" }],
    ["path", { "d": "m6 6 12 12" }]
  ];
  Icon($$renderer, spread_props([
    { name: "x" },
    $$sanitized_props,
    {
      /**
       * @component @name X
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggNiA2IDE4IiAvPgogIDxwYXRoIGQ9Im02IDYgMTIgMTIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/x
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    let txFormOpen = false;
    let showMobileFilters = false;
    let page = 1;
    let searchTerm = "";
    let typeFilter = "all";
    let dateFrom = void 0;
    let dateTo = void 0;
    function resetFilters() {
      searchTerm = "";
      typeFilter = "all";
      dateFrom = void 0;
      dateTo = void 0;
    }
    const query = createTransactionsPagedQuery(
      () => store_get($$store_subs ??= {}, "$auth", auth).user?.id,
      () => page,
      () => ({
        search: searchTerm || void 0,
        type: typeFilter === "all" ? void 0 : typeFilter,
        dateFrom: dateFrom?.toString(),
        dateTo: dateTo?.toString()
      }),
      () => page === 1 && !searchTerm && typeFilter === "all" && !dateFrom && !dateTo ? data.preloaded?.transactionsPaged : void 0
    );
    let transactions = derived(() => query.data?.data || []);
    let isLoading = derived(() => query.isLoading);
    let hasNextPage = derived(() => query.data ? query.data.page < query.data.totalPages : false);
    function loadMore() {
      if (hasNextPage()) {
        page += 1;
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      AppLayout($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="flex flex-col h-full animate-fade-in overflow-hidden"><div class="shrink-0 bg-background pb-4 pt-2 border-b border-border/40"><div class="flex items-center justify-between gap-4"><div class="min-w-0"><h1 class="font-display text-2xl sm:text-3xl font-bold text-foreground truncate">Transactions</h1> <p class="text-muted-foreground text-sm sm:text-base truncate hidden sm:block">View and manage your transaction history</p></div> <div class="flex items-center gap-2 shrink-0">`);
          Button($$renderer4, {
            variant: "ghost",
            size: "icon",
            onclick: () => showMobileFilters = !showMobileFilters,
            class: cn("lg:hidden h-10 w-10 transition-colors", showMobileFilters && "bg-primary/10 text-primary"),
            children: ($$renderer5) => {
              Funnel($$renderer5, { class: "h-5 w-5" });
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----> `);
          TransactionForm($$renderer4, {
            get open() {
              return txFormOpen;
            },
            set open($$value) {
              txFormOpen = $$value;
              $$settled = false;
            },
            children: ($$renderer5) => {
              Button($$renderer5, {
                onclick: () => txFormOpen = true,
                class: "hidden sm:flex h-10 w-auto px-3 sm:px-4 sm:h-10 gap-2 shadow-sm shrink-0",
                children: ($$renderer6) => {
                  Plus($$renderer6, { class: "h-4 w-4" });
                  $$renderer6.push(`<!----> <span class="inline sm:hidden">Add</span> <span class="hidden sm:inline">Add Transaction</span>`);
                },
                $$slots: { default: true }
              });
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----></div></div></div> <div${attr_class(clsx(cn("shrink-0 bg-background border-b border-border/40 overflow-hidden transition-all duration-300", showMobileFilters ? "pb-4 pt-4 h-auto opacity-100" : "h-0 lg:h-auto pb-0 pt-0 lg:pb-4 lg:pt-4 opacity-0 lg:opacity-100")))}><div class="flex flex-col lg:flex-row gap-3 items-start lg:items-center"><div class="relative w-full lg:flex-1 lg:min-w-[200px]">`);
          Search($$renderer4, {
            class: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          });
          $$renderer4.push(`<!----> `);
          Input($$renderer4, {
            placeholder: "Search...",
            class: "pl-9 pr-9 h-11 lg:h-10 w-full bg-muted/5 border-border/50 focus:bg-background transition-colors",
            get value() {
              return searchTerm;
            },
            set value($$value) {
              searchTerm = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          if (searchTerm) {
            $$renderer4.push("<!--[-->");
            $$renderer4.push(`<button class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1">`);
            X($$renderer4, { class: "h-4 w-4" });
            $$renderer4.push(`<!----></button>`);
          } else {
            $$renderer4.push("<!--[!-->");
          }
          $$renderer4.push(`<!--]--></div> <div class="flex items-center gap-2 w-full lg:w-auto"><div class="flex-1 lg:w-36 shrink-0">`);
          if (Root) {
            $$renderer4.push("<!--[-->");
            Root($$renderer4, {
              type: "single",
              get value() {
                return typeFilter;
              },
              set value($$value) {
                typeFilter = $$value;
                $$settled = false;
              },
              children: ($$renderer5) => {
                if (Select_trigger) {
                  $$renderer5.push("<!--[-->");
                  Select_trigger($$renderer5, {
                    class: "w-full h-11 lg:h-10 bg-muted/5 border-border/50",
                    children: ($$renderer6) => {
                      $$renderer6.push(`<span class="truncate">${escape_html(typeFilter === "all" ? "All Types" : typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1))}</span>`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push("<!--]-->");
                } else {
                  $$renderer5.push("<!--[!-->");
                  $$renderer5.push("<!--]-->");
                }
                $$renderer5.push(` `);
                if (Select_content) {
                  $$renderer5.push("<!--[-->");
                  Select_content($$renderer5, {
                    children: ($$renderer6) => {
                      if (Select_item) {
                        $$renderer6.push("<!--[-->");
                        Select_item($$renderer6, {
                          value: "all",
                          children: ($$renderer7) => {
                            $$renderer7.push(`<!---->All Types`);
                          },
                          $$slots: { default: true }
                        });
                        $$renderer6.push("<!--]-->");
                      } else {
                        $$renderer6.push("<!--[!-->");
                        $$renderer6.push("<!--]-->");
                      }
                      $$renderer6.push(` `);
                      if (Select_item) {
                        $$renderer6.push("<!--[-->");
                        Select_item($$renderer6, {
                          value: "income",
                          children: ($$renderer7) => {
                            $$renderer7.push(`<!---->Income`);
                          },
                          $$slots: { default: true }
                        });
                        $$renderer6.push("<!--]-->");
                      } else {
                        $$renderer6.push("<!--[!-->");
                        $$renderer6.push("<!--]-->");
                      }
                      $$renderer6.push(` `);
                      if (Select_item) {
                        $$renderer6.push("<!--[-->");
                        Select_item($$renderer6, {
                          value: "expense",
                          children: ($$renderer7) => {
                            $$renderer7.push(`<!---->Expense`);
                          },
                          $$slots: { default: true }
                        });
                        $$renderer6.push("<!--]-->");
                      } else {
                        $$renderer6.push("<!--[!-->");
                        $$renderer6.push("<!--]-->");
                      }
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push("<!--]-->");
                } else {
                  $$renderer5.push("<!--[!-->");
                  $$renderer5.push("<!--]-->");
                }
              },
              $$slots: { default: true }
            });
            $$renderer4.push("<!--]-->");
          } else {
            $$renderer4.push("<!--[!-->");
            $$renderer4.push("<!--]-->");
          }
          $$renderer4.push(`</div> <div class="flex items-center gap-1.5 flex-1 lg:flex-none">`);
          if (Root$1) {
            $$renderer4.push("<!--[-->");
            Root$1($$renderer4, {
              children: ($$renderer5) => {
                {
                  let child = function($$renderer6, { props }) {
                    Button($$renderer6, spread_props([
                      props,
                      {
                        variant: "outline",
                        class: cn("flex-1 lg:w-[130px] justify-start text-left font-normal h-11 lg:h-10 px-3 bg-muted/5 border-border/50", !dateFrom && "text-muted-foreground"),
                        children: ($$renderer7) => {
                          Calendar($$renderer7, { class: "mr-2 h-4 w-4 shrink-0" });
                          $$renderer7.push(`<!----> <span class="truncate">${escape_html(dateFrom ? format(dateFrom.toDate(getLocalTimeZone()), "MMM d") : "From")}</span>`);
                        },
                        $$slots: { default: true }
                      }
                    ]));
                  };
                  if (Trigger) {
                    $$renderer5.push("<!--[-->");
                    Trigger($$renderer5, { child, $$slots: { child: true } });
                    $$renderer5.push("<!--]-->");
                  } else {
                    $$renderer5.push("<!--[!-->");
                    $$renderer5.push("<!--]-->");
                  }
                }
                $$renderer5.push(` `);
                if (Popover_content) {
                  $$renderer5.push("<!--[-->");
                  Popover_content($$renderer5, {
                    class: "w-auto p-0",
                    align: "start",
                    children: ($$renderer6) => {
                      Calendar_1($$renderer6, {
                        type: "single",
                        get value() {
                          return dateFrom;
                        },
                        set value($$value) {
                          dateFrom = $$value;
                          $$settled = false;
                        }
                      });
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push("<!--]-->");
                } else {
                  $$renderer5.push("<!--[!-->");
                  $$renderer5.push("<!--]-->");
                }
              },
              $$slots: { default: true }
            });
            $$renderer4.push("<!--]-->");
          } else {
            $$renderer4.push("<!--[!-->");
            $$renderer4.push("<!--]-->");
          }
          $$renderer4.push(` `);
          if (Root$1) {
            $$renderer4.push("<!--[-->");
            Root$1($$renderer4, {
              children: ($$renderer5) => {
                {
                  let child = function($$renderer6, { props }) {
                    Button($$renderer6, spread_props([
                      props,
                      {
                        variant: "outline",
                        class: cn("flex-1 lg:w-[130px] justify-start text-left font-normal h-11 lg:h-10 px-3 bg-muted/5 border-border/50", !dateTo && "text-muted-foreground"),
                        children: ($$renderer7) => {
                          Calendar($$renderer7, { class: "mr-2 h-4 w-4 shrink-0" });
                          $$renderer7.push(`<!----> <span class="truncate">${escape_html(dateTo ? format(dateTo.toDate(getLocalTimeZone()), "MMM d") : "To")}</span>`);
                        },
                        $$slots: { default: true }
                      }
                    ]));
                  };
                  if (Trigger) {
                    $$renderer5.push("<!--[-->");
                    Trigger($$renderer5, { child, $$slots: { child: true } });
                    $$renderer5.push("<!--]-->");
                  } else {
                    $$renderer5.push("<!--[!-->");
                    $$renderer5.push("<!--]-->");
                  }
                }
                $$renderer5.push(` `);
                if (Popover_content) {
                  $$renderer5.push("<!--[-->");
                  Popover_content($$renderer5, {
                    class: "w-auto p-0",
                    align: "start",
                    children: ($$renderer6) => {
                      Calendar_1($$renderer6, {
                        type: "single",
                        get value() {
                          return dateTo;
                        },
                        set value($$value) {
                          dateTo = $$value;
                          $$settled = false;
                        }
                      });
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push("<!--]-->");
                } else {
                  $$renderer5.push("<!--[!-->");
                  $$renderer5.push("<!--]-->");
                }
              },
              $$slots: { default: true }
            });
            $$renderer4.push("<!--]-->");
          } else {
            $$renderer4.push("<!--[!-->");
            $$renderer4.push("<!--]-->");
          }
          $$renderer4.push(`</div> `);
          if (searchTerm || typeFilter !== "all" || dateFrom || dateTo) {
            $$renderer4.push("<!--[-->");
            Button($$renderer4, {
              variant: "ghost",
              size: "icon",
              onclick: resetFilters,
              class: "h-11 w-11 lg:h-10 lg:w-10 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
              title: "Reset Filters",
              children: ($$renderer5) => {
                Rotate_ccw($$renderer5, { class: "h-4 w-4" });
              },
              $$slots: { default: true }
            });
          } else {
            $$renderer4.push("<!--[!-->");
          }
          $$renderer4.push(`<!--]--></div></div></div> <div class="flex-1 overflow-y-auto pt-6 pb-6 w-full">`);
          if (Card) {
            $$renderer4.push("<!--[-->");
            Card($$renderer4, {
              class: "border-border/50 shadow-sm w-full",
              children: ($$renderer5) => {
                if (Card_content) {
                  $$renderer5.push("<!--[-->");
                  Card_content($$renderer5, {
                    class: "p-0",
                    children: ($$renderer6) => {
                      if (isLoading() && transactions().length === 0) {
                        $$renderer6.push("<!--[-->");
                        $$renderer6.push(`<div class="space-y-3 p-4"><!--[-->`);
                        const each_array = ensure_array_like(Array(5));
                        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                          each_array[$$index];
                          $$renderer6.push(`<div class="h-16 animate-pulse rounded-lg bg-muted"></div>`);
                        }
                        $$renderer6.push(`<!--]--></div>`);
                      } else if (transactions().length === 0) {
                        $$renderer6.push("<!--[1-->");
                        $$renderer6.push(`<div class="py-16 text-center"><p class="text-muted-foreground">No transactions found.</p></div>`);
                      } else {
                        $$renderer6.push("<!--[!-->");
                        $$renderer6.push(`<div class="divide-y divide-border/50"><!--[-->`);
                        const each_array_1 = ensure_array_like(transactions());
                        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                          let transaction = each_array_1[$$index_1];
                          $$renderer6.push(`<div class="p-4 sm:px-6 hover:bg-muted/30 transition-colors">`);
                          TransactionItem($$renderer6, { transaction });
                          $$renderer6.push(`<!----></div>`);
                        }
                        $$renderer6.push(`<!--]--></div>`);
                      }
                      $$renderer6.push(`<!--]--> `);
                      if (hasNextPage()) {
                        $$renderer6.push("<!--[-->");
                        $$renderer6.push(`<div class="p-4 border-t border-border/50 flex justify-center">`);
                        Button($$renderer6, {
                          variant: "outline",
                          onclick: loadMore,
                          disabled: isLoading(),
                          children: ($$renderer7) => {
                            $$renderer7.push(`<!---->${escape_html(isLoading() ? "Loading..." : "Load More")}`);
                          },
                          $$slots: { default: true }
                        });
                        $$renderer6.push(`<!----></div>`);
                      } else {
                        $$renderer6.push("<!--[!-->");
                      }
                      $$renderer6.push(`<!--]-->`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push("<!--]-->");
                } else {
                  $$renderer5.push("<!--[!-->");
                  $$renderer5.push("<!--]-->");
                }
              },
              $$slots: { default: true }
            });
            $$renderer4.push("<!--]-->");
          } else {
            $$renderer4.push("<!--[!-->");
            $$renderer4.push("<!--]-->");
          }
          $$renderer4.push(`</div></div>`);
        }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
