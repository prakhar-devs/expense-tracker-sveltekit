import { f as fallback, b as bind_props, a as attr, e as ensure_array_like, s as sanitize_props, c as store_get, d as attr_class, g as clsx, h as attr_style, i as spread_props, j as slot, k as escape_html, u as unsubscribe_stores, r as rest_props, l as attributes } from "../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "../../chunks/root.js";
import "../../chunks/state.svelte.js";
import { e as ensureQueryFn, a as addToStart, b as addToEnd, c as addConsumeAwareSignal, S as Subscribable, M as Mutation, n as notifyManager, m as matchMutation, d as noop, h as hashQueryKeyByOptions, Q as Query, f as matchQuery, g as focusManager, o as onlineManager, r as resolveStaleTime, i as functionalUpdate, j as hashKey, p as partialMatchKey, s as skipToken, k as setQueryClientContext, l as auth } from "../../chunks/auth.js";
import { o as onDestroy } from "../../chunks/preferences.js";
import { t as toastState, c as cn, u as useEffect } from "../../chunks/Toaster.svelte_svelte_type_style_lang.js";
function infiniteQueryBehavior(pages) {
  return {
    onFetch: (context, query) => {
      const options = context.options;
      const direction = context.fetchOptions?.meta?.fetchMore?.direction;
      const oldPages = context.state.data?.pages || [];
      const oldPageParams = context.state.data?.pageParams || [];
      let result = { pages: [], pageParams: [] };
      let currentPage = 0;
      const fetchFn = async () => {
        let cancelled = false;
        const addSignalProperty = (object) => {
          addConsumeAwareSignal(
            object,
            () => context.signal,
            () => cancelled = true
          );
        };
        const queryFn = ensureQueryFn(context.options, context.fetchOptions);
        const fetchPage = async (data, param, previous) => {
          if (cancelled) {
            return Promise.reject();
          }
          if (param == null && data.pages.length) {
            return Promise.resolve(data);
          }
          const createQueryFnContext = () => {
            const queryFnContext2 = {
              client: context.client,
              queryKey: context.queryKey,
              pageParam: param,
              direction: previous ? "backward" : "forward",
              meta: context.options.meta
            };
            addSignalProperty(queryFnContext2);
            return queryFnContext2;
          };
          const queryFnContext = createQueryFnContext();
          const page = await queryFn(queryFnContext);
          const { maxPages } = context.options;
          const addTo = previous ? addToStart : addToEnd;
          return {
            pages: addTo(data.pages, page, maxPages),
            pageParams: addTo(data.pageParams, param, maxPages)
          };
        };
        if (direction && oldPages.length) {
          const previous = direction === "backward";
          const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
          const oldData = {
            pages: oldPages,
            pageParams: oldPageParams
          };
          const param = pageParamFn(options, oldData);
          result = await fetchPage(oldData, param, previous);
        } else {
          const remainingPages = pages ?? oldPages.length;
          do {
            const param = currentPage === 0 ? oldPageParams[0] ?? options.initialPageParam : getNextPageParam(options, result);
            if (currentPage > 0 && param == null) {
              break;
            }
            result = await fetchPage(result, param);
            currentPage++;
          } while (currentPage < remainingPages);
        }
        return result;
      };
      if (context.options.persister) {
        context.fetchFn = () => {
          return context.options.persister?.(
            fetchFn,
            {
              client: context.client,
              queryKey: context.queryKey,
              meta: context.options.meta,
              signal: context.signal
            },
            query
          );
        };
      } else {
        context.fetchFn = fetchFn;
      }
    }
  };
}
function getNextPageParam(options, { pages, pageParams }) {
  const lastIndex = pages.length - 1;
  return pages.length > 0 ? options.getNextPageParam(
    pages[lastIndex],
    pages,
    pageParams[lastIndex],
    pageParams
  ) : void 0;
}
function getPreviousPageParam(options, { pages, pageParams }) {
  return pages.length > 0 ? options.getPreviousPageParam?.(pages[0], pages, pageParams[0], pageParams) : void 0;
}
var MutationCache = class extends Subscribable {
  constructor(config = {}) {
    super();
    this.config = config;
    this.#mutations = /* @__PURE__ */ new Set();
    this.#scopes = /* @__PURE__ */ new Map();
    this.#mutationId = 0;
  }
  #mutations;
  #scopes;
  #mutationId;
  build(client, options, state) {
    const mutation = new Mutation({
      client,
      mutationCache: this,
      mutationId: ++this.#mutationId,
      options: client.defaultMutationOptions(options),
      state
    });
    this.add(mutation);
    return mutation;
  }
  add(mutation) {
    this.#mutations.add(mutation);
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const scopedMutations = this.#scopes.get(scope);
      if (scopedMutations) {
        scopedMutations.push(mutation);
      } else {
        this.#scopes.set(scope, [mutation]);
      }
    }
    this.notify({ type: "added", mutation });
  }
  remove(mutation) {
    if (this.#mutations.delete(mutation)) {
      const scope = scopeFor(mutation);
      if (typeof scope === "string") {
        const scopedMutations = this.#scopes.get(scope);
        if (scopedMutations) {
          if (scopedMutations.length > 1) {
            const index = scopedMutations.indexOf(mutation);
            if (index !== -1) {
              scopedMutations.splice(index, 1);
            }
          } else if (scopedMutations[0] === mutation) {
            this.#scopes.delete(scope);
          }
        }
      }
    }
    this.notify({ type: "removed", mutation });
  }
  canRun(mutation) {
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const mutationsWithSameScope = this.#scopes.get(scope);
      const firstPendingMutation = mutationsWithSameScope?.find(
        (m) => m.state.status === "pending"
      );
      return !firstPendingMutation || firstPendingMutation === mutation;
    } else {
      return true;
    }
  }
  runNext(mutation) {
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const foundMutation = this.#scopes.get(scope)?.find((m) => m !== mutation && m.state.isPaused);
      return foundMutation?.continue() ?? Promise.resolve();
    } else {
      return Promise.resolve();
    }
  }
  clear() {
    notifyManager.batch(() => {
      this.#mutations.forEach((mutation) => {
        this.notify({ type: "removed", mutation });
      });
      this.#mutations.clear();
      this.#scopes.clear();
    });
  }
  getAll() {
    return Array.from(this.#mutations);
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (mutation) => matchMutation(defaultedFilters, mutation)
    );
  }
  findAll(filters = {}) {
    return this.getAll().filter((mutation) => matchMutation(filters, mutation));
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  resumePausedMutations() {
    const pausedMutations = this.getAll().filter((x) => x.state.isPaused);
    return notifyManager.batch(
      () => Promise.all(
        pausedMutations.map((mutation) => mutation.continue().catch(noop))
      )
    );
  }
};
function scopeFor(mutation) {
  return mutation.options.scope?.id;
}
var QueryCache = class extends Subscribable {
  constructor(config = {}) {
    super();
    this.config = config;
    this.#queries = /* @__PURE__ */ new Map();
  }
  #queries;
  build(client, options, state) {
    const queryKey = options.queryKey;
    const queryHash = options.queryHash ?? hashQueryKeyByOptions(queryKey, options);
    let query = this.get(queryHash);
    if (!query) {
      query = new Query({
        client,
        queryKey,
        queryHash,
        options: client.defaultQueryOptions(options),
        state,
        defaultOptions: client.getQueryDefaults(queryKey)
      });
      this.add(query);
    }
    return query;
  }
  add(query) {
    if (!this.#queries.has(query.queryHash)) {
      this.#queries.set(query.queryHash, query);
      this.notify({
        type: "added",
        query
      });
    }
  }
  remove(query) {
    const queryInMap = this.#queries.get(query.queryHash);
    if (queryInMap) {
      query.destroy();
      if (queryInMap === query) {
        this.#queries.delete(query.queryHash);
      }
      this.notify({ type: "removed", query });
    }
  }
  clear() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        this.remove(query);
      });
    });
  }
  get(queryHash) {
    return this.#queries.get(queryHash);
  }
  getAll() {
    return [...this.#queries.values()];
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (query) => matchQuery(defaultedFilters, query)
    );
  }
  findAll(filters = {}) {
    const queries = this.getAll();
    return Object.keys(filters).length > 0 ? queries.filter((query) => matchQuery(filters, query)) : queries;
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  onFocus() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onFocus();
      });
    });
  }
  onOnline() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onOnline();
      });
    });
  }
};
var QueryClient = class {
  #queryCache;
  #mutationCache;
  #defaultOptions;
  #queryDefaults;
  #mutationDefaults;
  #mountCount;
  #unsubscribeFocus;
  #unsubscribeOnline;
  constructor(config = {}) {
    this.#queryCache = config.queryCache || new QueryCache();
    this.#mutationCache = config.mutationCache || new MutationCache();
    this.#defaultOptions = config.defaultOptions || {};
    this.#queryDefaults = /* @__PURE__ */ new Map();
    this.#mutationDefaults = /* @__PURE__ */ new Map();
    this.#mountCount = 0;
  }
  mount() {
    this.#mountCount++;
    if (this.#mountCount !== 1) return;
    this.#unsubscribeFocus = focusManager.subscribe(async (focused) => {
      if (focused) {
        await this.resumePausedMutations();
        this.#queryCache.onFocus();
      }
    });
    this.#unsubscribeOnline = onlineManager.subscribe(async (online) => {
      if (online) {
        await this.resumePausedMutations();
        this.#queryCache.onOnline();
      }
    });
  }
  unmount() {
    this.#mountCount--;
    if (this.#mountCount !== 0) return;
    this.#unsubscribeFocus?.();
    this.#unsubscribeFocus = void 0;
    this.#unsubscribeOnline?.();
    this.#unsubscribeOnline = void 0;
  }
  isFetching(filters) {
    return this.#queryCache.findAll({ ...filters, fetchStatus: "fetching" }).length;
  }
  isMutating(filters) {
    return this.#mutationCache.findAll({ ...filters, status: "pending" }).length;
  }
  /**
   * Imperative (non-reactive) way to retrieve data for a QueryKey.
   * Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
   *
   * Hint: Do not use this function inside a component, because it won't receive updates.
   * Use `useQuery` to create a `QueryObserver` that subscribes to changes.
   */
  getQueryData(queryKey) {
    const options = this.defaultQueryOptions({ queryKey });
    return this.#queryCache.get(options.queryHash)?.state.data;
  }
  ensureQueryData(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    const query = this.#queryCache.build(this, defaultedOptions);
    const cachedData = query.state.data;
    if (cachedData === void 0) {
      return this.fetchQuery(options);
    }
    if (options.revalidateIfStale && query.isStaleByTime(resolveStaleTime(defaultedOptions.staleTime, query))) {
      void this.prefetchQuery(defaultedOptions);
    }
    return Promise.resolve(cachedData);
  }
  getQueriesData(filters) {
    return this.#queryCache.findAll(filters).map(({ queryKey, state }) => {
      const data = state.data;
      return [queryKey, data];
    });
  }
  setQueryData(queryKey, updater, options) {
    const defaultedOptions = this.defaultQueryOptions({ queryKey });
    const query = this.#queryCache.get(
      defaultedOptions.queryHash
    );
    const prevData = query?.state.data;
    const data = functionalUpdate(updater, prevData);
    if (data === void 0) {
      return void 0;
    }
    return this.#queryCache.build(this, defaultedOptions).setData(data, { ...options, manual: true });
  }
  setQueriesData(filters, updater, options) {
    return notifyManager.batch(
      () => this.#queryCache.findAll(filters).map(({ queryKey }) => [
        queryKey,
        this.setQueryData(queryKey, updater, options)
      ])
    );
  }
  getQueryState(queryKey) {
    const options = this.defaultQueryOptions({ queryKey });
    return this.#queryCache.get(
      options.queryHash
    )?.state;
  }
  removeQueries(filters) {
    const queryCache = this.#queryCache;
    notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        queryCache.remove(query);
      });
    });
  }
  resetQueries(filters, options) {
    const queryCache = this.#queryCache;
    return notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        query.reset();
      });
      return this.refetchQueries(
        {
          type: "active",
          ...filters
        },
        options
      );
    });
  }
  cancelQueries(filters, cancelOptions = {}) {
    const defaultedCancelOptions = { revert: true, ...cancelOptions };
    const promises = notifyManager.batch(
      () => this.#queryCache.findAll(filters).map((query) => query.cancel(defaultedCancelOptions))
    );
    return Promise.all(promises).then(noop).catch(noop);
  }
  invalidateQueries(filters, options = {}) {
    return notifyManager.batch(() => {
      this.#queryCache.findAll(filters).forEach((query) => {
        query.invalidate();
      });
      if (filters?.refetchType === "none") {
        return Promise.resolve();
      }
      return this.refetchQueries(
        {
          ...filters,
          type: filters?.refetchType ?? filters?.type ?? "active"
        },
        options
      );
    });
  }
  refetchQueries(filters, options = {}) {
    const fetchOptions = {
      ...options,
      cancelRefetch: options.cancelRefetch ?? true
    };
    const promises = notifyManager.batch(
      () => this.#queryCache.findAll(filters).filter((query) => !query.isDisabled() && !query.isStatic()).map((query) => {
        let promise = query.fetch(void 0, fetchOptions);
        if (!fetchOptions.throwOnError) {
          promise = promise.catch(noop);
        }
        return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
      })
    );
    return Promise.all(promises).then(noop);
  }
  fetchQuery(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    if (defaultedOptions.retry === void 0) {
      defaultedOptions.retry = false;
    }
    const query = this.#queryCache.build(this, defaultedOptions);
    return query.isStaleByTime(
      resolveStaleTime(defaultedOptions.staleTime, query)
    ) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
  }
  prefetchQuery(options) {
    return this.fetchQuery(options).then(noop).catch(noop);
  }
  fetchInfiniteQuery(options) {
    options.behavior = infiniteQueryBehavior(options.pages);
    return this.fetchQuery(options);
  }
  prefetchInfiniteQuery(options) {
    return this.fetchInfiniteQuery(options).then(noop).catch(noop);
  }
  ensureInfiniteQueryData(options) {
    options.behavior = infiniteQueryBehavior(options.pages);
    return this.ensureQueryData(options);
  }
  resumePausedMutations() {
    if (onlineManager.isOnline()) {
      return this.#mutationCache.resumePausedMutations();
    }
    return Promise.resolve();
  }
  getQueryCache() {
    return this.#queryCache;
  }
  getMutationCache() {
    return this.#mutationCache;
  }
  getDefaultOptions() {
    return this.#defaultOptions;
  }
  setDefaultOptions(options) {
    this.#defaultOptions = options;
  }
  setQueryDefaults(queryKey, options) {
    this.#queryDefaults.set(hashKey(queryKey), {
      queryKey,
      defaultOptions: options
    });
  }
  getQueryDefaults(queryKey) {
    const defaults = [...this.#queryDefaults.values()];
    const result = {};
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(queryKey, queryDefault.queryKey)) {
        Object.assign(result, queryDefault.defaultOptions);
      }
    });
    return result;
  }
  setMutationDefaults(mutationKey, options) {
    this.#mutationDefaults.set(hashKey(mutationKey), {
      mutationKey,
      defaultOptions: options
    });
  }
  getMutationDefaults(mutationKey) {
    const defaults = [...this.#mutationDefaults.values()];
    const result = {};
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(mutationKey, queryDefault.mutationKey)) {
        Object.assign(result, queryDefault.defaultOptions);
      }
    });
    return result;
  }
  defaultQueryOptions(options) {
    if (options._defaulted) {
      return options;
    }
    const defaultedOptions = {
      ...this.#defaultOptions.queries,
      ...this.getQueryDefaults(options.queryKey),
      ...options,
      _defaulted: true
    };
    if (!defaultedOptions.queryHash) {
      defaultedOptions.queryHash = hashQueryKeyByOptions(
        defaultedOptions.queryKey,
        defaultedOptions
      );
    }
    if (defaultedOptions.refetchOnReconnect === void 0) {
      defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
    }
    if (defaultedOptions.throwOnError === void 0) {
      defaultedOptions.throwOnError = !!defaultedOptions.suspense;
    }
    if (!defaultedOptions.networkMode && defaultedOptions.persister) {
      defaultedOptions.networkMode = "offlineFirst";
    }
    if (defaultedOptions.queryFn === skipToken) {
      defaultedOptions.enabled = false;
    }
    return defaultedOptions;
  }
  defaultMutationOptions(options) {
    if (options?._defaulted) {
      return options;
    }
    return {
      ...this.#defaultOptions.mutations,
      ...options?.mutationKey && this.getMutationDefaults(options.mutationKey),
      ...options,
      _defaulted: true
    };
  }
  clear() {
    this.#queryCache.clear();
    this.#mutationCache.clear();
  }
};
function QueryClientProvider($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { client = new QueryClient(), children } = $$props;
    setQueryClientContext(client);
    onDestroy(() => {
      client.unmount();
    });
    children($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
function Icon($$renderer, $$props) {
  let type = fallback($$props["type"], "success");
  if (type === "success") {
    $$renderer.push("<!--[-->");
    $$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"></path></svg>`);
  } else if (type === "error") {
    $$renderer.push("<!--[1-->");
    $$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>`);
  } else if (type === "info") {
    $$renderer.push("<!--[2-->");
    $$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"></path></svg>`);
  } else if (type === "warning") {
    $$renderer.push("<!--[3-->");
    $$renderer.push(`<svg viewBox="0 0 64 64" fill="currentColor" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M32.427,7.987c2.183,0.124 4,1.165 5.096,3.281l17.936,36.208c1.739,3.66 -0.954,8.585 -5.373,8.656l-36.119,0c-4.022,-0.064 -7.322,-4.631 -5.352,-8.696l18.271,-36.207c0.342,-0.65 0.498,-0.838 0.793,-1.179c1.186,-1.375 2.483,-2.111 4.748,-2.063Zm-0.295,3.997c-0.687,0.034 -1.316,0.419 -1.659,1.017c-6.312,11.979 -12.397,24.081 -18.301,36.267c-0.546,1.225 0.391,2.797 1.762,2.863c12.06,0.195 24.125,0.195 36.185,0c1.325,-0.064 2.321,-1.584 1.769,-2.85c-5.793,-12.184 -11.765,-24.286 -17.966,-36.267c-0.366,-0.651 -0.903,-1.042 -1.79,-1.03Z"></path><path d="M33.631,40.581l-3.348,0l-0.368,-16.449l4.1,0l-0.384,16.449Zm-3.828,5.03c0,-0.609 0.197,-1.113 0.592,-1.514c0.396,-0.4 0.935,-0.601 1.618,-0.601c0.684,0 1.223,0.201 1.618,0.601c0.395,0.401 0.593,0.905 0.593,1.514c0,0.587 -0.193,1.078 -0.577,1.473c-0.385,0.395 -0.929,0.593 -1.634,0.593c-0.705,0 -1.249,-0.198 -1.634,-0.593c-0.384,-0.395 -0.576,-0.886 -0.576,-1.473Z"></path></svg>`);
  } else {
    $$renderer.push("<!--[!-->");
  }
  $$renderer.push(`<!--]-->`);
  bind_props($$props, { type });
}
function Loader($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let visible = $$props["visible"];
    const bars = Array(12).fill(0);
    $$renderer2.push(`<div class="sonner-loading-wrapper"${attr("data-visible", visible)}><div class="sonner-spinner"><!--[-->`);
    const each_array = ensure_array_like(bars);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      each_array[i];
      $$renderer2.push(`<div class="sonner-loading-bar"></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { visible });
  });
}
function Toast($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let isFront, isVisible, toastType, toastClass, toastDescriptionClass, heightIndex, coords, toastsHeightBefore, disabled, isPromiseLoadingOrInfiniteDuration;
    const TOAST_LIFETIME = 4e3;
    const GAP = 14;
    const TIME_BEFORE_UNMOUNT = 200;
    const defaultClasses = {
      toast: "",
      title: "",
      description: "",
      loader: "",
      closeButton: "",
      cancelButton: "",
      actionButton: "",
      action: "",
      warning: "",
      error: "",
      success: "",
      default: "",
      info: "",
      loading: ""
    };
    const { toasts, heights, removeHeight, remove } = toastState;
    let toast = $$props["toast"];
    let index = $$props["index"];
    let expanded = $$props["expanded"];
    let invert = $$props["invert"];
    let position = $$props["position"];
    let visibleToasts = $$props["visibleToasts"];
    let expandByDefault = $$props["expandByDefault"];
    let closeButton = $$props["closeButton"];
    let interacting = $$props["interacting"];
    let cancelButtonStyle = fallback($$props["cancelButtonStyle"], "");
    let actionButtonStyle = fallback($$props["actionButtonStyle"], "");
    let duration = fallback($$props["duration"], 4e3);
    let descriptionClass = fallback($$props["descriptionClass"], "");
    let classes = fallback($$props["classes"], () => ({}), true);
    let unstyled = fallback($$props["unstyled"], false);
    let mounted = false;
    let removed = false;
    let swiping = false;
    let swipeOut = false;
    let offsetBeforeRemove = 0;
    let initialHeight = 0;
    let offset = 0;
    let closeTimerStartTimeRef = 0;
    let lastCloseTimerStartTimeRef = 0;
    async function updateHeights() {
      {
        return;
      }
    }
    function deleteToast() {
      removed = true;
      offsetBeforeRemove = offset;
      removeHeight(toast.id);
      setTimeout(
        () => {
          remove(toast.id);
        },
        TIME_BEFORE_UNMOUNT
      );
    }
    let timeoutId;
    let remainingTime = toast.duration || duration || TOAST_LIFETIME;
    function pauseTimer() {
      if (lastCloseTimerStartTimeRef < closeTimerStartTimeRef) {
        const elapsedTime = (/* @__PURE__ */ new Date()).getTime() - closeTimerStartTimeRef;
        remainingTime = remainingTime - elapsedTime;
      }
      lastCloseTimerStartTimeRef = (/* @__PURE__ */ new Date()).getTime();
    }
    function startTimer() {
      closeTimerStartTimeRef = (/* @__PURE__ */ new Date()).getTime();
      timeoutId = setTimeout(
        () => {
          toast.onAutoClose?.(toast);
          deleteToast();
        },
        remainingTime
      );
    }
    let effect;
    classes = { ...defaultClasses, ...classes };
    isFront = index === 0;
    isVisible = index + 1 <= visibleToasts;
    toast.title;
    toast.description;
    toastType = toast.type;
    toastClass = toast.class || "";
    toastDescriptionClass = toast.descriptionClass || "";
    heightIndex = store_get($$store_subs ??= {}, "$heights", heights).findIndex((height) => height.toastId === toast.id) || 0;
    coords = position.split("-");
    toastsHeightBefore = store_get($$store_subs ??= {}, "$heights", heights).reduce(
      (prev, curr, reducerIndex) => {
        if (reducerIndex >= heightIndex) return prev;
        return prev + curr.height;
      },
      0
    );
    invert = toast.invert || invert;
    disabled = toastType === "loading";
    offset = Math.round(heightIndex * GAP + toastsHeightBefore);
    updateHeights();
    if (toast.updated) {
      clearTimeout(timeoutId);
      remainingTime = toast.duration || duration || TOAST_LIFETIME;
      startTimer();
    }
    isPromiseLoadingOrInfiniteDuration = toast.promise && toastType === "loading" || toast.duration === Number.POSITIVE_INFINITY;
    effect = useEffect(() => {
      if (!isPromiseLoadingOrInfiniteDuration) {
        if (expanded || interacting) {
          pauseTimer();
        } else {
          startTimer();
        }
      }
      return () => clearTimeout(timeoutId);
    });
    store_get($$store_subs ??= {}, "$effect", effect);
    if (toast.delete) {
      deleteToast();
    }
    $$renderer2.push(`<li${attr(
      "aria-live",
      // Ensure we maintain correct pointer capture even when going outside of the toast (e.g. when swiping)
      // Remove only if treshold is met
      // User is swiping in wrong direction so we disable swipe gesture
      // for the current pointer down interaction
      toast.important ? "assertive" : "polite"
    )} aria-atomic="true" role="status"${attr("tabindex", 0)}${attr_class(clsx(cn($$sanitized_props.class, toastClass, classes?.toast, toast?.classes?.toast, classes?.[toastType], toast?.classes?.[toastType])))} data-sonner-toast=""${attr("data-styled", !(toast.component || toast?.unstyled || unstyled))}${attr("data-mounted", mounted)}${attr("data-promise", Boolean(toast.promise))}${attr("data-removed", removed)}${attr("data-visible", isVisible)}${attr("data-y-position", coords[0])}${attr("data-x-position", coords[1])}${attr("data-index", index)}${attr("data-front", isFront)}${attr("data-swiping", swiping)}${attr("data-type", toastType)}${attr("data-invert", invert)}${attr("data-swipe-out", swipeOut)}${attr("data-expanded", Boolean(expanded || expandByDefault && mounted))}${attr_style(`${$$sanitized_props.style} ${toast.style}`, {
      "--index": index,
      "--toasts-before": index,
      "--z-index": store_get($$store_subs ??= {}, "$toasts", toasts).length - index,
      "--offset": `${removed ? offsetBeforeRemove : offset}px`,
      "--initial-height": `${initialHeight}px`
    })}>`);
    if (closeButton && !toast.component) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button aria-label="Close toast"${attr("data-disabled", disabled)} data-close-button=""${attr_class(clsx(cn(classes?.closeButton, toast?.classes?.closeButton)))}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (toast.component) {
      $$renderer2.push("<!--[-->");
      if (toast.component) {
        $$renderer2.push("<!--[-->");
        toast.component($$renderer2, spread_props([toast.componentProps]));
        $$renderer2.push("<!--]-->");
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push("<!--]-->");
      }
    } else {
      $$renderer2.push("<!--[!-->");
      if (toastType !== "default" || toast.icon || toast.promise) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div data-icon="">`);
        if ((toast.promise || toastType === "loading") && !toast.icon) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<!--[-->`);
          slot($$renderer2, $$props, "loading-icon", {}, null);
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (toast.icon) {
          $$renderer2.push("<!--[-->");
          if (toast.icon) {
            $$renderer2.push("<!--[-->");
            toast.icon($$renderer2, {});
            $$renderer2.push("<!--]-->");
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push("<!--]-->");
          }
        } else if (toastType === "success") {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<!--[-->`);
          slot($$renderer2, $$props, "success-icon", {}, null);
          $$renderer2.push(`<!--]-->`);
        } else if (toastType === "error") {
          $$renderer2.push("<!--[2-->");
          $$renderer2.push(`<!--[-->`);
          slot($$renderer2, $$props, "error-icon", {}, null);
          $$renderer2.push(`<!--]-->`);
        } else if (toastType === "warning") {
          $$renderer2.push("<!--[3-->");
          $$renderer2.push(`<!--[-->`);
          slot($$renderer2, $$props, "warning-icon", {}, null);
          $$renderer2.push(`<!--]-->`);
        } else if (toastType === "info") {
          $$renderer2.push("<!--[4-->");
          $$renderer2.push(`<!--[-->`);
          slot($$renderer2, $$props, "info-icon", {}, null);
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div data-content="">`);
      if (toast.title) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div data-title=""${attr_class(clsx(cn(classes?.title, toast?.classes?.title)))}>`);
        if (typeof toast.title !== "string") {
          $$renderer2.push("<!--[-->");
          if (toast.title) {
            $$renderer2.push("<!--[-->");
            toast.title($$renderer2, spread_props([toast.componentProps]));
            $$renderer2.push("<!--]-->");
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push("<!--]-->");
          }
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`${escape_html(toast.title)}`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (toast.description) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div data-description=""${attr_class(clsx(cn(descriptionClass, toastDescriptionClass, classes?.description, toast.classes?.description)))}>`);
        if (typeof toast.description !== "string") {
          $$renderer2.push("<!--[-->");
          if (toast.description) {
            $$renderer2.push("<!--[-->");
            toast.description($$renderer2, spread_props([toast.componentProps]));
            $$renderer2.push("<!--]-->");
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push("<!--]-->");
          }
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`${escape_html(toast.description)}`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (toast.cancel) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<button data-button="" data-cancel=""${attr_style(cancelButtonStyle)}${attr_class(clsx(cn(classes?.cancelButton, toast?.classes?.cancelButton)))}>${escape_html(toast.cancel.label)}</button>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (toast.action) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<button data-button=""${attr_style(actionButtonStyle)}${attr_class(clsx(cn(classes?.actionButton, toast?.classes?.actionButton)))}>${escape_html(toast.action.label)}</button>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></li>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      toast,
      index,
      expanded,
      invert,
      position,
      visibleToasts,
      expandByDefault,
      closeButton,
      interacting,
      cancelButtonStyle,
      actionButtonStyle,
      duration,
      descriptionClass,
      classes,
      unstyled
    });
  });
}
function Toaster($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "invert",
    "theme",
    "position",
    "hotkey",
    "containerAriaLabel",
    "richColors",
    "expand",
    "duration",
    "visibleToasts",
    "closeButton",
    "toastOptions",
    "offset",
    "dir"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let possiblePositions, hotkeyLabel;
    const VISIBLE_TOASTS_AMOUNT = 3;
    const VIEWPORT_OFFSET = "32px";
    const TOAST_WIDTH = 356;
    const GAP = 14;
    const DARK = "dark";
    const LIGHT = "light";
    function getInitialTheme(t) {
      if (t !== "system") {
        return t;
      }
      if (typeof window !== "undefined") {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          return DARK;
        }
        return LIGHT;
      }
      return LIGHT;
    }
    function getDocumentDirection() {
      if (typeof window === "undefined") return "ltr";
      if (typeof document === "undefined") return "ltr";
      const dirAttribute = document.documentElement.getAttribute("dir");
      if (dirAttribute === "auto" || !dirAttribute) {
        return window.getComputedStyle(document.documentElement).direction;
      }
      return dirAttribute;
    }
    let invert = fallback($$props["invert"], false);
    let theme = fallback($$props["theme"], "light");
    let position = fallback($$props["position"], "bottom-right");
    let hotkey = fallback($$props["hotkey"], () => ["altKey", "KeyT"], true);
    let containerAriaLabel = fallback($$props["containerAriaLabel"], "Notifications");
    let richColors = fallback($$props["richColors"], false);
    let expand = fallback($$props["expand"], false);
    let duration = fallback($$props["duration"], 4e3);
    let visibleToasts = fallback($$props["visibleToasts"], VISIBLE_TOASTS_AMOUNT);
    let closeButton = fallback($$props["closeButton"], false);
    let toastOptions = fallback($$props["toastOptions"], () => ({}), true);
    let offset = fallback($$props["offset"], null);
    let dir = fallback($$props["dir"], getDocumentDirection, true);
    const { toasts, heights } = toastState;
    let expanded = false;
    let interacting = false;
    let actualTheme = getInitialTheme(theme);
    onDestroy(() => {
    });
    possiblePositions = Array.from(new Set([
      position,
      ...store_get($$store_subs ??= {}, "$toasts", toasts).filter((toast) => toast.position).map((toast) => toast.position)
    ].filter(Boolean)));
    hotkeyLabel = hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
    if (store_get($$store_subs ??= {}, "$toasts", toasts).length <= 1) {
      expanded = false;
    }
    {
      const toastsToDismiss = store_get($$store_subs ??= {}, "$toasts", toasts).filter((toast) => toast.dismiss && !toast.delete);
      if (toastsToDismiss.length > 0) {
        const updatedToasts = store_get($$store_subs ??= {}, "$toasts", toasts).map((toast) => {
          const matchingToast = toastsToDismiss.find((dismissToast) => dismissToast.id === toast.id);
          if (matchingToast) {
            return { ...toast, delete: true };
          }
          return toast;
        });
        toasts.set(updatedToasts);
      }
    }
    {
      if (theme !== "system") {
        actualTheme = theme;
      }
      if (typeof window !== "undefined") {
        if (theme === "system") {
          if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            actualTheme = DARK;
          } else {
            actualTheme = LIGHT;
          }
        }
        const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
        const changeHandler = ({ matches }) => {
          actualTheme = matches ? DARK : LIGHT;
        };
        if ("addEventListener" in mediaQueryList) {
          mediaQueryList.addEventListener("change", changeHandler);
        } else {
          mediaQueryList.addListener(changeHandler);
        }
      }
    }
    if (store_get($$store_subs ??= {}, "$toasts", toasts).length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<section${attr("aria-label", `${containerAriaLabel} ${hotkeyLabel}`)}${attr("tabindex", -1)} class="svelte-d96yhj"><!--[-->`);
      const each_array = ensure_array_like(possiblePositions);
      for (let index = 0, $$length = each_array.length; index < $$length; index++) {
        let position2 = each_array[index];
        $$renderer2.push(`<ol${attributes(
          {
            tabindex: -1,
            class: clsx($$sanitized_props.class),
            "data-sonner-toaster": true,
            "data-theme": actualTheme,
            "data-rich-colors": richColors,
            dir: dir === "auto" ? getDocumentDirection() : dir,
            "data-y-position": position2.split("-")[0],
            "data-x-position": position2.split("-")[1],
            style: $$sanitized_props.style,
            ...$$restProps
          },
          "svelte-d96yhj",
          void 0,
          {
            "--front-toast-height": `${store_get($$store_subs ??= {}, "$heights", heights)[0]?.height}px`,
            "--offset": typeof offset === "number" ? `${offset}px` : offset || VIEWPORT_OFFSET,
            "--width": `${TOAST_WIDTH}px`,
            "--gap": `${GAP}px`
          }
        )}><!--[-->`);
        const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$toasts", toasts).filter((toast) => !toast.position && index === 0 || toast.position === position2));
        for (let index2 = 0, $$length2 = each_array_1.length; index2 < $$length2; index2++) {
          let toast = each_array_1[index2];
          Toast($$renderer2, {
            index: index2,
            toast,
            invert,
            visibleToasts,
            closeButton,
            interacting,
            position: position2,
            expandByDefault: expand,
            expanded,
            actionButtonStyle: toastOptions?.actionButtonStyle || "",
            cancelButtonStyle: toastOptions?.cancelButtonStyle || "",
            class: toastOptions?.class || "",
            descriptionClass: toastOptions?.descriptionClass || "",
            classes: toastOptions.classes || {},
            duration: toastOptions?.duration ?? duration,
            unstyled: toastOptions.unstyled || false,
            $$slots: {
              "loading-icon": ($$renderer3) => {
                $$renderer3.push(`<!--[-->`);
                slot($$renderer3, $$props, "loading-icon", {}, () => {
                  Loader($$renderer3, { visible: toast.type === "loading" });
                });
                $$renderer3.push(`<!--]-->`);
              },
              "success-icon": ($$renderer3) => {
                $$renderer3.push(`<!--[-->`);
                slot($$renderer3, $$props, "success-icon", {}, () => {
                  Icon($$renderer3, { type: "success" });
                });
                $$renderer3.push(`<!--]-->`);
              },
              "error-icon": ($$renderer3) => {
                $$renderer3.push(`<!--[-->`);
                slot($$renderer3, $$props, "error-icon", {}, () => {
                  Icon($$renderer3, { type: "error" });
                });
                $$renderer3.push(`<!--]-->`);
              },
              "warning-icon": ($$renderer3) => {
                $$renderer3.push(`<!--[-->`);
                slot($$renderer3, $$props, "warning-icon", {}, () => {
                  Icon($$renderer3, { type: "warning" });
                });
                $$renderer3.push(`<!--]-->`);
              },
              "info-icon": ($$renderer3) => {
                $$renderer3.push(`<!--[-->`);
                slot($$renderer3, $$props, "info-icon", {}, () => {
                  Icon($$renderer3, { type: "info" });
                });
                $$renderer3.push(`<!--]-->`);
              }
            }
          });
        }
        $$renderer2.push(`<!--]--></ol>`);
      }
      $$renderer2.push(`<!--]--></section>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      invert,
      theme,
      position,
      hotkey,
      containerAriaLabel,
      richColors,
      expand,
      duration,
      visibleToasts,
      closeButton,
      toastOptions,
      offset,
      dir
    });
  });
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { children } = $$props;
    const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 3e4, retry: 1 } } });
    QueryClientProvider($$renderer2, {
      client: (
        // Redirect logic
        queryClient
      ),
      children: ($$renderer3) => {
        Toaster($$renderer3, { richColors: true, position: "top-right" });
        $$renderer3.push(`<!----> `);
        if (store_get($$store_subs ??= {}, "$auth", auth).loading) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="h-screen w-screen flex flex-col items-center justify-center bg-background gap-4"><div class="w-8 h-8 rounded-full border-4 border-primary border-r-transparent animate-spin"></div> <p class="text-sm text-muted-foreground animate-pulse">Loading workspace...</p></div>`);
        } else {
          $$renderer3.push("<!--[!-->");
          children($$renderer3);
          $$renderer3.push(`<!---->`);
        }
        $$renderer3.push(`<!--]-->`);
      }
    });
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _layout as default
};
