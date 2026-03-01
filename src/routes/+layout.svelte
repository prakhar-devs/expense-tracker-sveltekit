<script lang="ts">
  let { children } = $props();
  import "../app.css";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { auth } from "$lib/stores/auth";
  import { preferencesStore } from "$lib/stores/preferences";
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
    $preferencesStore.appLockEnabled &&
      $preferencesStore.appLockPin &&
      $preferencesStore.appLockPin.length === 4 &&
      $auth.user &&
      $page.url.pathname !== "/auth" &&
      !appUnlocked,
  );

  onMount(() => {
    auth.initialize();
    preferencesStore.initApply();

    return () => auth.destroy();
  });

  // Redirect logic
  $effect(() => {
    if (!$auth.loading) {
      const isAuthPage = $page.url.pathname === "/auth";
      if (!$auth.user && !isAuthPage) {
        goto("/auth");
      } else if ($auth.user && isAuthPage) {
        goto("/");
      }
    }
  });
</script>

<QueryClientProvider client={queryClient}>
  <Toaster richColors position="top-right" />
  {#if requiresLock}
    <AppLockScreen bind:unlocked={appUnlocked} />
  {/if}
  {#if $auth.loading}
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
