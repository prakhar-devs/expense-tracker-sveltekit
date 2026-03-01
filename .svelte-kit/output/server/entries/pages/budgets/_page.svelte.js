import { n as derived, l as attributes, b as bind_props, i as spread_props, d as attr_class, g as clsx, h as attr_style, c as store_get, e as ensure_array_like, k as escape_html, m as stringify, u as unsubscribe_stores } from "../../../chunks/index2.js";
import { A as AppLayout } from "../../../chunks/AppLayout.js";
import { c as cn, B as Button, C as Card, a as Card_content } from "../../../chunks/card-content.js";
import "clsx";
import { C as Card_header, a as Card_title } from "../../../chunks/card-title.js";
import { f as formatCurrency } from "../../../chunks/formatters.js";
import { p as preferencesStore } from "../../../chunks/preferences.js";
import { u as useRefById, a as useId, b as box, m as mergeProps } from "../../../chunks/label.js";
import "style-to-object";
import { a as createBudgetsQuery, c as createTransactionsQuery } from "../../../chunks/data.js";
import { l as auth } from "../../../chunks/auth.js";
import { P as Plus } from "../../../chunks/plus.js";
const ROOT_ATTR = "data-progress-root";
class ProgressRootState {
  opts;
  constructor(opts) {
    this.opts = opts;
    useRefById(opts);
  }
  #props = derived(() => ({
    role: "progressbar",
    value: this.opts.value.current,
    "aria-valuemin": this.opts.min.current,
    "aria-valuemax": this.opts.max.current,
    "aria-valuenow": this.opts.value.current === null ? void 0 : this.opts.value.current,
    "data-value": this.opts.value.current === null ? void 0 : this.opts.value.current,
    "data-state": getProgressDataState(this.opts.value.current, this.opts.max.current),
    "data-max": this.opts.max.current,
    "data-min": this.opts.min.current,
    "data-indeterminate": this.opts.value.current === null ? "" : void 0,
    [ROOT_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
function getProgressDataState(value, max) {
  if (value === null) return "indeterminate";
  return value === max ? "loaded" : "loading";
}
function useProgressRootState(props) {
  return new ProgressRootState(props);
}
function Progress$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      child,
      children,
      value = 0,
      max = 100,
      min = 0,
      id = useId(),
      ref = null,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const rootState = useProgressRootState({
      value: box.with(() => value),
      max: box.with(() => max),
      min: box.with(() => min),
      id: box.with(() => id),
      ref: box.with(() => ref, (v) => ref = v)
    });
    const mergedProps = derived(() => mergeProps(restProps, rootState.props));
    if (child) {
      $$renderer2.push("<!--[-->");
      child($$renderer2, { props: mergedProps() });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div${attributes({ ...mergedProps() })}>`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref });
  });
}
function Progress($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      indicatorClass,
      max = 100,
      value,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (Progress$1) {
        $$renderer3.push("<!--[-->");
        Progress$1($$renderer3, spread_props([
          {
            class: cn("bg-secondary relative h-4 w-full overflow-hidden rounded-full", className),
            value,
            max
          },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            },
            children: ($$renderer4) => {
              $$renderer4.push(`<div${attr_class(clsx(cn("h-full w-full flex-1 transition-all", indicatorClass ?? "bg-primary")))}${attr_style(`transform: translateX(-${100 - 100 * (value ?? 0) / (max ?? 1)}%)`)}></div>`);
            },
            $$slots: { default: true }
          }
        ]));
        $$renderer3.push("<!--]-->");
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push("<!--]-->");
      }
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { ref });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const budgetsQuery = createBudgetsQuery(() => store_get($$store_subs ??= {}, "$auth", auth).user?.id, data.preloaded?.budgets);
    const transactionsQuery = createTransactionsQuery(() => store_get($$store_subs ??= {}, "$auth", auth).user?.id, data.preloaded?.transactions);
    let budgets = derived(() => budgetsQuery.data || []);
    let transactions = derived(() => transactionsQuery.data || []);
    function getSpentAmount(category) {
      return transactions().filter((t) => t.category === category && t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    }
    let budgetStats = derived(() => budgets().map((budget) => {
      const spent = getSpentAmount(budget.category);
      const progress = budget.budget_amount > 0 ? spent / budget.budget_amount * 100 : 0;
      return {
        ...budget,
        spent,
        remaining: Math.max(0, budget.budget_amount - spent),
        progress: Math.min(100, progress)
      };
    }));
    AppLayout($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex flex-col h-full animate-fade-in overflow-hidden"><div class="shrink-0 bg-background pb-4 pt-2 border-b border-border/40"><div class="flex items-center justify-between gap-4 sm:flex-row sm:items-center sm:justify-between"><div class="min-w-0"><h1 class="font-display text-2xl sm:text-3xl font-bold text-foreground truncate">Budgets</h1> <p class="text-muted-foreground text-sm sm:text-base truncate hidden sm:block">Manage your spending limits</p></div> `);
        Button($$renderer3, {
          class: "gap-2 shrink-0",
          children: ($$renderer4) => {
            Plus($$renderer4, { class: "h-4 w-4" });
            $$renderer4.push(`<!----> <span class="hidden sm:inline">New Budget</span> <span class="inline sm:hidden">New</span>`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div></div> <div class="flex-1 overflow-y-auto pt-6 pb-6 w-full">`);
        if (budgetStats().length === 0) {
          $$renderer3.push("<!--[-->");
          if (Card) {
            $$renderer3.push("<!--[-->");
            Card($$renderer3, {
              class: "border-dashed border-border/50 max-w-4xl mx-auto",
              children: ($$renderer4) => {
                if (Card_content) {
                  $$renderer4.push("<!--[-->");
                  Card_content($$renderer4, {
                    class: "flex flex-col items-center justify-center py-16 text-center",
                    children: ($$renderer5) => {
                      $$renderer5.push(`<p class="text-muted-foreground mb-4">You haven't set up any budgets yet.</p> `);
                      Button($$renderer5, {
                        variant: "outline",
                        children: ($$renderer6) => {
                          $$renderer6.push(`<!---->Create your first budget`);
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!---->`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer4.push("<!--]-->");
                } else {
                  $$renderer4.push("<!--[!-->");
                  $$renderer4.push("<!--]-->");
                }
              },
              $$slots: { default: true }
            });
            $$renderer3.push("<!--]-->");
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push("<!--]-->");
          }
        } else {
          $$renderer3.push("<!--[!-->");
          $$renderer3.push(`<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"><!--[-->`);
          const each_array = ensure_array_like(budgetStats());
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let budget = each_array[$$index];
            if (Card) {
              $$renderer3.push("<!--[-->");
              Card($$renderer3, {
                class: "border-border/50 shadow-sm overflow-hidden flex flex-col",
                children: ($$renderer4) => {
                  if (Card_header) {
                    $$renderer4.push("<!--[-->");
                    Card_header($$renderer4, {
                      class: "pb-2",
                      children: ($$renderer5) => {
                        $$renderer5.push(`<div class="flex justify-between items-start">`);
                        if (Card_title) {
                          $$renderer5.push("<!--[-->");
                          Card_title($$renderer5, {
                            class: "text-xl",
                            children: ($$renderer6) => {
                              $$renderer6.push(`<!---->${escape_html(budget.category)}`);
                            },
                            $$slots: { default: true }
                          });
                          $$renderer5.push("<!--]-->");
                        } else {
                          $$renderer5.push("<!--[!-->");
                          $$renderer5.push("<!--]-->");
                        }
                        $$renderer5.push(` <span class="text-xs font-medium px-2 py-1 rounded-full bg-muted">${escape_html(budget.period_type)}</span></div>`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer4.push("<!--]-->");
                  } else {
                    $$renderer4.push("<!--[!-->");
                    $$renderer4.push("<!--]-->");
                  }
                  $$renderer4.push(` `);
                  if (Card_content) {
                    $$renderer4.push("<!--[-->");
                    Card_content($$renderer4, {
                      class: "space-y-4 flex-1",
                      children: ($$renderer5) => {
                        $$renderer5.push(`<div class="space-y-2"><div class="flex justify-between text-sm"><span class="text-muted-foreground">Spent</span> <span class="font-semibold text-foreground">${escape_html(formatCurrency(budget.spent, store_get($$store_subs ??= {}, "$preferencesStore", preferencesStore)))}</span></div> `);
                        Progress($$renderer5, {
                          value: budget.progress,
                          class: "h-2",
                          indicatorClass: budget.progress < 20 ? "bg-income" : budget.progress <= 70 ? "bg-warning" : "bg-expense"
                        });
                        $$renderer5.push(`<!----> <div class="flex justify-between text-xs text-muted-foreground"><span>${escape_html(budget.progress.toFixed(0))}% used</span> <span>of ${escape_html(formatCurrency(budget.budget_amount, store_get($$store_subs ??= {}, "$preferencesStore", preferencesStore)))}</span></div></div>`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer4.push("<!--]-->");
                  } else {
                    $$renderer4.push("<!--[!-->");
                    $$renderer4.push("<!--]-->");
                  }
                  $$renderer4.push(` <div class="border-t border-border/50 flex justify-between items-center bg-muted/20 p-4 px-6"><span class="text-xs text-muted-foreground uppercase font-semibold">Remaining</span> <span${attr_class(`text-lg font-bold ${stringify(budget.remaining > 0 ? "text-income" : "text-expense")}`)}>${escape_html(formatCurrency(budget.remaining, store_get($$store_subs ??= {}, "$preferencesStore", preferencesStore)))}</span></div>`);
                },
                $$slots: { default: true }
              });
              $$renderer3.push("<!--]-->");
            } else {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push("<!--]-->");
            }
          }
          $$renderer3.push(`<!--]--></div>`);
        }
        $$renderer3.push(`<!--]--></div></div>`);
      }
    });
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
