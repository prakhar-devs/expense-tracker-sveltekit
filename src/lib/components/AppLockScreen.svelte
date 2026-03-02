<script lang="ts">
    import { onMount } from "svelte";
    import { fade, scale } from "svelte/transition";
    import { Lock, Fingerprint, Delete } from "lucide-svelte";
    import { preferencesStore } from "$lib/stores/preferences.svelte";
    import { verifyBiometrics } from "$lib/biometrics";
    import { cn } from "$lib/utils";

    let { unlocked = $bindable(false) } = $props<{ unlocked?: boolean }>();

    let pin = $state("");
    let error = $state(false);
    let verifying = $state(false);

    const storedPin = $derived(preferencesStore.appLockPin);
    const isBiometricsEnabled = $derived(preferencesStore.biometricsEnabled);
    // If we stored the credential ID in local storage when enabling biometrics, we'd retrieve it.
    // We'll store it directly in localStorage as 'webauthn-credential'
    let credentialId = "";

    onMount(() => {
        credentialId = localStorage.getItem("webauthn-credential") || "";
        if (isBiometricsEnabled && credentialId) {
            triggerBiometrics();
        }
    });

    async function triggerBiometrics() {
        if (verifying || !credentialId) return;
        verifying = true;
        const success = await verifyBiometrics(credentialId);
        if (success) {
            unlocked = true;
        } else {
            error = true;
            setTimeout(() => (error = false), 1000);
        }
        verifying = false;
    }

    function handleKeyPress(num: number) {
        if (pin.length < 4) {
            pin += num.toString();
            error = false;
            if (pin.length === 4) {
                verifyPin();
            }
        }
    }

    function handleBackspace() {
        if (pin.length > 0) {
            pin = pin.slice(0, -1);
            error = false;
        }
    }

    function verifyPin() {
        if (pin === storedPin) {
            unlocked = true;
        } else {
            error = true;
            setTimeout(() => {
                pin = "";
                error = false;
            }, 500);
        }
    }
</script>

<div
    class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md"
    in:fade={{ duration: 300 }}
    out:fade={{ duration: 300 }}
>
    <div class="flex flex-col items-center max-w-sm w-full px-6 text-center">
        <div
            class="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6"
        >
            <Lock class="h-8 w-8" />
        </div>

        <h1 class="font-display text-2xl font-bold mb-2">App Locked</h1>
        <p class="text-sm text-muted-foreground mb-8">
            Enter your 4-digit PIN to access SpendWise
        </p>

        <!-- PIN Dots -->
        <div
            class={cn(
                "flex gap-4 mb-10 transition-transform",
                error && "animate-shake text-destructive",
            )}
        >
            {#each Array(4) as _, i}
                <div
                    class={cn(
                        "w-4 h-4 rounded-full border-2 transition-all duration-200",
                        pin.length > i
                            ? "bg-primary border-primary"
                            : "border-muted-foreground/30 bg-transparent",
                        error && "bg-destructive border-destructive",
                    )}
                ></div>
            {/each}
        </div>

        <!-- Numpad -->
        <div class="grid grid-cols-3 gap-4 md:gap-6 mb-8 w-full max-w-[280px]">
            {#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as num}
                <button
                    onclick={() => handleKeyPress(num)}
                    class="h-16 rounded-full text-2xl font-medium bg-muted/30 hover:bg-muted active:bg-muted/80 transition-colors"
                >
                    {num}
                </button>
            {/each}

            <!-- Biometrics / Empty -->
            <div class="flex items-center justify-center">
                {#if isBiometricsEnabled && credentialId}
                    <button
                        onclick={triggerBiometrics}
                        class="h-16 w-16 flex items-center justify-center rounded-full text-primary hover:bg-primary/10 transition-colors"
                        disabled={verifying}
                    >
                        <Fingerprint
                            class={cn("h-8 w-8", verifying && "animate-pulse")}
                        />
                    </button>
                {/if}
            </div>

            <!-- Zero -->
            <button
                onclick={() => handleKeyPress(0)}
                class="h-16 rounded-full text-2xl font-medium bg-muted/30 hover:bg-muted active:bg-muted/80 transition-colors"
            >
                0
            </button>

            <!-- Backspace -->
            <button
                onclick={handleBackspace}
                class="h-16 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted/50 transition-colors"
            >
                <Delete class="h-6 w-6" />
            </button>
        </div>
    </div>
</div>

<style>
    @keyframes shake {
        0%,
        100% {
            transform: translateX(0);
        }
        10%,
        30%,
        50%,
        70%,
        90% {
            transform: translateX(-5px);
        }
        20%,
        40%,
        60%,
        80% {
            transform: translateX(5px);
        }
    }
    .animate-shake {
        animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
</style>
