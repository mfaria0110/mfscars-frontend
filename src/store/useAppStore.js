import { create } from "zustand"

/* ===============================
   HELPERS
============================== */
const getJSON = (
  key,
  fallback = null
) => {
  try {
    const item =
      sessionStorage.getItem(
        key
      )

    return item
      ? JSON.parse(item)
      : fallback

  } catch {
    return fallback
  }
}

const getString = (
  key
) => {
  return sessionStorage.getItem(
    key
  )
}

/* ===============================
   LIMPAR SESSÃO INTERNA
============================== */
const clearStorageSession =
  () => {
    sessionStorage.removeItem(
      "accessToken"
    )

    sessionStorage.removeItem(
      "refreshToken"
    )

    sessionStorage.removeItem(
      "usuario"
    )

    sessionStorage.removeItem(
      "lojas"
    )

    sessionStorage.removeItem(
      "permissoes"
    )

    sessionStorage.removeItem(
      "plano"
    )

    sessionStorage.removeItem(
      "perfil"
    )

    sessionStorage.removeItem(
      "loja_id"
    )
  }

/* ===============================
   STORE
============================== */
export const useAppStore =
  create((set) => ({

    accessToken:
      getString(
        "accessToken"
      ),

    refreshToken:
      getString(
        "refreshToken"
      ),

    usuario: getJSON(
      "usuario",
      null
    ),

    lojas: getJSON(
      "lojas",
      []
    ),

    permissoes: getJSON(
      "permissoes",
      []
    ),

    lojaId:
      getString(
        "loja_id"
      )
        ? Number(
            getString(
              "loja_id"
            )
          )
        : null,

    plano: getJSON(
      "plano",
      null
    ),

    perfil:
      getString(
        "perfil"
      ),

    isChangingLoja: false,

    // 🔥 NOVO ESTADO
    isVendaAtiva: false,
    setVendaAtiva: (v) => set({ isVendaAtiva: v }),

    /* ===============================
       AUTH
    ============================== */
    setAuth: (data) => {

      sessionStorage.setItem(
        "accessToken",
        data.accessToken
      )

      sessionStorage.setItem(
        "refreshToken",
        data.refreshToken
      )

      sessionStorage.setItem(
        "usuario",
        JSON.stringify(
          data.usuario
        )
      )

      sessionStorage.setItem(
        "lojas",
        JSON.stringify(
          data.lojas || []
        )
      )

      sessionStorage.setItem(
        "permissoes",
        JSON.stringify(
          data.permissoes || []
        )
      )

      /* limpa contexto antigo */
      sessionStorage.removeItem(
        "loja_id"
      )

      sessionStorage.removeItem(
        "perfil"
      )

      set({
        accessToken:
          data.accessToken,

        refreshToken:
          data.refreshToken,

        usuario:
          data.usuario,

        lojas:
          data.lojas || [],

        permissoes:
          data.permissoes || [],

        lojaId: null,
        perfil: null
      })
    },

    setAccessToken: (
      token
    ) => {
      sessionStorage.setItem(
        "accessToken",
        token
      )

      set({
        accessToken:
          token
      })
    },

    /* ===============================
       LOJA
    ============================== */
    setLojaId: (
      lojaId
    ) => {
      if (!lojaId) {
        sessionStorage.removeItem(
          "loja_id"
        )
      } else {
        sessionStorage.setItem(
          "loja_id",
          String(lojaId)
        )
      }

      set({
        lojaId:
          lojaId || null
      })
    },

    setLojas: (
      lojas
    ) => {
      sessionStorage.setItem(
        "lojas",
        JSON.stringify(
          lojas
        )
      )

      set({
        lojas
      })
    },

    /* ===============================
       PLANO
    ============================== */
    setPlano: (
      plano
    ) => {
      sessionStorage.setItem(
        "plano",
        JSON.stringify(
          plano
        )
      )

      set({
        plano
      })
    },

    /* ===============================
       PERFIL
    ============================== */
setPerfil: (perfil) => {
  sessionStorage.setItem("perfil", perfil)
  set({ perfil })
},

setChangingLoja: (value) => {
  set({
    isChangingLoja: value
  })
},

    /* ===============================
       PERMISSÕES
    ============================== */
    setPermissoes: (
      permissoes
    ) => {
      sessionStorage.setItem(
        "permissoes",
        JSON.stringify(
          permissoes || []
        )
      )

      set({
        permissoes:
          permissoes || []
      })
    },

    /* ===============================
       LIMPA SESSÃO SEM REDIRECT
       usado no login
    ============================== */
    clearSession: () => {
      clearStorageSession()

      set({
        accessToken:
          null,

        refreshToken:
          null,

        usuario:
          null,

        lojas: [],

        permissoes:
          [],

        lojaId:
          null,

        plano:
          null,

        perfil:
          null
      })
    },

    /* ===============================
       LOGOUT REAL
    ============================== */
    logout: () => {
      console.log(
        "🚨 LOGOUT DISPARADO"
      )

      clearStorageSession()

      set({
        accessToken:
          null,

        refreshToken:
          null,

        usuario:
          null,

        lojas: [],

        permissoes:
          [],

        lojaId:
          null,

        plano:
          null,

        perfil:
          null
      })

      window.location.href = "/"
    },

    /* ===============================
       VALIDADOR
    ============================== */
    temPermissao: (
      chave
    ) => {
      const {
        usuario,
        permissoes
      } =
        useAppStore.getState()

      if (
        usuario?.master
      ) {
        return true
      }

      if (
        !Array.isArray(
          permissoes
        )
      ) {
        return false
      }

      return permissoes.includes(
        chave
      )
    }

  }))