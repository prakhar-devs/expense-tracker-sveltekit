import { s as sanitize_props, i as spread_props, j as slot, o as element, b as bind_props, l as attributes, g as clsx, c as store_get, k as escape_html, e as ensure_array_like, d as attr_class, m as stringify, u as unsubscribe_stores } from "../../../chunks/index2.js";
import { format, parseISO } from "date-fns";
import { I as Icon, c as cn, C as Card, a as Card_content, B as Button } from "../../../chunks/card-content.js";
import "clsx";
import { tv } from "tailwind-variants";
import { R as Root, T as Trigger, A as Alert_dialog_content, a as Alert_dialog_header, b as Alert_dialog_title, c as Alert_dialog_description, d as Alert_dialog_footer, e as Alert_dialog_cancel, f as Alert_dialog_action } from "../../../chunks/index3.js";
import { b as createRecurringTransactionsQuery, h as createUpdateRecurringMutation, i as createDeleteRecurringMutation } from "../../../chunks/data.js";
import { p as preferencesStore } from "../../../chunks/preferences.js";
import { f as formatCurrency } from "../../../chunks/formatters.js";
import { A as AppLayout, T as TransactionForm, R as Refresh_cw } from "../../../chunks/AppLayout.js";
import { l as auth } from "../../../chunks/auth.js";
import { P as Plus } from "../../../chunks/plus.js";
import { T as Trash_2 } from "../../../chunks/trash-2.js";
function Pause($$renderer, $$props) {
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
      "rect",
      { "x": "14", "y": "3", "width": "5", "height": "18", "rx": "1" }
    ],
    [
      "rect",
      { "x": "5", "y": "3", "width": "5", "height": "18", "rx": "1" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "pause" },
    $$sanitized_props,
    {
      /**
       * @component @name Pause
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB4PSIxNCIgeT0iMyIgd2lkdGg9IjUiIGhlaWdodD0iMTgiIHJ4PSIxIiAvPgogIDxyZWN0IHg9IjUiIHk9IjMiIHdpZHRoPSI1IiBoZWlnaHQ9IjE4IiByeD0iMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/pause
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
function Play($$renderer, $$props) {
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
        "d": "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "play" },
    $$sanitized_props,
    {
      /**
       * @component @name Play
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSA1YTIgMiAwIDAgMSAzLjAwOC0xLjcyOGwxMS45OTcgNi45OThhMiAyIDAgMCAxIC4wMDMgMy40NThsLTEyIDdBMiAyIDAgMCAxIDUgMTl6IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/play
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
const badgeVariants = tv({
  base: "focus:ring-ring inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/80 border-transparent",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent",
      outline: "text-foreground"
    }
  },
  defaultVariants: { variant: "default" }
});
function Badge($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      href,
      class: className,
      variant = "default",
      children,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    element(
      $$renderer2,
      href ? "a" : "span",
      () => {
        $$renderer2.push(`${attributes({
          href,
          class: clsx(cn(badgeVariants({ variant }), className)),
          ...restProps
        })}`);
      },
      () => {
        children?.($$renderer2);
        $$renderer2.push(`<!---->`);
      }
    );
    bind_props($$props, { ref });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let rules, isLoading, active, paused;
    let data = $$props["data"];
    const recurringQuery = createRecurringTransactionsQuery(() => store_get($$store_subs ??= {}, "$auth", auth).user?.id, data.preloaded?.recurring);
    const updateRecurring = createUpdateRecurringMutation();
    const deleteRecurring = createDeleteRecurringMutation();
    const FREQ_LABELS = {
      daily: "Every day",
      weekly: "Every week",
      monthly: "Every month",
      yearly: "Every year"
    };
    function toggle(id, is_active) {
      updateRecurring.mutate({ id, is_active: !is_active });
    }
    rules = recurringQuery.data || data.preloaded?.recurring || [];
    isLoading = recurringQuery.isLoading && rules.length === 0;
    active = rules.filter((r) => r.is_active);
    paused = rules.filter((r) => !r.is_active);
    AppLayout($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex flex-col h-full animate-fade-in overflow-hidden"><div class="shrink-0 bg-background pb-4 pt-2 border-b border-border/40"><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="font-display text-3xl font-bold text-foreground">Recurring Transactions</h1> <p class="text-muted-foreground">${escape_html(active.length)} active rule${escape_html(active.length !== 1 ? "s" : "")}</p></div> `);
        TransactionForm($$renderer3, {
          children: ($$renderer4) => {
            Button($$renderer4, {
              class: "gap-2",
              children: ($$renderer5) => {
                Plus($$renderer5, { class: "h-4 w-4" });
                $$renderer5.push(`<!----> New Recurring`);
              },
              $$slots: { default: true }
            });
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div></div> <div class="flex-1 overflow-y-auto pt-6 pb-6 space-y-6">`);
        if (isLoading) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="space-y-3"><!--[-->`);
          const each_array = ensure_array_like([1, 2, 3]);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            each_array[$$index];
            $$renderer3.push(`<div class="h-24 animate-pulse rounded-lg bg-muted"></div>`);
          }
          $$renderer3.push(`<!--]--></div>`);
        } else if (!rules.length) {
          $$renderer3.push("<!--[1-->");
          Card($$renderer3, {
            class: "border-dashed border-border",
            children: ($$renderer4) => {
              Card_content($$renderer4, {
                class: "flex flex-col items-center justify-center py-16 text-center gap-3",
                children: ($$renderer5) => {
                  Refresh_cw($$renderer5, { class: "h-10 w-10 text-muted-foreground/40" });
                  $$renderer5.push(`<!----> <p class="font-medium text-muted-foreground">No recurring transactions</p> <p class="text-sm text-muted-foreground/70">Create a transaction and toggle "Make this
                            recurring"</p>`);
                },
                $$slots: { default: true }
              });
            },
            $$slots: { default: true }
          });
        } else {
          $$renderer3.push("<!--[!-->");
          if (active.length > 0) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div><h2 class="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Active</h2> <div class="space-y-3"><!--[-->`);
            const each_array_1 = ensure_array_like(active);
            for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
              let rule = each_array_1[$$index_1];
              Card($$renderer3, {
                class: "border-border/50 shadow-sm",
                children: ($$renderer4) => {
                  Card_content($$renderer4, {
                    class: "p-4",
                    children: ($$renderer5) => {
                      $$renderer5.push(`<div class="flex items-start justify-between gap-4"><div class="flex items-start gap-3 min-w-0"><div${attr_class(`mt-0.5 rounded-full p-1.5 ${stringify(rule.type === "income" ? "bg-income/10" : "bg-expense/10")}`)}>`);
                      Refresh_cw($$renderer5, {
                        class: `h-4 w-4 ${stringify(rule.type === "income" ? "text-income" : "text-expense")}`
                      });
                      $$renderer5.push(`<!----></div> <div class="min-w-0"><div class="flex items-center gap-2 flex-wrap"><span class="font-semibold text-foreground">${escape_html(rule.category)}</span> `);
                      Badge($$renderer5, {
                        variant: "default",
                        class: "text-xs",
                        children: ($$renderer6) => {
                          $$renderer6.push(`<!---->Active`);
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----> `);
                      Badge($$renderer5, {
                        variant: "outline",
                        class: "text-xs",
                        children: ($$renderer6) => {
                          $$renderer6.push(`<!---->${escape_html(FREQ_LABELS[rule.frequency])}`);
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----></div> <p${attr_class(`text-lg font-bold mt-0.5 ${stringify(rule.type === "income" ? "text-income" : "text-expense")}`)}>${escape_html(rule.type === "expense" ? "−" : "+")}${escape_html(formatCurrency(rule.amount, store_get($$store_subs ??= {}, "$preferencesStore", preferencesStore)))}</p> <div class="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground mt-1"><span>Next: ${escape_html(format(parseISO(rule.next_run_date), "MMM d, yyyy"))}</span> <span>Runs: ${escape_html(rule.occurrences_created)}
                                                            time${escape_html(rule.occurrences_created !== 1 ? "s" : "")}</span> `);
                      if (rule.end_date) {
                        $$renderer5.push("<!--[-->");
                        $$renderer5.push(`<span>Until: ${escape_html(format(parseISO(rule.end_date), "MMM d, yyyy"))}</span>`);
                      } else {
                        $$renderer5.push("<!--[!-->");
                      }
                      $$renderer5.push(`<!--]--> `);
                      if (rule.max_occurrences) {
                        $$renderer5.push("<!--[-->");
                        $$renderer5.push(`<span>Max: ${escape_html(rule.max_occurrences)}</span>`);
                      } else {
                        $$renderer5.push("<!--[!-->");
                      }
                      $$renderer5.push(`<!--]--></div> `);
                      if (rule.note) {
                        $$renderer5.push("<!--[-->");
                        $$renderer5.push(`<p class="text-xs text-muted-foreground/70 mt-0.5 truncate">${escape_html(rule.note)}</p>`);
                      } else {
                        $$renderer5.push("<!--[!-->");
                      }
                      $$renderer5.push(`<!--]--></div></div> <div class="flex items-center gap-1 shrink-0">`);
                      Button($$renderer5, {
                        variant: "ghost",
                        size: "icon",
                        class: "h-8 w-8",
                        onclick: () => toggle(rule.id, rule.is_active),
                        title: "Pause",
                        children: ($$renderer6) => {
                          Pause($$renderer6, { class: "h-4 w-4" });
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----> `);
                      Root($$renderer5, {
                        children: ($$renderer6) => {
                          {
                            let child = function($$renderer7, { props }) {
                              Button($$renderer7, spread_props([
                                props,
                                {
                                  variant: "ghost",
                                  size: "icon",
                                  class: "h-8 w-8 text-destructive hover:text-destructive",
                                  children: ($$renderer8) => {
                                    Trash_2($$renderer8, { class: "h-4 w-4" });
                                  },
                                  $$slots: { default: true }
                                }
                              ]));
                            };
                            Trigger($$renderer6, { child, $$slots: { child: true } });
                          }
                          $$renderer6.push(`<!----> `);
                          Alert_dialog_content($$renderer6, {
                            children: ($$renderer7) => {
                              Alert_dialog_header($$renderer7, {
                                children: ($$renderer8) => {
                                  Alert_dialog_title($$renderer8, {
                                    children: ($$renderer9) => {
                                      $$renderer9.push(`<!---->Delete
                                                                recurring rule?`);
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$renderer8.push(`<!----> `);
                                  Alert_dialog_description($$renderer8, {
                                    children: ($$renderer9) => {
                                      $$renderer9.push(`<!---->This will stop
                                                                future automatic
                                                                transactions.
                                                                Past
                                                                transactions
                                                                will not be
                                                                affected.`);
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$renderer8.push(`<!---->`);
                                },
                                $$slots: { default: true }
                              });
                              $$renderer7.push(`<!----> `);
                              Alert_dialog_footer($$renderer7, {
                                children: ($$renderer8) => {
                                  Alert_dialog_cancel($$renderer8, {
                                    children: ($$renderer9) => {
                                      $$renderer9.push(`<!---->Cancel`);
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$renderer8.push(`<!----> `);
                                  Alert_dialog_action($$renderer8, {
                                    onclick: () => deleteRecurring.mutate(rule.id),
                                    class: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                                    children: ($$renderer9) => {
                                      $$renderer9.push(`<!---->Delete`);
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$renderer8.push(`<!---->`);
                                },
                                $$slots: { default: true }
                              });
                              $$renderer7.push(`<!---->`);
                            },
                            $$slots: { default: true }
                          });
                          $$renderer6.push(`<!---->`);
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----></div></div>`);
                    },
                    $$slots: { default: true }
                  });
                },
                $$slots: { default: true }
              });
            }
            $$renderer3.push(`<!--]--></div></div>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--> `);
          if (paused.length > 0) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div><h2 class="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Paused</h2> <div class="space-y-3"><!--[-->`);
            const each_array_2 = ensure_array_like(paused);
            for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
              let rule = each_array_2[$$index_2];
              Card($$renderer3, {
                class: "border-border/50 shadow-sm opacity-75",
                children: ($$renderer4) => {
                  Card_content($$renderer4, {
                    class: "p-4",
                    children: ($$renderer5) => {
                      $$renderer5.push(`<div class="flex items-start justify-between gap-4"><div class="flex items-start gap-3 min-w-0"><div${attr_class(`mt-0.5 rounded-full p-1.5 ${stringify(rule.type === "income" ? "bg-income/10" : "bg-expense/10")}`)}>`);
                      Refresh_cw($$renderer5, {
                        class: `h-4 w-4 ${stringify(rule.type === "income" ? "text-income" : "text-expense")}`
                      });
                      $$renderer5.push(`<!----></div> <div class="min-w-0"><div class="flex items-center gap-2 flex-wrap"><span class="font-semibold text-foreground">${escape_html(rule.category)}</span> `);
                      Badge($$renderer5, {
                        variant: "secondary",
                        class: "text-xs",
                        children: ($$renderer6) => {
                          $$renderer6.push(`<!---->Paused`);
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----> `);
                      Badge($$renderer5, {
                        variant: "outline",
                        class: "text-xs",
                        children: ($$renderer6) => {
                          $$renderer6.push(`<!---->${escape_html(FREQ_LABELS[rule.frequency])}`);
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----></div> <p${attr_class(`text-lg font-bold mt-0.5 ${stringify(rule.type === "income" ? "text-income" : "text-expense")}`)}>${escape_html(rule.type === "expense" ? "−" : "+")}${escape_html(formatCurrency(rule.amount, store_get($$store_subs ??= {}, "$preferencesStore", preferencesStore)))}</p> <div class="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground mt-1"><span>Next: ${escape_html(format(parseISO(rule.next_run_date), "MMM d, yyyy"))}</span> <span>Runs: ${escape_html(rule.occurrences_created)}
                                                            time${escape_html(rule.occurrences_created !== 1 ? "s" : "")}</span> `);
                      if (rule.end_date) {
                        $$renderer5.push("<!--[-->");
                        $$renderer5.push(`<span>Until: ${escape_html(format(parseISO(rule.end_date), "MMM d, yyyy"))}</span>`);
                      } else {
                        $$renderer5.push("<!--[!-->");
                      }
                      $$renderer5.push(`<!--]--> `);
                      if (rule.max_occurrences) {
                        $$renderer5.push("<!--[-->");
                        $$renderer5.push(`<span>Max: ${escape_html(rule.max_occurrences)}</span>`);
                      } else {
                        $$renderer5.push("<!--[!-->");
                      }
                      $$renderer5.push(`<!--]--></div> `);
                      if (rule.note) {
                        $$renderer5.push("<!--[-->");
                        $$renderer5.push(`<p class="text-xs text-muted-foreground/70 mt-0.5 truncate">${escape_html(rule.note)}</p>`);
                      } else {
                        $$renderer5.push("<!--[!-->");
                      }
                      $$renderer5.push(`<!--]--></div></div> <div class="flex items-center gap-1 shrink-0">`);
                      Button($$renderer5, {
                        variant: "ghost",
                        size: "icon",
                        class: "h-8 w-8",
                        onclick: () => toggle(rule.id, rule.is_active),
                        title: "Resume",
                        children: ($$renderer6) => {
                          Play($$renderer6, { class: "h-4 w-4" });
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----> `);
                      Root($$renderer5, {
                        children: ($$renderer6) => {
                          {
                            let child = function($$renderer7, { props }) {
                              Button($$renderer7, spread_props([
                                props,
                                {
                                  variant: "ghost",
                                  size: "icon",
                                  class: "h-8 w-8 text-destructive hover:text-destructive",
                                  children: ($$renderer8) => {
                                    Trash_2($$renderer8, { class: "h-4 w-4" });
                                  },
                                  $$slots: { default: true }
                                }
                              ]));
                            };
                            Trigger($$renderer6, { child, $$slots: { child: true } });
                          }
                          $$renderer6.push(`<!----> `);
                          Alert_dialog_content($$renderer6, {
                            children: ($$renderer7) => {
                              Alert_dialog_header($$renderer7, {
                                children: ($$renderer8) => {
                                  Alert_dialog_title($$renderer8, {
                                    children: ($$renderer9) => {
                                      $$renderer9.push(`<!---->Delete
                                                                recurring rule?`);
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$renderer8.push(`<!----> `);
                                  Alert_dialog_description($$renderer8, {
                                    children: ($$renderer9) => {
                                      $$renderer9.push(`<!---->This will stop
                                                                future automatic
                                                                transactions.
                                                                Past
                                                                transactions
                                                                will not be
                                                                affected.`);
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$renderer8.push(`<!---->`);
                                },
                                $$slots: { default: true }
                              });
                              $$renderer7.push(`<!----> `);
                              Alert_dialog_footer($$renderer7, {
                                children: ($$renderer8) => {
                                  Alert_dialog_cancel($$renderer8, {
                                    children: ($$renderer9) => {
                                      $$renderer9.push(`<!---->Cancel`);
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$renderer8.push(`<!----> `);
                                  Alert_dialog_action($$renderer8, {
                                    onclick: () => deleteRecurring.mutate(rule.id),
                                    class: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                                    children: ($$renderer9) => {
                                      $$renderer9.push(`<!---->Delete`);
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$renderer8.push(`<!---->`);
                                },
                                $$slots: { default: true }
                              });
                              $$renderer7.push(`<!---->`);
                            },
                            $$slots: { default: true }
                          });
                          $$renderer6.push(`<!---->`);
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----></div></div>`);
                    },
                    $$slots: { default: true }
                  });
                },
                $$slots: { default: true }
              });
            }
            $$renderer3.push(`<!--]--></div></div>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]--></div></div>`);
      }
    });
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
