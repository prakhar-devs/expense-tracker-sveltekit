import { s as supabase } from "./supabaseClient.js";
import { S as Subscribable, q as pendingThenable, t as resolveEnabled, u as shallowEqualObjects, r as resolveStaleTime, d as noop, v as isServer, w as isValidTimeout, x as timeUntilStale, y as timeoutManager, g as focusManager, z as fetchState, A as replaceData, n as notifyManager, j as hashKey, B as getDefaultState, C as getIsRestoringContext, D as getQueryClientContext, l as auth } from "./auth.js";
import { format, subMonths } from "date-fns";
import { g as get } from "./index.js";
import { n as derived } from "./index2.js";
import "clsx";
import { a as SvelteSet } from "./index-server.js";
var QueryObserver = class extends Subscribable {
  constructor(client, options) {
    super();
    this.options = options;
    this.#client = client;
    this.#selectError = null;
    this.#currentThenable = pendingThenable();
    this.bindMethods();
    this.setOptions(options);
  }
  #client;
  #currentQuery = void 0;
  #currentQueryInitialState = void 0;
  #currentResult = void 0;
  #currentResultState;
  #currentResultOptions;
  #currentThenable;
  #selectError;
  #selectFn;
  #selectResult;
  // This property keeps track of the last query with defined data.
  // It will be used to pass the previous data and query to the placeholder function between renders.
  #lastQueryWithDefinedData;
  #staleTimeoutId;
  #refetchIntervalId;
  #currentRefetchInterval;
  #trackedProps = /* @__PURE__ */ new Set();
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      this.#currentQuery.addObserver(this);
      if (shouldFetchOnMount(this.#currentQuery, this.options)) {
        this.#executeFetch();
      } else {
        this.updateResult();
      }
      this.#updateTimers();
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      this.#currentQuery,
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      this.#currentQuery,
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    this.#clearStaleTimeout();
    this.#clearRefetchInterval();
    this.#currentQuery.removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = this.#currentQuery;
    this.options = this.#client.defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, this.#currentQuery) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    this.#updateQuery();
    this.#currentQuery.setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      this.#client.getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: this.#currentQuery,
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      this.#currentQuery,
      prevQuery,
      this.options,
      prevOptions
    )) {
      this.#executeFetch();
    }
    this.updateResult();
    if (mounted && (this.#currentQuery !== prevQuery || resolveEnabled(this.options.enabled, this.#currentQuery) !== resolveEnabled(prevOptions.enabled, this.#currentQuery) || resolveStaleTime(this.options.staleTime, this.#currentQuery) !== resolveStaleTime(prevOptions.staleTime, this.#currentQuery))) {
      this.#updateStaleTimeout();
    }
    const nextRefetchInterval = this.#computeRefetchInterval();
    if (mounted && (this.#currentQuery !== prevQuery || resolveEnabled(this.options.enabled, this.#currentQuery) !== resolveEnabled(prevOptions.enabled, this.#currentQuery) || nextRefetchInterval !== this.#currentRefetchInterval)) {
      this.#updateRefetchInterval(nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = this.#client.getQueryCache().build(this.#client, options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      this.#currentResult = result;
      this.#currentResultOptions = this.options;
      this.#currentResultState = this.#currentQuery.state;
    }
    return result;
  }
  getCurrentResult() {
    return this.#currentResult;
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked?.(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && this.#currentThenable.status === "pending") {
            this.#currentThenable.reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    this.#trackedProps.add(key);
  }
  getCurrentQuery() {
    return this.#currentQuery;
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = this.#client.defaultQueryOptions(options);
    const query = this.#client.getQueryCache().build(this.#client, defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return this.#executeFetch({
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return this.#currentResult;
    });
  }
  #executeFetch(fetchOptions) {
    this.#updateQuery();
    let promise = this.#currentQuery.fetch(
      this.options,
      fetchOptions
    );
    if (!fetchOptions?.throwOnError) {
      promise = promise.catch(noop);
    }
    return promise;
  }
  #updateStaleTimeout() {
    this.#clearStaleTimeout();
    const staleTime = resolveStaleTime(
      this.options.staleTime,
      this.#currentQuery
    );
    if (isServer || this.#currentResult.isStale || !isValidTimeout(staleTime)) {
      return;
    }
    const time = timeUntilStale(this.#currentResult.dataUpdatedAt, staleTime);
    const timeout = time + 1;
    this.#staleTimeoutId = timeoutManager.setTimeout(() => {
      if (!this.#currentResult.isStale) {
        this.updateResult();
      }
    }, timeout);
  }
  #computeRefetchInterval() {
    return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(this.#currentQuery) : this.options.refetchInterval) ?? false;
  }
  #updateRefetchInterval(nextInterval) {
    this.#clearRefetchInterval();
    this.#currentRefetchInterval = nextInterval;
    if (isServer || resolveEnabled(this.options.enabled, this.#currentQuery) === false || !isValidTimeout(this.#currentRefetchInterval) || this.#currentRefetchInterval === 0) {
      return;
    }
    this.#refetchIntervalId = timeoutManager.setInterval(() => {
      if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
        this.#executeFetch();
      }
    }, this.#currentRefetchInterval);
  }
  #updateTimers() {
    this.#updateStaleTimeout();
    this.#updateRefetchInterval(this.#computeRefetchInterval());
  }
  #clearStaleTimeout() {
    if (this.#staleTimeoutId) {
      timeoutManager.clearTimeout(this.#staleTimeoutId);
      this.#staleTimeoutId = void 0;
    }
  }
  #clearRefetchInterval() {
    if (this.#refetchIntervalId) {
      timeoutManager.clearInterval(this.#refetchIntervalId);
      this.#refetchIntervalId = void 0;
    }
  }
  createResult(query, options) {
    const prevQuery = this.#currentQuery;
    const prevOptions = this.options;
    const prevResult = this.#currentResult;
    const prevResultState = this.#currentResultState;
    const prevResultOptions = this.#currentResultOptions;
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : this.#currentQueryInitialState;
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if (prevResult?.isPlaceholderData && options.placeholderData === prevResultOptions?.placeholderData) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          this.#lastQueryWithDefinedData?.state.data,
          this.#lastQueryWithDefinedData
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult?.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === prevResultState?.data && options.select === this.#selectFn) {
        data = this.#selectResult;
      } else {
        try {
          this.#selectFn = options.select;
          data = options.select(data);
          data = replaceData(prevResult?.data, data, options);
          this.#selectResult = data;
          this.#selectError = null;
        } catch (selectError) {
          this.#selectError = selectError;
        }
      }
    }
    if (this.#selectError) {
      error = this.#selectError;
      data = this.#selectResult;
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: newState.dataUpdateCount > 0 || newState.errorUpdateCount > 0,
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: this.#currentThenable,
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = this.#currentThenable = nextResult.promise = pendingThenable();
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = this.#currentThenable;
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = this.#currentResult;
    const nextResult = this.createResult(this.#currentQuery, this.options);
    this.#currentResultState = this.#currentQuery.state;
    this.#currentResultOptions = this.options;
    if (this.#currentResultState.data !== void 0) {
      this.#lastQueryWithDefinedData = this.#currentQuery;
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    this.#currentResult = nextResult;
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !this.#trackedProps.size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? this.#trackedProps
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(this.#currentResult).some((key) => {
        const typedKey = key;
        const changed = this.#currentResult[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    this.#notify({ listeners: shouldNotifyListeners() });
  }
  #updateQuery() {
    const query = this.#client.getQueryCache().build(this.#client, this.options);
    if (query === this.#currentQuery) {
      return;
    }
    const prevQuery = this.#currentQuery;
    this.#currentQuery = query;
    this.#currentQueryInitialState = query.state;
    if (this.hasListeners()) {
      prevQuery?.removeObserver(this);
      query.addObserver(this);
    }
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      this.#updateTimers();
    }
  }
  #notify(notifyOptions) {
    notifyManager.batch(() => {
      if (notifyOptions.listeners) {
        this.listeners.forEach((listener) => {
          listener(this.#currentResult);
        });
      }
      this.#client.getQueryCache().notify({
        query: this.#currentQuery,
        type: "observerResultsUpdated"
      });
    });
  }
};
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var MutationObserver = class extends Subscribable {
  #client;
  #currentResult = void 0;
  #currentMutation;
  #mutateOptions;
  constructor(client, options) {
    super();
    this.#client = client;
    this.setOptions(options);
    this.bindMethods();
    this.#updateResult();
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    this.options = this.#client.defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      this.#client.getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: this.#currentMutation,
        observer: this
      });
    }
    if (prevOptions?.mutationKey && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (this.#currentMutation?.state.status === "pending") {
      this.#currentMutation.setOptions(this.options);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.#currentMutation?.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    this.#updateResult();
    this.#notify(action);
  }
  getCurrentResult() {
    return this.#currentResult;
  }
  reset() {
    this.#currentMutation?.removeObserver(this);
    this.#currentMutation = void 0;
    this.#updateResult();
    this.#notify();
  }
  mutate(variables, options) {
    this.#mutateOptions = options;
    this.#currentMutation?.removeObserver(this);
    this.#currentMutation = this.#client.getMutationCache().build(this.#client, this.options);
    this.#currentMutation.addObserver(this);
    return this.#currentMutation.execute(variables);
  }
  #updateResult() {
    const state = this.#currentMutation?.state ?? getDefaultState();
    this.#currentResult = {
      ...state,
      isPending: state.status === "pending",
      isSuccess: state.status === "success",
      isError: state.status === "error",
      isIdle: state.status === "idle",
      mutate: this.mutate,
      reset: this.reset
    };
  }
  #notify(action) {
    notifyManager.batch(() => {
      if (this.#mutateOptions && this.hasListeners()) {
        const variables = this.#currentResult.variables;
        const onMutateResult = this.#currentResult.context;
        const context = {
          client: this.#client,
          meta: this.options.meta,
          mutationKey: this.options.mutationKey
        };
        if (action?.type === "success") {
          try {
            this.#mutateOptions.onSuccess?.(
              action.data,
              variables,
              onMutateResult,
              context
            );
          } catch (e) {
            void Promise.reject(e);
          }
          try {
            this.#mutateOptions.onSettled?.(
              action.data,
              null,
              variables,
              onMutateResult,
              context
            );
          } catch (e) {
            void Promise.reject(e);
          }
        } else if (action?.type === "error") {
          try {
            this.#mutateOptions.onError?.(
              action.error,
              variables,
              onMutateResult,
              context
            );
          } catch (e) {
            void Promise.reject(e);
          }
          try {
            this.#mutateOptions.onSettled?.(
              void 0,
              action.error,
              variables,
              onMutateResult,
              context
            );
          } catch (e) {
            void Promise.reject(e);
          }
        }
      }
      this.listeners.forEach((listener) => {
        listener(this.#currentResult);
      });
    });
  }
};
function useIsRestoring() {
  return getIsRestoringContext();
}
function useQueryClient(queryClient) {
  return getQueryClientContext();
}
(function(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
});
(function(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
});
function createRawRef(init) {
  const refObj = Array.isArray(init) ? [] : {};
  const hiddenKeys = new SvelteSet();
  const out = new Proxy(refObj, {
    set(target, prop, value, receiver) {
      hiddenKeys.delete(prop);
      if (prop in target) {
        return Reflect.set(target, prop, value, receiver);
      }
      let state = value;
      Object.defineProperty(target, prop, {
        configurable: true,
        enumerable: true,
        get: () => {
          return state && isBranded(state) ? state() : state;
        },
        set: (v) => {
          state = v;
        }
      });
      return true;
    },
    has: (target, prop) => {
      if (hiddenKeys.has(prop)) {
        return false;
      }
      return prop in target;
    },
    ownKeys(target) {
      return Reflect.ownKeys(target).filter((key) => !hiddenKeys.has(key));
    },
    getOwnPropertyDescriptor(target, prop) {
      if (hiddenKeys.has(prop)) {
        return void 0;
      }
      return Reflect.getOwnPropertyDescriptor(target, prop);
    },
    deleteProperty(target, prop) {
      if (prop in target) {
        target[prop] = void 0;
        hiddenKeys.add(prop);
        if (Array.isArray(target)) {
          target.length--;
        }
        return true;
      }
      return false;
    }
  });
  function update(newValue) {
    const existingKeys = Object.keys(out);
    const newKeys = Object.keys(newValue);
    const keysToRemove = existingKeys.filter((key) => !newKeys.includes(key));
    for (const key of keysToRemove) {
      delete out[key];
    }
    for (const key of newKeys) {
      out[key] = brand(() => newValue[key]);
    }
  }
  update(init);
  return [out, update];
}
const lazyBrand = Symbol("LazyValue");
function brand(fn) {
  fn[lazyBrand] = true;
  return fn;
}
function isBranded(fn) {
  return Boolean(fn[lazyBrand]);
}
function createBaseQuery(options, Observer, queryClient) {
  const client = derived(() => useQueryClient());
  const isRestoring = useIsRestoring();
  const resolvedOptions = derived(() => {
    const opts = client().defaultQueryOptions(options());
    opts._optimisticResults = isRestoring.current ? "isRestoring" : "optimistic";
    return opts;
  });
  let observer = new Observer(client(), resolvedOptions());
  function createResult() {
    const result = observer.getOptimisticResult(resolvedOptions());
    return !resolvedOptions().notifyOnChangeProps ? observer.trackResult(result) : result;
  }
  const [query] = createRawRef(
    // svelte-ignore state_referenced_locally - intentional, initial value
    createResult()
  );
  return query;
}
function createQuery(options, queryClient) {
  return createBaseQuery(options, QueryObserver);
}
function createMutation(options, queryClient) {
  const client = derived(() => useQueryClient());
  let observer = (
    // svelte-ignore state_referenced_locally - intentional, initial value
    new MutationObserver(client(), options())
  );
  const mutate = (variables, mutateOptions) => {
    observer.mutate(variables, mutateOptions).catch(noop);
  };
  let result = observer.getCurrentResult();
  const resultProxy = derived(() => new Proxy(result, {
    get: (_, prop) => {
      const r = { ...result, mutate, mutateAsync: result.mutate };
      if (prop == "value") return r;
      return r[prop];
    }
  }));
  return resultProxy();
}
const PAGE_SIZE = 20;
function getUserId() {
  return get(auth).user?.id;
}
function createTransactionsQuery(getUserId2, initialData) {
  return createQuery(() => {
    const userId = getUserId2();
    return {
      queryKey: ["transactions", userId],
      queryFn: async () => {
        const since = format(subMonths(/* @__PURE__ */ new Date(), 12), "yyyy-MM-dd");
        const { data, error } = await supabase.from("transactions").select("*").gte("date", since).order("date", { ascending: false }).order("created_at", { ascending: false });
        if (error) throw error;
        return data;
      },
      enabled: !!userId,
      initialData
    };
  });
}
function createTransactionsPagedQuery(getUserId2, getPage, getFilters = () => ({}), getInitialData) {
  return createQuery(() => {
    const userId = getUserId2();
    const page = getPage();
    const filters = getFilters();
    const initialData = getInitialData?.();
    return {
      queryKey: ["transactions-paged", userId, page, filters],
      queryFn: async () => {
        if (!userId) {
          return { data: [], total: 0, page: 1, totalPages: 1 };
        }
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        let countQ = supabase.from("transactions").select("id", { count: "exact", head: true });
        let dataQ = supabase.from("transactions").select("*").order("date", { ascending: false }).order("created_at", { ascending: false }).range(from, to);
        if (filters.type && filters.type !== "all") {
          countQ = countQ.eq("type", filters.type);
          dataQ = dataQ.eq("type", filters.type);
        }
        if (filters.category && filters.category !== "all") {
          countQ = countQ.eq("category", filters.category);
          dataQ = dataQ.eq("category", filters.category);
        }
        if (filters.dateFrom) {
          countQ = countQ.gte("date", filters.dateFrom);
          dataQ = dataQ.gte("date", filters.dateFrom);
        }
        if (filters.dateTo) {
          countQ = countQ.lte("date", filters.dateTo);
          dataQ = dataQ.lte("date", filters.dateTo);
        }
        if (filters.search) {
          const term = `%${filters.search}%`;
          countQ = countQ.or(`category.ilike.${term},note.ilike.${term}`);
          dataQ = dataQ.or(`category.ilike.${term},note.ilike.${term}`);
        }
        const [{ count, error: cErr }, { data, error: dErr }] = await Promise.all([countQ, dataQ]);
        if (cErr) throw cErr;
        if (dErr) throw dErr;
        const total = count ?? 0;
        return { data: data ?? [], total, page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
      },
      enabled: !!userId,
      initialData,
      placeholderData: (prev) => prev
    };
  });
}
function createAddTransactionMutation() {
  const qc = useQueryClient();
  const userId = getUserId();
  return createMutation(() => ({
    mutationFn: async (tx) => {
      const { data, error } = await supabase.from("transactions").insert({ ...tx, user_id: userId }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["transactions-paged"] });
      qc.invalidateQueries({ queryKey: ["budgets"] });
    }
  }));
}
function createUpdateTransactionMutation() {
  const qc = useQueryClient();
  return createMutation(() => ({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase.from("transactions").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["transactions-paged"] });
      qc.invalidateQueries({ queryKey: ["budgets"] });
    }
  }));
}
function createDeleteTransactionMutation() {
  const qc = useQueryClient();
  return createMutation(() => ({
    mutationFn: async (id) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["transactions-paged"] });
      qc.invalidateQueries({ queryKey: ["budgets"] });
    }
  }));
}
function createCategoriesQuery(getUserId2, initialData) {
  return createQuery(() => {
    const userId = getUserId2();
    return {
      queryKey: ["categories", userId],
      queryFn: async () => {
        const { data, error } = await supabase.from("categories").select("*").order("created_at", { ascending: true }).limit(100);
        if (error) throw error;
        return data;
      },
      enabled: !!userId
    };
  });
}
function createAddCategoryMutation() {
  const qc = useQueryClient();
  const userId = getUserId();
  return createMutation(() => ({
    mutationFn: async (cat) => {
      const { data, error } = await supabase.from("categories").insert({ ...cat, user_id: userId }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] })
  }));
}
function createDeleteCategoryMutation() {
  const qc = useQueryClient();
  return createMutation(() => ({
    mutationFn: async (id) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] })
  }));
}
function createUpdateProfileMutation() {
  const qc = useQueryClient();
  const userId = getUserId();
  return createMutation(() => ({
    mutationFn: async (updates) => {
      const { data, error } = await supabase.from("profiles").update(updates).eq("user_id", userId).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] })
  }));
}
function createRecurringTransactionsQuery(getUserId2, initialData) {
  return createQuery(() => {
    const userId = getUserId2();
    return {
      queryKey: ["recurring", userId],
      queryFn: async () => {
        const { data, error } = await supabase.from("recurring_transactions").select("*").order("created_at", { ascending: false }).limit(200);
        if (error) throw error;
        return data;
      },
      enabled: !!userId
    };
  });
}
function createAddRecurringMutation() {
  const qc = useQueryClient();
  const userId = getUserId();
  return createMutation(() => ({
    mutationFn: async (rec) => {
      const { data, error } = await supabase.from("recurring_transactions").insert({ ...rec, user_id: userId, occurrences_created: 0 }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recurring"] })
  }));
}
function createUpdateRecurringMutation() {
  const qc = useQueryClient();
  return createMutation(() => ({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase.from("recurring_transactions").update({ ...updates, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recurring"] })
  }));
}
function createDeleteRecurringMutation() {
  const qc = useQueryClient();
  return createMutation(() => ({
    mutationFn: async (id) => {
      const { error } = await supabase.from("recurring_transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recurring"] })
  }));
}
function createBudgetsQuery(getUserId2, initialData) {
  return createQuery(() => {
    const userId = getUserId2();
    return {
      queryKey: ["budgets", userId],
      queryFn: async () => {
        const { data, error } = await supabase.from("budgets").select("*").order("created_at", { ascending: false }).limit(100);
        if (error) throw error;
        return data;
      },
      enabled: !!userId
    };
  });
}
export {
  PAGE_SIZE as P,
  createBudgetsQuery as a,
  createRecurringTransactionsQuery as b,
  createTransactionsQuery as c,
  createCategoriesQuery as d,
  createAddCategoryMutation as e,
  createDeleteCategoryMutation as f,
  createUpdateProfileMutation as g,
  createUpdateRecurringMutation as h,
  createDeleteRecurringMutation as i,
  createTransactionsPagedQuery as j,
  createDeleteTransactionMutation as k,
  createAddTransactionMutation as l,
  createUpdateTransactionMutation as m,
  createAddRecurringMutation as n
};
