<script lang="ts">
    import { page } from "$app/stores";
    import { ShieldAlert, Home, ArrowLeft } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
</script>

<div class="min-h-screen bg-background flex items-center justify-center p-4">
    <Card.Root class="max-w-md w-full border-border/50 shadow-lg">
        <Card.Content
            class="pt-10 pb-8 px-8 flex flex-col items-center text-center"
        >
            <div
                class="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6"
            >
                <ShieldAlert class="h-10 w-10 text-destructive" />
            </div>

            <h1 class="font-display text-4xl font-bold text-foreground mb-2">
                {$page.status}
            </h1>

            <h2 class="text-xl font-semibold text-foreground mb-4">
                {#if $page.status === 404}
                    Page not found
                {:else}
                    Something went wrong
                {/if}
            </h2>

            <p class="text-muted-foreground mb-8">
                {$page.error?.message ||
                    "We encountered an unexpected problem. Please try again later or return to safety."}
            </p>

            <div class="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                    variant="outline"
                    class="w-full gap-2"
                    onclick={() => window.history.back()}
                >
                    <ArrowLeft class="h-4 w-4" /> Go Back
                </Button>
                <Button href="/" class="w-full gap-2">
                    <Home class="h-4 w-4" /> Dashboard
                </Button>
            </div>
        </Card.Content>
    </Card.Root>
</div>
