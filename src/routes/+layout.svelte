<script lang="ts">
  let { children } = $props();
  import "../app.css";
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { auth } from "$lib/stores/auth.svelte";
  import { preferencesStore } from "$lib/stores/preferences.svelte";
  import { Toaster } from "svelte-sonner";
  import AppLockScreen from "$lib/components/AppLockScreen.svelte";

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
      },
    },
  });

  let appUnlocked = $state(false);
  let requiresLock = $derived(
    preferencesStore.appLockEnabled &&
      preferencesStore.appLockPin &&
      preferencesStore.appLockPin.length === 4 &&
      auth.user &&
      page.url.pathname !== "/auth" &&
      !appUnlocked,
  );

  onMount(() => {
    // Note: initialize() and destroy() are now part of the AuthStore class
    // they don't necessarily need to be called if constructor handles it,
    // but initialize() sets up the listener.
    return () => auth.destroy();
  });

  // Redirect & Sync Preferences logic
  let loadedPrefsUserId = $state<string | null>(null);

  $effect(() => {
    if (!auth.loading) {
      const isAuthPage = page.url.pathname === "/auth";
      if (!auth.user && !isAuthPage) {
        goto("/auth");
      } else if (auth.user && isAuthPage) {
        goto("/");
      }

      if (auth.user && loadedPrefsUserId !== auth.user.id) {
        loadedPrefsUserId = auth.user.id;
        supabase
          .from("profiles")
          .select("preferences")
          .eq("user_id", auth.user.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data?.preferences) {
              // Apply database preferences locally (false = do not echo back to DB)
              preferencesStore.mergePreferences(data.preferences, false);
            }
          });
      }
    }
  });
</script>

<QueryClientProvider client={queryClient}>
  <Toaster richColors position="top-right" />
  {#if requiresLock}
    <AppLockScreen bind:unlocked={appUnlocked} />
  {/if}
  {#if auth.loading}
    <div
      class="h-screen w-screen flex flex-col items-center justify-center bg-background gap-4"
    >
      <div
        class="w-8 h-8 rounded-full border-4 border-primary border-r-transparent animate-spin"
      ></div>
      <p class="text-sm text-muted-foreground animate-pulse">
        Loading workspace...
      </p>
    </div>
  {:else}
    {@render children()}
  {/if}
</QueryClientProvider>
