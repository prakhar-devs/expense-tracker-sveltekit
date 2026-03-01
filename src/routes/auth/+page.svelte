<script lang="ts">
    import { goto } from "$app/navigation";
    import { supabase } from "$lib/supabaseClient";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as Card from "$lib/components/ui/card";
    import { toast } from "svelte-sonner";
    import { DollarSign } from "lucide-svelte";

    let isLogin = $state(true);
    let email = $state("");
    let password = $state("");
    let fullName = $state("");
    let loading = $state(false);

    async function handleSubmit(e: Event) {
        e.preventDefault();
        loading = true;

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                toast.success("Welcome back!");
                // $layout.svelte handles the redirect reactively once auth state updates
            } else {
                if (password.length < 6) {
                    toast.error("Password must be at least 6 characters");
                    loading = false;
                    return;
                }
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { full_name: fullName } },
                });
                if (error) throw error;
                toast.success("Account created! You can now log in.");
                isLogin = true;
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            loading = false;
        }
    }
</script>

<div class="flex min-h-screen items-center justify-center bg-background p-4">
    <div class="w-full max-w-md animate-fade-in">
        <div class="mb-8 flex items-center justify-center gap-3">
            <div
                class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary"
            >
                <DollarSign class="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 class="font-display text-3xl font-bold text-foreground">
                SpendWise
            </h1>
        </div>

        <Card.Root class="border-border/50 shadow-lg">
            <Card.Header class="text-center">
                <Card.Title class="font-display text-2xl">
                    {isLogin ? "Welcome back" : "Create account"}
                </Card.Title>
                <Card.Description>
                    {isLogin
                        ? "Sign in to manage your finances"
                        : "Start tracking your expenses today"}
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <form onsubmit={handleSubmit} class="space-y-4">
                    {#if !isLogin}
                        <div class="space-y-2">
                            <Label for="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="John Doe"
                                bind:value={fullName}
                                required={!isLogin}
                            />
                        </div>
                    {/if}
                    <div class="space-y-2">
                        <Label for="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            bind:value={email}
                            required
                        />
                    </div>
                    <div class="space-y-2">
                        <Label for="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            bind:value={password}
                            required
                            minlength={6}
                        />
                    </div>
                    <Button
                        type="submit"
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={loading}
                    >
                        {loading
                            ? "Loading..."
                            : isLogin
                              ? "Sign In"
                              : "Sign Up"}
                    </Button>
                </form>
                <div class="mt-4 text-center text-sm text-muted-foreground">
                    {isLogin
                        ? "Don't have an account?"
                        : "Already have an account?"}
                    {" "}
                    <button
                        type="button"
                        onclick={() => (isLogin = !isLogin)}
                        class="font-medium text-primary underline-offset-4 hover:underline"
                    >
                        {isLogin ? "Sign up" : "Sign in"}
                    </button>
                </div>
            </Card.Content>
        </Card.Root>
    </div>
</div>
