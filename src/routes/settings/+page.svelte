<script lang="ts">
    import {
        Moon,
        Sun,
        Monitor,
        Layout,
        Palette,
        Globe,
        Check,
        Shield,
        Lock,
    } from "lucide-svelte";
    import { onMount } from "svelte";
    import * as Card from "$lib/components/ui/card";
    import { registerBiometrics, isBiometricsSupported } from "$lib/biometrics";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
    import { Switch } from "$lib/components/ui/switch";
    import * as Select from "$lib/components/ui/select";
    import { preferencesStore } from "$lib/stores/preferences.svelte";
    import { cn } from "$lib/utils";
    import { toast } from "svelte-sonner";
    import AppLayout from "$lib/components/AppLayout.svelte";

    const ACCENT_COLORS = [
        { name: "Slate", value: "#0f172a" },
        { name: "Blue", value: "#3b82f6" },
        { name: "Purple", value: "#a855f7" },
        { name: "Pink", value: "#ec4899" },
        { name: "Orange", value: "#f97316" },
        { name: "Green", value: "#22c55e" },
    ];

    const CURRENCIES = [
        { label: "US Dollar ($)", value: "USD" },
        { label: "Euro (€)", value: "EUR" },
        { label: "Indian Rupee (₹)", value: "INR" },
        { label: "Pound Sterling (£)", value: "GBP" },
        { label: "Yen (¥)", value: "JPY" },
    ];

    const themes = [
        { id: "light", label: "Light", icon: Sun },
        { id: "dark", label: "Dark", icon: Moon },
        { id: "system", label: "System", icon: Monitor },
    ];

    let customColor = $state(preferencesStore.accentColor);
    let currency = $derived(preferencesStore.currency);
    let firstDayOfWeek = $derived(preferencesStore.firstDayOfWeek);

    let pinInput = $state(preferencesStore.appLockPin);
    let biometricsAvailable = $state(false);

    onMount(async () => {
        biometricsAvailable = await isBiometricsSupported();
    });

    async function handleBiometricToggle(enabled: boolean) {
        if (enabled) {
            const credentialId = await registerBiometrics();
            if (credentialId) {
                localStorage.setItem("webauthn-credential", credentialId);
                handleUpdate({ biometricsEnabled: true });
                toast.success("Biometrics registered successfully");
            } else {
                handleUpdate({ biometricsEnabled: false });
                toast.error("Failed to register biometrics");
            }
        } else {
            localStorage.removeItem("webauthn-credential");
            handleUpdate({ biometricsEnabled: false });
        }
    }

    function handleUpdate(updates: any) {
        try {
            preferencesStore.mergePreferences(updates);
            toast.success("Preferences updated");
        } catch (e: any) {
            toast.error("Failed to update preferences");
        }
    }
</script>

<AppLayout>
    <div class="mx-auto max-w-4xl space-y-8 animate-fade-in">
        <div>
            <h1 class="font-display text-3xl font-bold text-foreground">
                Settings
            </h1>
            <p class="text-muted-foreground">Personalize your experience</p>
        </div>

        <div class="grid gap-6">
            <!-- Appearance -->
            <Card.Root class="border-border/50">
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <Palette class="h-5 w-5" /> Appearance
                    </Card.Title>
                    <Card.Description
                        >Customize how SpendWise looks for you</Card.Description
                    >
                </Card.Header>
                <Card.Content class="space-y-6">
                    <div class="space-y-3">
                        <Label>Theme</Label>
                        <div class="grid grid-cols-3 gap-3">
                            {#each themes as t}
                                <Button
                                    variant={preferencesStore.theme === t.id
                                        ? "default"
                                        : "outline"}
                                    class="flex flex-col items-center gap-2 h-20"
                                    onclick={() =>
                                        handleUpdate({ theme: t.id })}
                                >
                                    <t.icon class="h-5 w-5 mb-2" />
                                    <span class="text-xs">{t.label}</span>
                                </Button>
                            {/each}
                        </div>
                    </div>

                    <div class="space-y-3">
                        <Label>Accent Color</Label>
                        <div class="flex flex-wrap gap-2">
                            {#each ACCENT_COLORS as color}
                                <button
                                    class={cn(
                                        "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center",
                                        preferencesStore.accentColor ===
                                            color.value
                                            ? "border-foreground scale-110 shadow-lg"
                                            : "border-transparent",
                                    )}
                                    style="background-color: {color.value}"
                                    onclick={() =>
                                        handleUpdate({
                                            accentColor: color.value,
                                        })}
                                >
                                    {#if preferencesStore.accentColor === color.value}
                                        <Check
                                            class="h-4 w-4 text-white drop-shadow-md"
                                        />
                                    {/if}
                                </button>
                            {/each}
                            <div class="flex items-center gap-2 ml-2">
                                <input
                                    type="color"
                                    bind:value={customColor}
                                    onblur={() =>
                                        handleUpdate({
                                            accentColor: customColor,
                                        })}
                                    class="h-8 w-8 rounded-md cursor-pointer bg-transparent"
                                />
                                <span
                                    class="text-xs text-muted-foreground font-mono"
                                    >{customColor}</span
                                >
                            </div>
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Layout -->
            <Card.Root class="border-border/50">
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <Layout class="h-5 w-5" /> Layout & UX
                    </Card.Title>
                    <Card.Description
                        >Adjust the spacing and behavior of the interface</Card.Description
                    >
                </Card.Header>
                <Card.Content class="space-y-6">
                    <div class="flex items-center justify-between">
                        <div class="space-y-0.5">
                            <Label>Compact Mode</Label>
                            <p class="text-sm text-muted-foreground text-xs">
                                Smaller spacing and font sizes
                            </p>
                        </div>
                        <Switch
                            checked={preferencesStore.density === "compact"}
                            onCheckedChange={(checked) =>
                                handleUpdate({
                                    density: checked
                                        ? "compact"
                                        : "comfortable",
                                })}
                        />
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="space-y-0.5">
                            <Label>Default Sidebar Collapsed</Label>
                            <p class="text-sm text-muted-foreground text-xs">
                                Keep sidebar collapsed by default
                            </p>
                        </div>
                        <Switch
                            checked={preferencesStore.sidebarCollapsed}
                            onCheckedChange={(checked) =>
                                handleUpdate({ sidebarCollapsed: checked })}
                        />
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="space-y-0.5">
                            <Label>Show Animations</Label>
                            <p class="text-sm text-muted-foreground text-xs">
                                Smooth transitions between pages
                            </p>
                        </div>
                        <Switch
                            checked={preferencesStore.showAnimations}
                            onCheckedChange={(checked) =>
                                handleUpdate({ showAnimations: checked })}
                        />
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Localization -->
            <Card.Root class="border-border/50">
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <Globe class="h-5 w-5" /> Localization
                    </Card.Title>
                    <Card.Description
                        >Set your preferred currency and regional settings</Card.Description
                    >
                </Card.Header>
                <Card.Content class="space-y-6">
                    <div class="space-y-3">
                        <Label>Currency</Label>
                        <Select.Root
                            type="single"
                            value={currency}
                            onValueChange={(v) => handleUpdate({ currency: v })}
                        >
                            <Select.Trigger>{currency}</Select.Trigger>
                            <Select.Content>
                                {#each CURRENCIES as c}
                                    <Select.Item value={c.value}
                                        >{c.label}</Select.Item
                                    >
                                {/each}
                            </Select.Content>
                        </Select.Root>
                    </div>

                    <div class="space-y-3">
                        <Label>First Day of Week</Label>
                        <Select.Root
                            type="single"
                            value={firstDayOfWeek.toString()}
                            onValueChange={(v) =>
                                handleUpdate({ firstDayOfWeek: parseInt(v) })}
                        >
                            <Select.Trigger>{firstDayOfWeek}</Select.Trigger>
                            <Select.Content>
                                <Select.Item value="0">Sunday</Select.Item>
                                <Select.Item value="1">Monday</Select.Item>
                            </Select.Content>
                        </Select.Root>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Security -->
            <Card.Root class="border-border/50">
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <Shield class="h-5 w-5" /> Security
                    </Card.Title>
                    <Card.Description
                        >Protect your financial data with App Lock</Card.Description
                    >
                </Card.Header>
                <Card.Content class="space-y-6">
                    <div class="flex items-center justify-between">
                        <div class="space-y-0.5">
                            <Label>Enable App Lock</Label>
                            <p class="text-sm text-muted-foreground text-xs">
                                Require a PIN to open SpendWise
                            </p>
                        </div>
                        <Switch
                            checked={preferencesStore.appLockEnabled}
                            onCheckedChange={(checked) => {
                                handleUpdate({ appLockEnabled: checked });
                                if (!checked) {
                                    handleUpdate({
                                        appLockPin: "",
                                        biometricsEnabled: false,
                                    });
                                    pinInput = "";
                                }
                            }}
                        />
                    </div>

                    {#if preferencesStore.appLockEnabled}
                        <div
                            class="space-y-3 animate-in fade-in slide-in-from-top-2"
                        >
                            <Label>App Lock PIN (4 digits)</Label>
                            <div class="flex gap-2 max-w-xs">
                                <input
                                    type="password"
                                    inputmode="numeric"
                                    maxlength="4"
                                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm md:text-md ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    bind:value={pinInput}
                                    placeholder="Enter 4-digit PIN"
                                />
                                <Button
                                    onclick={() => {
                                        if (pinInput.length === 4) {
                                            handleUpdate({
                                                appLockPin: pinInput,
                                            });
                                        } else {
                                            toast.error(
                                                "PIN must be exactly 4 digits",
                                            );
                                        }
                                    }}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>

                        {#if biometricsAvailable}
                            <div
                                class="flex items-center justify-between animate-in fade-in slide-in-from-top-2"
                            >
                                <div class="space-y-0.5">
                                    <Label>Biometric Unlock</Label>
                                    <p
                                        class="text-sm text-muted-foreground text-xs"
                                    >
                                        Use FaceID, TouchID, or device passkey
                                    </p>
                                </div>
                                <Switch
                                    checked={preferencesStore.biometricsEnabled}
                                    onCheckedChange={handleBiometricToggle}
                                />
                            </div>
                        {/if}
                    {/if}
                </Card.Content>
            </Card.Root>
        </div>
    </div>
</AppLayout>
