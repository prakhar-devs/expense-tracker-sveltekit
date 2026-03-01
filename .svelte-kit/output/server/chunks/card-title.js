import { l as attributes, g as clsx, b as bind_props } from "./index2.js";
import { c as cn } from "./utils2.js";
function Card_header($$renderer, $$props) {
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
      class: clsx(cn("flex flex-col space-y-1.5 p-6 pb-0", className)),
      ...restProps
    })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
    bind_props($$props, { ref });
  });
}
function Card_title($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      level = 3,
      children,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    $$renderer2.push(`<div${attributes({
      role: "heading",
      "aria-level": level,
      class: clsx(cn("text-2xl font-semibold leading-none tracking-tight", className)),
      ...restProps
    })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
    bind_props($$props, { ref });
  });
}
export {
  Card_header as C,
  Card_title as a
};
