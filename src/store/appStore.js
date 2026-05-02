import { create } from "zustand"

export const useAppStore = create((set) => ({
  usuario: null,
  loja_id: null,
  plano: null,

  setUsuario: (usuario) => set({ usuario }),
  setLoja: (loja_id) => set({ loja_id }),
  setPlano: (plano) => set({ plano }),

  logout: () => {
    localStorage.clear()
    set({
      usuario: null,
      loja_id: null,
      plano: null
    })
  }
}))