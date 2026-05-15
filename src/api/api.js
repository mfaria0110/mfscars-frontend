import axios from "axios"
import { useAppStore } from "../store/useAppStore"
import toast from "react-hot-toast"

const api = axios.create({
  baseURL: "https://api.mfscars.com.br",
  withCredentials: true
})

/* ===============================
   CONTROLE GLOBAL (ANTI-DUPLICAÇÃO)
=============================== */
let lojaInativaToastAtivo = false

/* ===============================
   REQUEST INTERCEPTOR
=============================== */
api.interceptors.request.use(
  (config) => {
    const state = useAppStore.getState()

    const accessToken = state.accessToken
    let lojaId = state.lojaId

    const url = config.url || ""

    const isAuthRoute =
      url.includes("/auth/login") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/selecionar-loja")

    /* TOKEN */
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    /* Rotas auth não usam loja */
    if (isAuthRoute) {
      return config
    }

    /* fallback storage */
    if (!lojaId) {
      const sessionLoja = sessionStorage.getItem("loja_id")
      const localLoja = localStorage.getItem("loja_id")

      const storageLoja = sessionLoja || localLoja

      if (
        storageLoja &&
        storageLoja !== "null" &&
        storageLoja !== "undefined"
      ) {
        lojaId = Number(storageLoja)
      }
    }

    /* envia header loja */
    if (lojaId && !isNaN(lojaId)) {
      config.headers["x-loja-id"] = String(lojaId)
    }

    console.log(
      "HEADER LOJA:",
      config.headers["x-loja-id"]
    )

    return config
  },
  (error) => Promise.reject(error)
)

/* ===============================
   RESPONSE INTERCEPTOR
=============================== */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (!error.response) {
      return Promise.reject(error)
    }

    const status = error.response.status
    const mensagem = error.response.data?.erro || ""

    console.error("ERRO API:", {
      status,
      mensagem
    })

    /* ===============================
       401 → TOKEN
    =============================== */
    if (status === 401) {
      const tokenExpirado =
        mensagem.toLowerCase().includes("token") ||
        mensagem.toLowerCase().includes("jwt") ||
        mensagem.toLowerCase().includes("expirado") ||
        mensagem.toLowerCase().includes("unauthorized")

      if (tokenExpirado) {
        console.warn("Token expirado → logout")
        const logout = useAppStore.getState().logout
        logout()
      }

      return Promise.reject(error)
    }

    /* ===============================
       403 → LOJA INATIVA
    =============================== */
    if (status === 403 && mensagem.includes("INATIVA")) {

      // 🔥 MOSTRA APENAS 1 VEZ
      if (!lojaInativaToastAtivo) {

        lojaInativaToastAtivo = true

        toast(mensagem, { icon: "⚠️" })

        setTimeout(() => {
          lojaInativaToastAtivo = false
        }, 3000)
      }

      // 🔥 marca estado global (opcional mas recomendado)
      useAppStore.setState({
        lojaInativa: true
      })

      // 🔥 NÃO PROPAGA ERRO
      return Promise.resolve({
        data: null,
        lojaInativa: true
      })
    }

    /* ===============================
       OUTROS 403
    =============================== */
/* ===============================
   PAYWALL SaaS
=============================== */

const bloqueioPlano =

  mensagem.includes(
    "inadimplente"
  ) ||

  mensagem.includes(
    "Limite"
  ) ||

  mensagem.includes(
    "Plano"
  ) ||

  mensagem.includes(
    "vencido"
  )

if (bloqueioPlano) {

  useAppStore
    .getState()
    .abrirPaywall(
      mensagem
    )

  return Promise.reject(
    error
  )
}

/* ===============================
   OUTROS 403
=============================== */

if (status === 403) {

  toast.error(
    mensagem || "Sem permissão"
  )

  return Promise.reject(
    error
  )
}

    /* ===============================
       OUTROS ERROS
    =============================== */
    toast.error(mensagem || "Erro inesperado")

    return Promise.reject(error)
  }
)

export default api