import { c as store_get, u as unsubscribe_stores, d as attr_class, m as stringify, k as escape_html, a as attr, e as ensure_array_like, n as derived } from "../../chunks/index2.js";
import { A as AppLayout, T as TransactionForm } from "../../chunks/AppLayout.js";
import { C as Card, a as Card_content, B as Button } from "../../chunks/card-content.js";
import { C as Card_description } from "../../chunks/card-description.js";
import "clsx";
import { C as Card_header, a as Card_title } from "../../chunks/card-title.js";
import { T as TransactionItem } from "../../chunks/TransactionItem.js";
import { f as formatCurrency } from "../../chunks/formatters.js";
import { o as onDestroy, p as preferencesStore } from "../../chunks/preferences.js";
import { c as createTransactionsQuery, a as createBudgetsQuery } from "../../chunks/data.js";
import { l as auth } from "../../chunks/auth.js";
import "chart.js/auto";
import { subDays, format, parseISO, isSameDay } from "date-fns";
import { P as Plus } from "../../chunks/plus.js";
function Chart_1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { type, data, options } = $$props;
    onDestroy(() => {
    });
    $$renderer2.push(`<canvas></canvas>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    let txFormOpen = false;
    let timeframe = "day";
    let chartUnits = 15;
    const transactionsQuery = createTransactionsQuery(() => store_get($$store_subs ??= {}, "$auth", auth).user?.id, data.preloaded?.transactions);
    createBudgetsQuery(() => store_get($$store_subs ??= {}, "$auth", auth).user?.id, data.preloaded?.budgets);
    let transactions = derived(() => transactionsQuery.data || []);
    let totalIncome = derived(() => transactions().filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0));
    let totalExpenses = derived(() => transactions().filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0));
    let balance = derived(() => totalIncome() - totalExpenses());
    let recentTransactions = derived(() => transactions().slice(0, 5));
    let pieChartData = derived(() => {
      const expenseTxs = transactions().filter((t) => t.type === "expense");
      const categoryMap = /* @__PURE__ */ new Map();
      expenseTxs.forEach((t) => {
        categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
      });
      const sorted = [...categoryMap.entries()].sort((a, b) => b[1] - a[1]);
      return {
        labels: sorted.map((item) => item[0]),
        datasets: [
          {
            data: sorted.map((item) => item[1]),
            backgroundColor: [
              "#3b82f6",
              "#10b981",
              "#f59e0b",
              "#ef4444",
              "#8b5cf6",
              "#06b6d4",
              "#f43f5e",
              "#ec4899",
              "#d946ef",
              "#a855f7",
              "#6366f1",
              "#0ea5e9",
              "#14b8a6",
              "#22c55e",
              "#84cc16",
              "#eab308",
              "#f97316"
            ],
            borderWidth: 0,
            hoverOffset: 4
          }
        ]
      };
    });
    let lineChartData = derived(() => {
      const units = Math.max(1, Math.min(15, chartUnits));
      const labels = [];
      const incomeData = [];
      const expenseData = [];
      const now = /* @__PURE__ */ new Date();
      for (let i = units - 1; i >= 0; i--) {
        let start;
        let label;
        let checkFn;
        {
          start = subDays(now, i);
          label = format(start, "MMM d");
          checkFn = isSameDay;
        }
        labels.push(label);
        const filteredTxs = transactions().filter((t) => checkFn(parseISO(t.date), start));
        incomeData.push(filteredTxs.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0));
        expenseData.push(filteredTxs.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0));
      }
      return {
        labels,
        datasets: [
          {
            label: "Income",
            data: incomeData,
            borderColor: "#10b981",
            backgroundColor: "#10b98133",
            fill: true,
            tension: 0.4
          },
          {
            label: "Expenses",
            data: expenseData,
            borderColor: "#ef4444",
            backgroundColor: "#ef444433",
            fill: true,
            tension: 0.4
          }
        ]
      };
    });
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      AppLayout($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="flex flex-col gap-6 animate-fade-in"><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="font-display text-3xl font-bold text-foreground">Dashboard</h1> <p class="text-muted-foreground mt-1">Overview of your recent financial activity</p></div> `);
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
                class: "hidden sm:flex gap-2",
                children: ($$renderer6) => {
                  Plus($$renderer6, { class: "h-4 w-4" });
                  $$renderer6.push(`<!----> New Transaction`);
                },
                $$slots: { default: true }
              });
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----></div> <div class="grid gap-4 md:grid-cols-3">`);
          if (Card) {
            $$renderer4.push("<!--[-->");
            Card($$renderer4, {
              children: ($$renderer5) => {
                if (Card_content) {
                  $$renderer5.push("<!--[-->");
                  Card_content($$renderer5, {
                    class: "p-6",
                    children: ($$renderer6) => {
                      $$renderer6.push(`<div class="flex items-center justify-between space-y-0 pb-2"><p class="text-sm font-medium leading-none">Total Balance</p></div> <div class="flex items-center gap-2"><div${attr_class(`text-2xl font-bold ${stringify(balance() >= 0 ? "text-foreground" : "text-expense")}`)}>${escape_html(formatCurrency(balance(), store_get($$store_subs ??= {}, "$preferencesStore", preferencesStore)))}</div></div>`);
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
          if (Card) {
            $$renderer4.push("<!--[-->");
            Card($$renderer4, {
              children: ($$renderer5) => {
                if (Card_content) {
                  $$renderer5.push("<!--[-->");
                  Card_content($$renderer5, {
                    class: "p-6",
                    children: ($$renderer6) => {
                      $$renderer6.push(`<div class="flex items-center justify-between space-y-0 pb-2"><p class="text-sm font-medium leading-none">Total Income</p></div> <div class="flex items-center gap-2"><div class="text-2xl font-bold text-income">+${escape_html(formatCurrency(totalIncome(), store_get($$store_subs ??= {}, "$preferencesStore", preferencesStore)))}</div></div>`);
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
          if (Card) {
            $$renderer4.push("<!--[-->");
            Card($$renderer4, {
              children: ($$renderer5) => {
                if (Card_content) {
                  $$renderer5.push("<!--[-->");
                  Card_content($$renderer5, {
                    class: "p-6",
                    children: ($$renderer6) => {
                      $$renderer6.push(`<div class="flex items-center justify-between space-y-0 pb-2"><p class="text-sm font-medium leading-none">Total Expenses</p></div> <div class="flex items-center gap-2"><div class="text-2xl font-bold text-expense">-${escape_html(formatCurrency(totalExpenses(), store_get($$store_subs ??= {}, "$preferencesStore", preferencesStore)))}</div></div>`);
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
          $$renderer4.push(`</div> <div class="grid gap-6 lg:grid-cols-3">`);
          if (Card) {
            $$renderer4.push("<!--[-->");
            Card($$renderer4, {
              class: "lg:col-span-2 shadow-sm border-border/50 overflow-hidden",
              children: ($$renderer5) => {
                if (Card_header) {
                  $$renderer5.push("<!--[-->");
                  Card_header($$renderer5, {
                    class: "flex flex-col sm:flex-row items-center justify-between pb-4 gap-4",
                    children: ($$renderer6) => {
                      $$renderer6.push(`<div class="space-y-1 w-full sm:w-auto">`);
                      if (Card_title) {
                        $$renderer6.push("<!--[-->");
                        Card_title($$renderer6, {
                          class: "text-xl",
                          children: ($$renderer7) => {
                            $$renderer7.push(`<!---->Financial Trends`);
                          },
                          $$slots: { default: true }
                        });
                        $$renderer6.push("<!--]-->");
                      } else {
                        $$renderer6.push("<!--[!-->");
                        $$renderer6.push("<!--]-->");
                      }
                      $$renderer6.push(` `);
                      if (Card_description) {
                        $$renderer6.push("<!--[-->");
                        Card_description($$renderer6, {
                          children: ($$renderer7) => {
                            $$renderer7.push(`<!---->Income vs Expenses over time`);
                          },
                          $$slots: { default: true }
                        });
                        $$renderer6.push("<!--]-->");
                      } else {
                        $$renderer6.push("<!--[!-->");
                        $$renderer6.push("<!--]-->");
                      }
                      $$renderer6.push(`</div> <div class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto bg-muted/40 p-2 rounded-xl border border-border/40"><div class="flex items-center gap-3 w-full sm:w-auto px-1 min-w-[140px]"><div class="flex flex-col gap-0.5"><span class="text-[10px] uppercase font-bold text-muted-foreground whitespace-nowrap leading-none">Range</span> <span class="text-[11px] font-bold text-primary leading-none">${escape_html(chartUnits)}
                                    ${escape_html(timeframe)}${escape_html("s")}</span></div> <input type="range" min="1" max="15"${attr("value", chartUnits)} class="flex-grow sm:w-24 h-1.5 bg-background rounded-full appearance-none cursor-pointer accent-primary border border-border/20 [&amp;::-webkit-slider-thumb]:appearance-none [&amp;::-webkit-slider-thumb]:w-3.5 [&amp;::-webkit-slider-thumb]:h-3.5 [&amp;::-webkit-slider-thumb]:bg-primary [&amp;::-webkit-slider-thumb]:rounded-full [&amp;::-webkit-slider-thumb]:border-2 [&amp;::-webkit-slider-thumb]:border-background [&amp;::-webkit-slider-thumb]:shadow-md [&amp;::-moz-range-thumb]:w-3.5 [&amp;::-moz-range-thumb]:h-3.5 [&amp;::-moz-range-thumb]:bg-primary [&amp;::-moz-range-thumb]:border-2 [&amp;::-moz-range-thumb]:border-background [&amp;::-moz-range-thumb]:rounded-full [&amp;::-moz-range-thumb]:shadow-md"/></div> <div class="hidden sm:block w-px h-6 bg-border/40"></div> <div class="flex items-center gap-1 w-full sm:w-auto bg-background/50 p-1 rounded-lg"><!--[-->`);
                      const each_array = ensure_array_like(["day", "week", "month"]);
                      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                        let t = each_array[$$index];
                        $$renderer6.push(`<button${attr_class(`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${stringify(timeframe === t ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]" : "text-muted-foreground hover:text-foreground hover:bg-muted")}`)}>${escape_html(t.charAt(0).toUpperCase() + t.slice(1))}</button>`);
                      }
                      $$renderer6.push(`<!--]--></div></div>`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push("<!--]-->");
                } else {
                  $$renderer5.push("<!--[!-->");
                  $$renderer5.push("<!--]-->");
                }
                $$renderer5.push(` `);
                if (Card_content) {
                  $$renderer5.push("<!--[-->");
                  Card_content($$renderer5, {
                    children: ($$renderer6) => {
                      $$renderer6.push(`<div class="h-[300px] w-full">`);
                      Chart_1($$renderer6, {
                        type: "line",
                        data: lineChartData(),
                        options: {}
                      });
                      $$renderer6.push(`<!----></div>`);
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
          if (Card) {
            $$renderer4.push("<!--[-->");
            Card($$renderer4, {
              class: "shadow-sm border-border/50 overflow-hidden",
              children: ($$renderer5) => {
                if (Card_header) {
                  $$renderer5.push("<!--[-->");
                  Card_header($$renderer5, {
                    children: ($$renderer6) => {
                      if (Card_title) {
                        $$renderer6.push("<!--[-->");
                        Card_title($$renderer6, {
                          class: "text-xl",
                          children: ($$renderer7) => {
                            $$renderer7.push(`<!---->Category Breakdown`);
                          },
                          $$slots: { default: true }
                        });
                        $$renderer6.push("<!--]-->");
                      } else {
                        $$renderer6.push("<!--[!-->");
                        $$renderer6.push("<!--]-->");
                      }
                      $$renderer6.push(` `);
                      if (Card_description) {
                        $$renderer6.push("<!--[-->");
                        Card_description($$renderer6, {
                          children: ($$renderer7) => {
                            $$renderer7.push(`<!---->Top expense categories`);
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
                $$renderer5.push(` `);
                if (Card_content) {
                  $$renderer5.push("<!--[-->");
                  Card_content($$renderer5, {
                    children: ($$renderer6) => {
                      $$renderer6.push(`<div class="h-[300px] w-full flex items-center justify-center">`);
                      if (pieChartData().labels.length > 0) {
                        $$renderer6.push("<!--[-->");
                        Chart_1($$renderer6, {
                          type: "doughnut",
                          data: pieChartData(),
                          options: {}
                        });
                      } else {
                        $$renderer6.push("<!--[!-->");
                        $$renderer6.push(`<div class="text-center py-12 text-muted-foreground italic">No expense data yet</div>`);
                      }
                      $$renderer6.push(`<!--]--></div>`);
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
          if (Card) {
            $$renderer4.push("<!--[-->");
            Card($$renderer4, {
              class: "lg:col-span-3 shadow-sm border-border/50",
              children: ($$renderer5) => {
                if (Card_header) {
                  $$renderer5.push("<!--[-->");
                  Card_header($$renderer5, {
                    children: ($$renderer6) => {
                      if (Card_title) {
                        $$renderer6.push("<!--[-->");
                        Card_title($$renderer6, {
                          class: "text-xl",
                          children: ($$renderer7) => {
                            $$renderer7.push(`<!---->Recent Transactions`);
                          },
                          $$slots: { default: true }
                        });
                        $$renderer6.push("<!--]-->");
                      } else {
                        $$renderer6.push("<!--[!-->");
                        $$renderer6.push("<!--]-->");
                      }
                      $$renderer6.push(` `);
                      if (Card_description) {
                        $$renderer6.push("<!--[-->");
                        Card_description($$renderer6, {
                          children: ($$renderer7) => {
                            $$renderer7.push(`<!---->Your 5 most recent activities`);
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
                $$renderer5.push(` `);
                if (Card_content) {
                  $$renderer5.push("<!--[-->");
                  Card_content($$renderer5, {
                    children: ($$renderer6) => {
                      if (recentTransactions().length === 0) {
                        $$renderer6.push("<!--[-->");
                        $$renderer6.push(`<div class="py-12 text-center text-muted-foreground">No recent transactions found</div>`);
                      } else {
                        $$renderer6.push("<!--[!-->");
                        $$renderer6.push(`<div class="space-y-1"><!--[-->`);
                        const each_array_1 = ensure_array_like(recentTransactions());
                        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                          let transaction = each_array_1[$$index_1];
                          $$renderer6.push(`<div class="px-2 py-1 rounded-lg hover:bg-muted/30 transition-colors">`);
                          TransactionItem($$renderer6, { transaction });
                          $$renderer6.push(`<!----></div>`);
                        }
                        $$renderer6.push(`<!--]--></div>`);
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
