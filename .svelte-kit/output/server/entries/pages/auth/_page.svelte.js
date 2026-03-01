import { k as escape_html } from "../../../chunks/index2.js";
import "clsx";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import "../../../chunks/supabaseClient.js";
import { C as Card, a as Card_content, B as Button } from "../../../chunks/card-content.js";
import { D as Dollar_sign, L as Label, I as Input } from "../../../chunks/label.js";
import { C as Card_description } from "../../../chunks/card-description.js";
import { C as Card_header, a as Card_title } from "../../../chunks/card-title.js";
import "../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let email = "";
    let password = "";
    let loading = false;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="flex min-h-screen items-center justify-center bg-background p-4"><div class="w-full max-w-md animate-fade-in"><div class="mb-8 flex items-center justify-center gap-3"><div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">`);
      Dollar_sign($$renderer3, { class: "h-7 w-7 text-primary-foreground" });
      $$renderer3.push(`<!----></div> <h1 class="font-display text-3xl font-bold text-foreground">SpendWise</h1></div> `);
      if (Card) {
        $$renderer3.push("<!--[-->");
        Card($$renderer3, {
          class: "border-border/50 shadow-lg",
          children: ($$renderer4) => {
            if (Card_header) {
              $$renderer4.push("<!--[-->");
              Card_header($$renderer4, {
                class: "text-center",
                children: ($$renderer5) => {
                  if (Card_title) {
                    $$renderer5.push("<!--[-->");
                    Card_title($$renderer5, {
                      class: "font-display text-2xl",
                      children: ($$renderer6) => {
                        $$renderer6.push(`<!---->${escape_html("Welcome back")}`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer5.push("<!--]-->");
                  } else {
                    $$renderer5.push("<!--[!-->");
                    $$renderer5.push("<!--]-->");
                  }
                  $$renderer5.push(` `);
                  if (Card_description) {
                    $$renderer5.push("<!--[-->");
                    Card_description($$renderer5, {
                      children: ($$renderer6) => {
                        $$renderer6.push(`<!---->${escape_html(
                          "Sign in to manage your finances"
                        )}`);
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
            if (Card_content) {
              $$renderer4.push("<!--[-->");
              Card_content($$renderer4, {
                children: ($$renderer5) => {
                  $$renderer5.push(`<form class="space-y-4">`);
                  {
                    $$renderer5.push("<!--[!-->");
                  }
                  $$renderer5.push(`<!--]--> <div class="space-y-2">`);
                  Label($$renderer5, {
                    for: "email",
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->Email`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  Input($$renderer5, {
                    id: "email",
                    type: "email",
                    placeholder: "you@example.com",
                    required: true,
                    get value() {
                      return email;
                    },
                    set value($$value) {
                      email = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer5.push(`<!----></div> <div class="space-y-2">`);
                  Label($$renderer5, {
                    for: "password",
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->Password`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  Input($$renderer5, {
                    id: "password",
                    type: "password",
                    placeholder: "••••••••",
                    required: true,
                    minlength: 6,
                    get value() {
                      return password;
                    },
                    set value($$value) {
                      password = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer5.push(`<!----></div> `);
                  Button($$renderer5, {
                    type: "submit",
                    class: "w-full bg-blue-600 hover:bg-blue-700 text-white",
                    disabled: loading,
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->${escape_html("Sign In")}`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----></form> <div class="mt-4 text-center text-sm text-muted-foreground">${escape_html("Don't have an account?")}
                      <button type="button" class="font-medium text-primary underline-offset-4 hover:underline">${escape_html("Sign up")}</button></div>`);
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
      $$renderer3.push(`</div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
export {
  _page as default
};
