import {create} from 'zustand'

export const useThemeStore = create((set) => (
    {
        theme: localStorage.getItem('theme') || 'dark',   // we are storing these theme to localstorage so that it remains same on page reload
        setTheme: (theme) => {
            localStorage.setItem('theme', theme);
            set({ theme });
        }
}))