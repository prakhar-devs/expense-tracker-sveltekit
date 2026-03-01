import { b as bind_props, l as attributes, m as derived, i as spread_props, g as clsx } from "./index2.js";
import { c as cn } from "./utils2.js";
import { n as noop, x as useDialogRoot, y as useAlertDialogAction, z as useAlertDialogCancel, D as useDialogContent, F as Presence_layer, G as Focus_scope, J as afterTick, K as shouldTrapFocus, L as Escape_layer, M as Dismissible_layer, N as Text_selection_layer, O as Scroll_lock, Q as useDialogTrigger, V as useDialogDescription, W as Dialog_title, X as Dialog_overlay, Y as Portal } from "./AppLayout.js";
import { b as buttonVariants } from "./card-content.js";
import { b as box, a as useId, m as mergeProps } from "./label.js";
import "style-to-object";
import "clsx";
function Alert_dialog($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { open = false, onOpenChange = noop, children } = $$props;
    useDialogRoot({
      variant: box.with(() => "alert-dialog"),
      open: box.with(() => open, (v) => {
        open = v;
        onOpenChange(v);
      })
    });
    children?.($$renderer2);
    $$renderer2.push(`<!---->`);
    bind_props($$props, { open });
  });
}
function Alert_dialog_action$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      children,
      child,
      id = useId(),
      ref = null,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const actionState = useAlertDialogAction({
      id: box.with(() => id),
      ref: box.with(() => ref, (v) => ref = v)
    });
    const mergedProps = derived(() => mergeProps(restProps, actionState.props));
    if (child) {
      $$renderer2.push("<!--[-->");
      child($$renderer2, { props: mergedProps() });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<button${attributes({ ...mergedProps() })}>`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></button>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref });
  });
}
function Alert_dialog_cancel$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      id = useId(),
      ref = null,
      children,
      child,
      disabled = false,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const cancelState = useAlertDialogCancel({
      id: box.with(() => id),
      ref: box.with(() => ref, (v) => ref = v),
      disabled: box.with(() => Boolean(disabled))
    });
    const mergedProps = derived(() => mergeProps(restProps, cancelState.props));
    if (child) {
      $$renderer2.push("<!--[-->");
      child($$renderer2, { props: mergedProps() });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<button${attributes({ ...mergedProps() })}>`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></button>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref });
  });
}
function Alert_dialog_content$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      id = useId(),
      children,
      child,
      ref = null,
      forceMount = false,
      interactOutsideBehavior = "ignore",
      onCloseAutoFocus = noop,
      onEscapeKeydown = noop,
      onOpenAutoFocus = noop,
      onInteractOutside = noop,
      preventScroll = true,
      trapFocus = true,
      restoreScrollDelay = null,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const contentState = useDialogContent({
      id: box.with(() => id),
      ref: box.with(() => ref, (v) => ref = v)
    });
    const mergedProps = derived(() => mergeProps(restProps, contentState.props));
    {
      let presence = function($$renderer3) {
        {
          let focusScope = function($$renderer4, { props: focusScopeProps }) {
            Escape_layer($$renderer4, spread_props([
              mergedProps(),
              {
                enabled: contentState.root.opts.open.current,
                onEscapeKeydown: (e) => {
                  onEscapeKeydown(e);
                  if (e.defaultPrevented) return;
                  contentState.root.handleClose();
                },
                children: ($$renderer5) => {
                  Dismissible_layer($$renderer5, spread_props([
                    mergedProps(),
                    {
                      enabled: contentState.root.opts.open.current,
                      interactOutsideBehavior,
                      onInteractOutside: (e) => {
                        onInteractOutside(e);
                        if (e.defaultPrevented) return;
                        contentState.root.handleClose();
                      },
                      children: ($$renderer6) => {
                        Text_selection_layer($$renderer6, spread_props([
                          mergedProps(),
                          {
                            enabled: contentState.root.opts.open.current,
                            children: ($$renderer7) => {
                              if (child) {
                                $$renderer7.push("<!--[-->");
                                if (contentState.root.opts.open.current) {
                                  $$renderer7.push("<!--[-->");
                                  Scroll_lock($$renderer7, { preventScroll, restoreScrollDelay });
                                } else {
                                  $$renderer7.push("<!--[!-->");
                                }
                                $$renderer7.push(`<!--]--> `);
                                child($$renderer7, {
                                  props: mergeProps(mergedProps(), focusScopeProps),
                                  ...contentState.snippetProps
                                });
                                $$renderer7.push(`<!---->`);
                              } else {
                                $$renderer7.push("<!--[!-->");
                                Scroll_lock($$renderer7, { preventScroll });
                                $$renderer7.push(`<!----> <div${attributes({ ...mergeProps(mergedProps(), focusScopeProps) })}>`);
                                children?.($$renderer7);
                                $$renderer7.push(`<!----></div>`);
                              }
                              $$renderer7.push(`<!--]-->`);
                            },
                            $$slots: { default: true }
                          }
                        ]));
                      },
                      $$slots: { default: true }
                    }
                  ]));
                },
                $$slots: { default: true }
              }
            ]));
          };
          Focus_scope($$renderer3, {
            loop: true,
            trapFocus: shouldTrapFocus({
              forceMount,
              present: contentState.root.opts.open.current,
              trapFocus,
              open: contentState.root.opts.open.current
            }),
            id,
            onCloseAutoFocus: (e) => {
              onCloseAutoFocus(e);
              if (e.defaultPrevented) return;
              contentState.root.triggerNode?.focus();
            },
            onOpenAutoFocus: (e) => {
              onOpenAutoFocus(e);
              if (e.defaultPrevented) return;
              e.preventDefault();
              afterTick(() => {
                contentState.opts.ref.current?.focus();
              });
            },
            focusScope
          });
        }
      };
      Presence_layer($$renderer2, spread_props([
        mergedProps(),
        {
          forceMount,
          present: contentState.root.opts.open.current || forceMount,
          presence,
          $$slots: { presence: true }
        }
      ]));
    }
    bind_props($$props, { ref });
  });
}
function Dialog_trigger($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      id = useId(),
      ref = null,
      children,
      child,
      disabled = false,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const triggerState = useDialogTrigger({
      id: box.with(() => id),
      ref: box.with(() => ref, (v) => ref = v),
      disabled: box.with(() => Boolean(disabled))
    });
    const mergedProps = derived(() => mergeProps(restProps, triggerState.props));
    if (child) {
      $$renderer2.push("<!--[-->");
      child($$renderer2, { props: mergedProps() });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<button${attributes({ ...mergedProps() })}>`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></button>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref });
  });
}
function Dialog_description($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      id = useId(),
      children,
      child,
      ref = null,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const descriptionState = useDialogDescription({
      id: box.with(() => id),
      ref: box.with(() => ref, (v) => ref = v)
    });
    const mergedProps = derived(() => mergeProps(restProps, descriptionState.props));
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
function Alert_dialog_title($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      level = 3,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (Dialog_title) {
        $$renderer3.push("<!--[-->");
        Dialog_title($$renderer3, spread_props([
          { class: cn("text-lg font-semibold", className), level },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            }
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
function Alert_dialog_action($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (Alert_dialog_action$1) {
        $$renderer3.push("<!--[-->");
        Alert_dialog_action$1($$renderer3, spread_props([
          { class: cn(buttonVariants(), className) },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            }
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
function Alert_dialog_cancel($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (Alert_dialog_cancel$1) {
        $$renderer3.push("<!--[-->");
        Alert_dialog_cancel$1($$renderer3, spread_props([
          {
            class: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)
          },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            }
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
function Alert_dialog_footer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      children,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    $$renderer2.push(`<div${attributes({
      class: clsx(cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)),
      ...restProps
    })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
    bind_props($$props, { ref });
  });
}
function Alert_dialog_header($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      children,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    $$renderer2.push(`<div${attributes({
      class: clsx(cn("flex flex-col space-y-2 text-center sm:text-left", className)),
      ...restProps
    })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
    bind_props($$props, { ref });
  });
}
function Alert_dialog_overlay($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (Dialog_overlay) {
        $$renderer3.push("<!--[-->");
        Dialog_overlay($$renderer3, spread_props([
          {
            class: cn("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0  fixed inset-0 z-50 bg-black/80", className)
          },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            }
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
function Alert_dialog_content($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      portalProps,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (Portal) {
        $$renderer3.push("<!--[-->");
        Portal($$renderer3, spread_props([
          portalProps,
          {
            children: ($$renderer4) => {
              Alert_dialog_overlay($$renderer4, {});
              $$renderer4.push(`<!----> `);
              if (Alert_dialog_content$1) {
                $$renderer4.push("<!--[-->");
                Alert_dialog_content$1($$renderer4, spread_props([
                  {
                    class: cn("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg", className)
                  },
                  restProps,
                  {
                    get ref() {
                      return ref;
                    },
                    set ref($$value) {
                      ref = $$value;
                      $$settled = false;
                    }
                  }
                ]));
                $$renderer4.push("<!--]-->");
              } else {
                $$renderer4.push("<!--[!-->");
                $$renderer4.push("<!--]-->");
              }
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
function Alert_dialog_description($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (Dialog_description) {
        $$renderer3.push("<!--[-->");
        Dialog_description($$renderer3, spread_props([
          { class: cn("text-muted-foreground text-sm", className) },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            }
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
const Root = Alert_dialog;
const Trigger = Dialog_trigger;
export {
  Alert_dialog_content as A,
  Root as R,
  Trigger as T,
  Alert_dialog_header as a,
  Alert_dialog_title as b,
  Alert_dialog_description as c,
  Alert_dialog_footer as d,
  Alert_dialog_cancel as e,
  Alert_dialog_action as f
};
