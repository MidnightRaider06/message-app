import { create } from "zustand";

interface ThemeStoreState {
    theme: string;
    setTheme: (theme: string) => void;
}
export const useThemeStore = create<ThemeStoreState>((set) => ({
    theme: localStorage.getItem("chat-theme") || "dark",
    setTheme: (theme: string) => {
        localStorage.setItem("chat-theme", theme);
        set({theme});
    },
}));