import { useState } from "react";
import { Moon, Sun, Monitor, Layout, Palette, Globe, Check, Sidebar as SidebarIcon, Minus, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

const Settings = () => {
    const { preferences, updatePreferences } = usePreferences();
    const [customColor, setCustomColor] = useState(preferences.accentColor);

    const handleUpdate = async (updates: any) => {
        try {
            await updatePreferences(updates);
            toast.success("Preferences updated");
        } catch (e: any) {
            toast.error("Failed to update preferences");
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
            <div>
                <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">Personalize your experience</p>
            </div>

            <div className="grid gap-6">
                {/* Appearance */}
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" /> Appearance
                        </CardTitle>
                        <CardDescription>Customize how SpendWise looks for you</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Theme */}
                        <div className="space-y-3">
                            <Label>Theme</Label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'light', label: 'Light', icon: Sun },
                                    { id: 'dark', label: 'Dark', icon: Moon },
                                    { id: 'system', label: 'System', icon: Monitor },
                                ].map((t) => (
                                    <Button
                                        key={t.id}
                                        variant={preferences.theme === t.id ? "default" : "outline"}
                                        className="flex flex-col items-center gap-2 h-20"
                                        onClick={() => handleUpdate({ theme: t.id })}
                                    >
                                        <t.icon className="h-5 w-5" />
                                        <span className="text-xs">{t.label}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Accent Color */}
                        <div className="space-y-3">
                            <Label>Accent Color</Label>
                            <div className="flex flex-wrap gap-2">
                                {ACCENT_COLORS.map((color) => (
                                    <button
                                        key={color.value}
                                        className={cn(
                                            "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center",
                                            preferences.accentColor === color.value ? "border-foreground scale-110 shadow-lg" : "border-transparent"
                                        )}
                                        style={{ backgroundColor: color.value }}
                                        onClick={() => handleUpdate({ accentColor: color.value })}
                                    >
                                        {preferences.accentColor === color.value && <Check className="h-4 w-4 text-white drop-shadow-md" />}
                                    </button>
                                ))}
                                <div className="flex items-center gap-2 ml-2">
                                    <input
                                        type="color"
                                        value={customColor}
                                        onChange={(e) => setCustomColor(e.target.value)}
                                        onBlur={() => handleUpdate({ accentColor: customColor })}
                                        className="h-8 w-8 rounded-md cursor-pointer bg-transparent"
                                    />
                                    <span className="text-xs text-muted-foreground font-mono">{customColor}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Layout */}
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Layout className="h-5 w-5" /> Layout & UX
                        </CardTitle>
                        <CardDescription>Adjust the spacing and behavior of the interface</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Density */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Compact Mode</Label>
                                <p className="text-sm text-muted-foreground text-xs">Smaller spacing and font sizes</p>
                            </div>
                            <Switch
                                checked={preferences.density === 'compact'}
                                onCheckedChange={(checked) => handleUpdate({ density: checked ? 'compact' : 'comfortable' })}
                            />
                        </div>

                        {/* Sidebar State */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Default Sidebar Collapsed</Label>
                                <p className="text-sm text-muted-foreground text-xs">Keep sidebar collapsed by default</p>
                            </div>
                            <Switch
                                checked={preferences.sidebarCollapsed}
                                onCheckedChange={(checked) => handleUpdate({ sidebarCollapsed: checked })}
                            />
                        </div>

                        {/* Animations */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Show Animations</Label>
                                <p className="text-sm text-muted-foreground text-xs">Smooth transitions between pages</p>
                            </div>
                            <Switch
                                checked={preferences.showAnimations}
                                onCheckedChange={(checked) => handleUpdate({ showAnimations: checked })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Localization */}
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" /> Localization
                        </CardTitle>
                        <CardDescription>Set your preferred currency and regional settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label>Currency</Label>
                            <Select value={preferences.currency} onValueChange={(v) => handleUpdate({ currency: v })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CURRENCIES.map(c => (
                                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label>First Day of Week</Label>
                            <Select
                                value={preferences.firstDayOfWeek.toString()}
                                onValueChange={(v) => handleUpdate({ firstDayOfWeek: parseInt(v) })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Sunday</SelectItem>
                                    <SelectItem value="1">Monday</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Settings;
