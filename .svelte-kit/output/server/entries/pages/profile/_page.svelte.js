import { s as sanitize_props, i as spread_props, j as slot, m as derived, l as attributes, b as bind_props, k as escape_html, c as store_get, e as ensure_array_like, u as unsubscribe_stores } from "../../../chunks/index2.js";
import { a as ARROW_UP, b as ARROW_RIGHT, c as ARROW_LEFT, d as ARROW_DOWN, E as END, i as isBrowser, H as HOME, e as Context, g as getDataOrientation, f as getDataDisabled, h as getAriaOrientation, S as SPACE, j as ENTER, k as getDisabled, l as getAriaSelected, m as getHidden, n as noop, A as AppLayout, U as User, C as Calendar, o as EXPENSE_CATEGORIES, I as INCOME_CATEGORIES } from "../../../chunks/AppLayout.js";
import { C as Card, a as Card_content, B as Button } from "../../../chunks/card-content.js";
import { b as box, u as useRefById, w as watch, a as useId, m as mergeProps, L as Label, I as Input } from "../../../chunks/label.js";
import { C as Card_description } from "../../../chunks/card-description.js";
import "clsx";
import { C as Card_header, a as Card_title } from "../../../chunks/card-title.js";
import "style-to-object";
import { S as SvelteMap } from "../../../chunks/index-server.js";
import { l as auth } from "../../../chunks/auth.js";
import { format } from "date-fns";
import { d as createCategoriesQuery, e as createAddCategoryMutation, f as createDeleteCategoryMutation, g as createUpdateProfileMutation } from "../../../chunks/data.js";
import { a as toast } from "../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
import { I as Icon, c as cn } from "../../../chunks/utils2.js";
import { C as Check } from "../../../chunks/check.js";
import { P as Plus } from "../../../chunks/plus.js";
import { T as Trash_2 } from "../../../chunks/trash-2.js";
function Info($$renderer, $$props) {
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
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["path", { "d": "M12 16v-4" }],
    ["path", { "d": "M12 8h.01" }]
  ];
  Icon($$renderer, spread_props([
    { name: "info" },
    $$sanitized_props,
    {
      /**
       * @component @name Info
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNMTIgMTZ2LTQiIC8+CiAgPHBhdGggZD0iTTEyIDhoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/info
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
function Mail($$renderer, $$props) {
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
    ["path", { "d": "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" }],
    [
      "rect",
      { "x": "2", "y": "4", "width": "20", "height": "16", "rx": "2" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "mail" },
    $$sanitized_props,
    {
      /**
       * @component @name Mail
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMjIgNy04Ljk5MSA1LjcyN2EyIDIgMCAwIDEtMi4wMDkgMEwyIDciIC8+CiAgPHJlY3QgeD0iMiIgeT0iNCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiByeD0iMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/mail
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
function Tag($$renderer, $$props) {
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
        "d": "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"
      }
    ],
    [
      "circle",
      { "cx": "7.5", "cy": "7.5", "r": ".5", "fill": "currentColor" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "tag" },
    $$sanitized_props,
    {
      /**
       * @component @name Tag
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIuNTg2IDIuNTg2QTIgMiAwIDAgMCAxMS4xNzIgMkg0YTIgMiAwIDAgMC0yIDJ2Ny4xNzJhMiAyIDAgMCAwIC41ODYgMS40MTRsOC43MDQgOC43MDRhMi40MjYgMi40MjYgMCAwIDAgMy40MiAwbDYuNTgtNi41OGEyLjQyNiAyLjQyNiAwIDAgMCAwLTMuNDJ6IiAvPgogIDxjaXJjbGUgY3g9IjcuNSIgY3k9IjcuNSIgcj0iLjUiIGZpbGw9ImN1cnJlbnRDb2xvciIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/tag
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
function getElemDirection(elem) {
  const style = window.getComputedStyle(elem);
  const direction = style.getPropertyValue("direction");
  return direction;
}
function getNextKey(dir = "ltr", orientation = "horizontal") {
  return {
    horizontal: dir === "rtl" ? ARROW_LEFT : ARROW_RIGHT,
    vertical: ARROW_DOWN
  }[orientation];
}
function getPrevKey(dir = "ltr", orientation = "horizontal") {
  return {
    horizontal: dir === "rtl" ? ARROW_RIGHT : ARROW_LEFT,
    vertical: ARROW_UP
  }[orientation];
}
function getDirectionalKeys(dir = "ltr", orientation = "horizontal") {
  if (!["ltr", "rtl"].includes(dir))
    dir = "ltr";
  if (!["horizontal", "vertical"].includes(orientation))
    orientation = "horizontal";
  return {
    nextKey: getNextKey(dir, orientation),
    prevKey: getPrevKey(dir, orientation)
  };
}
function useRovingFocus(props) {
  const currentTabStopId = box(null);
  function getCandidateNodes() {
    if (!isBrowser) return [];
    const node = document.getElementById(props.rootNodeId.current);
    if (!node) return [];
    if (props.candidateSelector) {
      const candidates = Array.from(node.querySelectorAll(props.candidateSelector));
      return candidates;
    } else if (props.candidateAttr) {
      const candidates = Array.from(node.querySelectorAll(`[${props.candidateAttr}]:not([data-disabled])`));
      return candidates;
    }
    return [];
  }
  function focusFirstCandidate() {
    const items = getCandidateNodes();
    if (!items.length) return;
    items[0]?.focus();
  }
  function handleKeydown(node, e, both = false) {
    const rootNode = document.getElementById(props.rootNodeId.current);
    if (!rootNode || !node) return;
    const items = getCandidateNodes();
    if (!items.length) return;
    const currentIndex = items.indexOf(node);
    const dir = getElemDirection(rootNode);
    const { nextKey, prevKey } = getDirectionalKeys(dir, props.orientation.current);
    const loop = props.loop.current;
    const keyToIndex = {
      [nextKey]: currentIndex + 1,
      [prevKey]: currentIndex - 1,
      [HOME]: 0,
      [END]: items.length - 1
    };
    if (both) {
      const altNextKey = nextKey === ARROW_DOWN ? ARROW_RIGHT : ARROW_DOWN;
      const altPrevKey = prevKey === ARROW_UP ? ARROW_LEFT : ARROW_UP;
      keyToIndex[altNextKey] = currentIndex + 1;
      keyToIndex[altPrevKey] = currentIndex - 1;
    }
    let itemIndex = keyToIndex[e.key];
    if (itemIndex === void 0) return;
    e.preventDefault();
    if (itemIndex < 0 && loop) {
      itemIndex = items.length - 1;
    } else if (itemIndex === items.length && loop) {
      itemIndex = 0;
    }
    const itemToFocus = items[itemIndex];
    if (!itemToFocus) return;
    itemToFocus.focus();
    currentTabStopId.current = itemToFocus.id;
    props.onCandidateFocus?.(itemToFocus);
    return itemToFocus;
  }
  function getTabIndex(node) {
    const items = getCandidateNodes();
    const anyActive = currentTabStopId.current !== null;
    if (node && !anyActive && items[0] === node) {
      currentTabStopId.current = node.id;
      return 0;
    } else if (node?.id === currentTabStopId.current) {
      return 0;
    }
    return -1;
  }
  return {
    setCurrentTabStopId(id) {
      currentTabStopId.current = id;
    },
    getTabIndex,
    handleKeydown,
    focusFirstCandidate,
    currentTabStopId
  };
}
const TABS_ROOT_ATTR = "data-tabs-root";
const TABS_LIST_ATTR = "data-tabs-list";
const TABS_TRIGGER_ATTR = "data-tabs-trigger";
const TABS_CONTENT_ATTR = "data-tabs-content";
class TabsRootState {
  opts;
  rovingFocusGroup;
  triggerIds = [];
  // holds the trigger ID for each value to associate it with the content
  valueToTriggerId = new SvelteMap();
  // holds the content ID for each value to associate it with the trigger
  valueToContentId = new SvelteMap();
  constructor(opts) {
    this.opts = opts;
    useRefById(opts);
    this.rovingFocusGroup = useRovingFocus({
      candidateAttr: TABS_TRIGGER_ATTR,
      rootNodeId: this.opts.id,
      loop: this.opts.loop,
      orientation: this.opts.orientation
    });
  }
  registerTrigger(id, value) {
    this.triggerIds.push(id);
    this.valueToTriggerId.set(value, id);
    return () => {
      this.triggerIds = this.triggerIds.filter((triggerId) => triggerId !== id);
      this.valueToTriggerId.delete(value);
    };
  }
  registerContent(id, value) {
    this.valueToContentId.set(value, id);
    return () => {
      this.valueToContentId.delete(value);
    };
  }
  setValue(v) {
    this.opts.value.current = v;
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    "data-orientation": getDataOrientation(this.opts.orientation.current),
    [TABS_ROOT_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class TabsListState {
  opts;
  root;
  #isDisabled = derived(() => this.root.opts.disabled.current);
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById(opts);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: "tablist",
    "aria-orientation": getAriaOrientation(this.root.opts.orientation.current),
    "data-orientation": getDataOrientation(this.root.opts.orientation.current),
    [TABS_LIST_ATTR]: "",
    "data-disabled": getDataDisabled(this.#isDisabled())
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class TabsTriggerState {
  opts;
  root;
  #isActive = derived(() => this.root.opts.value.current === this.opts.value.current);
  #isDisabled = derived(() => this.opts.disabled.current || this.root.opts.disabled.current);
  #tabIndex = 0;
  #ariaControls = derived(() => this.root.valueToContentId.get(this.opts.value.current));
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById(opts);
    watch([() => this.opts.id.current, () => this.opts.value.current], ([id, value]) => {
      return this.root.registerTrigger(id, value);
    });
    this.onfocus = this.onfocus.bind(this);
    this.onclick = this.onclick.bind(this);
    this.onkeydown = this.onkeydown.bind(this);
  }
  #activate() {
    if (this.root.opts.value.current === this.opts.value.current) return;
    this.root.setValue(this.opts.value.current);
  }
  onfocus(_) {
    if (this.root.opts.activationMode.current !== "automatic" || this.#isDisabled()) return;
    this.#activate();
  }
  onclick(_) {
    if (this.#isDisabled()) return;
    this.#activate();
  }
  onkeydown(e) {
    if (this.#isDisabled()) return;
    if (e.key === SPACE || e.key === ENTER) {
      e.preventDefault();
      this.#activate();
      return;
    }
    this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: "tab",
    "data-state": getTabDataState(this.#isActive()),
    "data-value": this.opts.value.current,
    "data-orientation": getDataOrientation(this.root.opts.orientation.current),
    "data-disabled": getDataDisabled(this.#isDisabled()),
    "aria-selected": getAriaSelected(this.#isActive()),
    "aria-controls": this.#ariaControls(),
    [TABS_TRIGGER_ATTR]: "",
    disabled: getDisabled(this.#isDisabled()),
    tabindex: this.#tabIndex,
    //
    onclick: this.onclick,
    onfocus: this.onfocus,
    onkeydown: this.onkeydown
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class TabsContentState {
  opts;
  root;
  #isActive = derived(() => this.root.opts.value.current === this.opts.value.current);
  #ariaLabelledBy = derived(() => this.root.valueToTriggerId.get(this.opts.value.current));
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById(opts);
    watch([() => this.opts.id.current, () => this.opts.value.current], ([id, value]) => {
      return this.root.registerContent(id, value);
    });
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: "tabpanel",
    hidden: getHidden(!this.#isActive()),
    tabindex: 0,
    "data-value": this.opts.value.current,
    "data-state": getTabDataState(this.#isActive()),
    "aria-labelledby": this.#ariaLabelledBy(),
    [TABS_CONTENT_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
const TabsRootContext = new Context("Tabs.Root");
function useTabsRoot(props) {
  return TabsRootContext.set(new TabsRootState(props));
}
function useTabsTrigger(props) {
  return new TabsTriggerState(props, TabsRootContext.get());
}
function useTabsList(props) {
  return new TabsListState(props, TabsRootContext.get());
}
function useTabsContent(props) {
  return new TabsContentState(props, TabsRootContext.get());
}
function getTabDataState(condition) {
  return condition ? "active" : "inactive";
}
function Tabs($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      id = useId(),
      ref = null,
      value = "",
      onValueChange = noop,
      orientation = "horizontal",
      loop = true,
      activationMode = "automatic",
      disabled = false,
      children,
      child,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const rootState = useTabsRoot({
      id: box.with(() => id),
      value: box.with(() => value, (v) => {
        value = v;
        onValueChange(v);
      }),
      orientation: box.with(() => orientation),
      loop: box.with(() => loop),
      activationMode: box.with(() => activationMode),
      disabled: box.with(() => disabled),
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
    bind_props($$props, { ref, value });
  });
}
function Tabs_content$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      children,
      child,
      id = useId(),
      ref = null,
      value,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const contentState = useTabsContent({
      value: box.with(() => value),
      id: box.with(() => id),
      ref: box.with(() => ref, (v) => ref = v)
    });
    const mergedProps = derived(() => mergeProps(restProps, contentState.props));
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
function Tabs_list$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      child,
      children,
      id = useId(),
      ref = null,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const listState = useTabsList({
      id: box.with(() => id),
      ref: box.with(() => ref, (v) => ref = v)
    });
    const mergedProps = derived(() => mergeProps(restProps, listState.props));
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
function Tabs_trigger$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      child,
      children,
      disabled = false,
      id = useId(),
      type = "button",
      value,
      ref = null,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const triggerState = useTabsTrigger({
      id: box.with(() => id),
      disabled: box.with(() => disabled ?? false),
      value: box.with(() => value),
      ref: box.with(() => ref, (v) => ref = v)
    });
    const mergedProps = derived(() => mergeProps(restProps, triggerState.props, { type }));
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
function Tabs_content($$renderer, $$props) {
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
      if (Tabs_content$1) {
        $$renderer3.push("<!--[-->");
        Tabs_content$1($$renderer3, spread_props([
          {
            class: cn("ring-offset-background focus-visible:ring-ring mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2", className)
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
function Tabs_list($$renderer, $$props) {
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
      if (Tabs_list$1) {
        $$renderer3.push("<!--[-->");
        Tabs_list$1($$renderer3, spread_props([
          {
            class: cn("bg-muted text-muted-foreground inline-flex h-10 items-center justify-center rounded-md p-1", className)
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
function Tabs_trigger($$renderer, $$props) {
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
      if (Tabs_trigger$1) {
        $$renderer3.push("<!--[-->");
        Tabs_trigger$1($$renderer3, spread_props([
          {
            class: cn("ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm", className)
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
const Root = Tabs;
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const categoriesQuery = createCategoriesQuery(() => store_get($$store_subs ??= {}, "$auth", auth).user?.id);
    const addCategory = createAddCategoryMutation();
    createDeleteCategoryMutation();
    const updateProfile = createUpdateProfileMutation();
    let profile = derived(() => data.preloaded?.profile);
    let user = derived(() => store_get($$store_subs ??= {}, "$auth", auth).user);
    let newCategoryName = "";
    let fullName = profile()?.full_name || "";
    async function handleAddCategory(type) {
      if (!newCategoryName.trim()) return toast.error("Category name is required");
      try {
        await addCategory.mutateAsync({ name: newCategoryName.trim(), type });
        newCategoryName = "";
        toast.success("Category added successfully");
      } catch (error) {
        toast.error(error.message);
      }
    }
    async function handleUpdateProfile() {
      if (!fullName.trim()) return toast.error("Name cannot be empty");
      try {
        await updateProfile.mutateAsync({ full_name: fullName.trim() });
        toast.success("Profile updated");
      } catch (error) {
        toast.error(error.message);
      }
    }
    let customCategories = derived(() => categoriesQuery.data || []);
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      AppLayout($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="animate-fade-in space-y-6"><div class="bg-background pb-6 pt-2 border-b border-border/40"><div><h1 class="font-display text-3xl font-bold text-foreground">Profile</h1> <p class="text-muted-foreground">Account settings and customization</p></div></div> <div class="w-full max-w-7xl mx-auto pb-10 px-4 sm:px-0 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">`);
          if (Card) {
            $$renderer4.push("<!--[-->");
            Card($$renderer4, {
              class: "border-border/50 shadow-sm overflow-hidden lg:col-span-1 h-full",
              children: ($$renderer5) => {
                if (Card_header) {
                  $$renderer5.push("<!--[-->");
                  Card_header($$renderer5, {
                    class: "bg-muted/30 pb-6",
                    children: ($$renderer6) => {
                      $$renderer6.push(`<div class="flex items-center gap-4"><div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-inner">`);
                      User($$renderer6, { class: "h-8 w-8 text-primary" });
                      $$renderer6.push(`<!----></div> <div>`);
                      if (Card_title) {
                        $$renderer6.push("<!--[-->");
                        Card_title($$renderer6, {
                          class: "text-2xl",
                          children: ($$renderer7) => {
                            $$renderer7.push(`<!---->${escape_html(profile()?.full_name || "User")}`);
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
                            $$renderer7.push(`<!---->Your Account Details`);
                          },
                          $$slots: { default: true }
                        });
                        $$renderer6.push("<!--]-->");
                      } else {
                        $$renderer6.push("<!--[!-->");
                        $$renderer6.push("<!--]-->");
                      }
                      $$renderer6.push(`</div></div>`);
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
                    class: "space-y-6 pt-6",
                    children: ($$renderer6) => {
                      $$renderer6.push(`<div class="space-y-4"><div class="p-4 rounded-xl border border-border/50 bg-muted/10 space-y-1"><div class="flex items-center gap-2 text-muted-foreground text-xs uppercase font-bold tracking-wider">`);
                      Mail($$renderer6, { class: "h-3.5 w-3.5" });
                      $$renderer6.push(`<!----> Email Address</div> <p class="text-sm font-semibold truncate text-foreground">${escape_html(user()?.email)}</p></div> `);
                      if (user()?.created_at) {
                        $$renderer6.push("<!--[-->");
                        $$renderer6.push(`<div class="p-4 rounded-xl border border-border/50 bg-muted/10 space-y-1"><div class="flex items-center gap-2 text-muted-foreground text-xs uppercase font-bold tracking-wider">`);
                        Calendar($$renderer6, { class: "h-3.5 w-3.5" });
                        $$renderer6.push(`<!----> Account Created</div> <p class="text-sm font-semibold text-foreground">${escape_html(format(new Date(user().created_at), "MMMM do, yyyy"))}</p></div>`);
                      } else {
                        $$renderer6.push("<!--[!-->");
                      }
                      $$renderer6.push(`<!--]--></div> <div class="pt-6 border-t border-border/50 space-y-4"><div class="flex items-center gap-2"><div class="p-1.5 bg-primary/10 rounded-lg">`);
                      User($$renderer6, { class: "h-4 w-4 text-primary" });
                      $$renderer6.push(`<!----></div> <h3 class="font-display font-bold text-lg">Update Profile</h3></div> <div class="flex flex-col gap-4"><div class="space-y-2">`);
                      Label($$renderer6, {
                        for: "fullName",
                        class: "text-xs uppercase font-bold text-muted-foreground tracking-wider ml-1",
                        children: ($$renderer7) => {
                          $$renderer7.push(`<!---->Full Name`);
                        },
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!----> `);
                      Input($$renderer6, {
                        id: "fullName",
                        type: "text",
                        placeholder: "Your full name",
                        class: "bg-muted/10 border-border/50 focus:ring-primary/20",
                        get value() {
                          return fullName;
                        },
                        set value($$value) {
                          fullName = $$value;
                          $$settled = false;
                        }
                      });
                      $$renderer6.push(`<!----></div> `);
                      Button($$renderer6, {
                        onclick: handleUpdateProfile,
                        disabled: updateProfile.isPending,
                        class: "w-full shadow-sm",
                        children: ($$renderer7) => {
                          if (updateProfile.isPending) {
                            $$renderer7.push("<!--[-->");
                            $$renderer7.push(`<span class="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span> Saving...`);
                          } else {
                            $$renderer7.push("<!--[!-->");
                            Check($$renderer7, { class: "h-4 w-4 mr-2" });
                            $$renderer7.push(`<!----> Save Changes`);
                          }
                          $$renderer7.push(`<!--]-->`);
                        },
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!----></div></div>`);
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
              class: "border-border/50 shadow-sm overflow-hidden lg:col-span-2",
              children: ($$renderer5) => {
                if (Card_header) {
                  $$renderer5.push("<!--[-->");
                  Card_header($$renderer5, {
                    class: "bg-muted/30 border-b border-border/40",
                    children: ($$renderer6) => {
                      $$renderer6.push(`<div class="flex items-center gap-3"><div class="p-2.5 bg-primary/10 rounded-xl shadow-inner">`);
                      Tag($$renderer6, { class: "h-5 w-5 text-primary" });
                      $$renderer6.push(`<!----></div> <div>`);
                      if (Card_title) {
                        $$renderer6.push("<!--[-->");
                        Card_title($$renderer6, {
                          class: "text-xl",
                          children: ($$renderer7) => {
                            $$renderer7.push(`<!---->Manage Categories`);
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
                            $$renderer7.push(`<!---->Personalize your transaction classification`);
                          },
                          $$slots: { default: true }
                        });
                        $$renderer6.push("<!--]-->");
                      } else {
                        $$renderer6.push("<!--[!-->");
                        $$renderer6.push("<!--]-->");
                      }
                      $$renderer6.push(`</div></div>`);
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
                    class: "p-0",
                    children: ($$renderer6) => {
                      if (Root) {
                        $$renderer6.push("<!--[-->");
                        Root($$renderer6, {
                          value: "expense",
                          class: "w-full",
                          children: ($$renderer7) => {
                            $$renderer7.push(`<div class="px-6 pt-6">`);
                            if (Tabs_list) {
                              $$renderer7.push("<!--[-->");
                              Tabs_list($$renderer7, {
                                class: "grid w-full grid-cols-2 p-1 bg-muted/20 border border-border/50",
                                children: ($$renderer8) => {
                                  if (Tabs_trigger) {
                                    $$renderer8.push("<!--[-->");
                                    Tabs_trigger($$renderer8, {
                                      value: "expense",
                                      class: "rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm",
                                      children: ($$renderer9) => {
                                        $$renderer9.push(`<!---->Expenses`);
                                      },
                                      $$slots: { default: true }
                                    });
                                    $$renderer8.push("<!--]-->");
                                  } else {
                                    $$renderer8.push("<!--[!-->");
                                    $$renderer8.push("<!--]-->");
                                  }
                                  $$renderer8.push(` `);
                                  if (Tabs_trigger) {
                                    $$renderer8.push("<!--[-->");
                                    Tabs_trigger($$renderer8, {
                                      value: "income",
                                      class: "rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm",
                                      children: ($$renderer9) => {
                                        $$renderer9.push(`<!---->Income`);
                                      },
                                      $$slots: { default: true }
                                    });
                                    $$renderer8.push("<!--]-->");
                                  } else {
                                    $$renderer8.push("<!--[!-->");
                                    $$renderer8.push("<!--]-->");
                                  }
                                },
                                $$slots: { default: true }
                              });
                              $$renderer7.push("<!--]-->");
                            } else {
                              $$renderer7.push("<!--[!-->");
                              $$renderer7.push("<!--]-->");
                            }
                            $$renderer7.push(`</div> <!--[-->`);
                            const each_array = ensure_array_like(["expense", "income"]);
                            for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
                              let type = each_array[$$index_2];
                              if (Tabs_content) {
                                $$renderer7.push("<!--[-->");
                                Tabs_content($$renderer7, {
                                  value: type,
                                  class: "p-6 pt-4 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
                                  children: ($$renderer8) => {
                                    $$renderer8.push(`<div class="space-y-3">`);
                                    Label($$renderer8, {
                                      class: "text-xs text-muted-foreground uppercase font-bold tracking-widest pl-1",
                                      children: ($$renderer9) => {
                                        $$renderer9.push(`<!---->Add New ${escape_html(type)} Category`);
                                      },
                                      $$slots: { default: true }
                                    });
                                    $$renderer8.push(`<!----> <div class="flex gap-2">`);
                                    Input($$renderer8, {
                                      placeholder: `e.g. ${type === "expense" ? "Hobbies, Pets, Subscriptions" : "Dividends, Bonus, Side Hustle"}`,
                                      onkeydown: (e) => e.key === "Enter" && handleAddCategory(type),
                                      class: "bg-muted/10 border-border/50",
                                      get value() {
                                        return newCategoryName;
                                      },
                                      set value($$value) {
                                        newCategoryName = $$value;
                                        $$settled = false;
                                      }
                                    });
                                    $$renderer8.push(`<!----> `);
                                    Button($$renderer8, {
                                      variant: "secondary",
                                      onclick: () => handleAddCategory(type),
                                      disabled: addCategory.isPending,
                                      class: "shrink-0 shadow-sm",
                                      children: ($$renderer9) => {
                                        Plus($$renderer9, { class: "h-4 w-4 mr-2" });
                                        $$renderer9.push(`<!----> Add`);
                                      },
                                      $$slots: { default: true }
                                    });
                                    $$renderer8.push(`<!----></div></div> <div class="space-y-3">`);
                                    Label($$renderer8, {
                                      class: "text-xs text-muted-foreground uppercase font-bold tracking-widest pl-1",
                                      children: ($$renderer9) => {
                                        $$renderer9.push(`<!---->Current Categories`);
                                      },
                                      $$slots: { default: true }
                                    });
                                    $$renderer8.push(`<!----> <div class="grid grid-cols-2 lg:grid-cols-3 gap-3"><!--[-->`);
                                    const each_array_1 = ensure_array_like(type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES);
                                    for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                                      let cat = each_array_1[$$index];
                                      $$renderer8.push(`<div class="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border border-border/40 group hover:border-border transition-colors"><div class="flex items-center gap-3"><div class="h-2 w-2 rounded-full bg-muted-foreground/30"></div> <span class="text-sm font-medium text-muted-foreground">${escape_html(cat)}</span></div> <span class="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-tighter">Preset</span></div>`);
                                    }
                                    $$renderer8.push(`<!--]--> <!--[-->`);
                                    const each_array_2 = ensure_array_like(customCategories().filter((c) => c.type === type));
                                    for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
                                      let cat = each_array_2[$$index_1];
                                      $$renderer8.push(`<div class="flex items-center justify-between p-3.5 rounded-xl bg-primary/5 border border-primary/20 shadow-sm group hover:bg-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]"><div class="flex items-center gap-3"><div class="h-2 w-2 rounded-full bg-primary animate-pulse"></div> <span class="text-sm font-bold text-primary truncate max-w-[120px]">${escape_html(cat.name)}</span></div> <button class="text-expense opacity-0 group-hover:opacity-100 transition-all hover:bg-expense/10 p-1.5 rounded-lg" title="Delete Category">`);
                                      Trash_2($$renderer8, { class: "h-4 w-4" });
                                      $$renderer8.push(`<!----></button></div>`);
                                    }
                                    $$renderer8.push(`<!--]--></div> <div class="flex items-start gap-3 mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">`);
                                    Info($$renderer8, { class: "h-5 w-5 text-blue-500 shrink-0 mt-0.5" });
                                    $$renderer8.push(`<!----> <p class="text-xs text-muted-foreground leading-relaxed"><strong class="text-blue-600 dark:text-blue-400">Pro Tip:</strong> Preset categories are global defaults.
                                            Custom categories you create are unique
                                            to your account and can be removed anytime
                                            to keep your transaction lists tidy.</p></div></div>`);
                                  },
                                  $$slots: { default: true }
                                });
                                $$renderer7.push("<!--]-->");
                              } else {
                                $$renderer7.push("<!--[!-->");
                                $$renderer7.push("<!--]-->");
                              }
                            }
                            $$renderer7.push(`<!--]-->`);
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
