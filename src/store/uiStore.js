import { create } from "zustand"

export const useUIStore = create((set) => ({
  dark: localStorage.getItem("dark") === "true",
  sidebarOpen: true,
  loading: false,

  toggleDark: () => set((state) => {
    const newDark = !state.dark
    localStorage.setItem("dark", newDark)
    document.documentElement.classList.toggle("dark", newDark)
    return { dark: newDark }
  }),

  toggleSidebar: () => set((state) => ({
    sidebarOpen: !state.sidebarOpen
  })),

  setLoading: (loading) => set({ loading })
}))