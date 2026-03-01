import { l as attributes, g as clsx, b as bind_props } from "./index2.js";
import { c as cn } from "./utils2.js";
import { tv } from "tailwind-variants";
const buttonVariants = tv({
  base: "ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border-input bg-background hover:bg-accent hover:text-accent-foreground border",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline"
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10"
    }
  },
  defaultVariants: { variant: "default", size: "default" }
});
function Button($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      class: className,
      variant = "default",
      size = "default",
      ref = null,
      href = void 0,
      type = "button",
      children,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    if (href) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<a${attributes({
        class: clsx(cn(buttonVariants({ variant, size }), className)),
        href,
        ...restProps
      })}>`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></a>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<button${attributes({
        class: clsx(cn(buttonVariants({ variant, size }), className)),
        type,
        ...restProps
      })}>`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></button>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref });
  });
}
function Card($$renderer, $$props) {
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
      class: clsx(cn("bg-card text-card-foreground rounded-lg border shadow-sm", className)),
      ...restProps
    })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
    bind_props($$props, { ref });
  });
}
function Card_content($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      children,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    $$renderer2.push(`<div${attributes({ class: clsx(cn("p-6", className)), ...restProps })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
    bind_props($$props, { ref });
  });
}
export {
  Button as B,
  Card as C,
  Card_content as a,
  buttonVariants as b
};
