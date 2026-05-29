import axios from "axios"
import { useAppStore } from "../store/useAppStore"
import toast from "react-hot-toast"

const api = axios.create({
  baseURL: "https://api.mfscars.com.br",
  withCredentials: true
})

/* ===============================
 CONTROLE GLOBAL (ANTI-DUPLICAÇÃO) MF
=============================== */
let lojaInativaToastAtivo = false

/* ===============================
   REQUEST INTERCEPTOR
=============================== */
api.interceptors.request.use(
  (config) => {

    const state =
      useAppStore.getState()

    const accessToken =
      state.accessToken

    let lojaId =
      state.lojaId

    const url =
      config.url || ""

    /* ===============================
       ROTAS
    =============================== */

    const isAuthRoute =

      url.includes("/auth/login") ||

      url.includes("/auth/refresh") ||

      url.includes("/auth/selecionar-loja")

    /* ===============================
       FINANCEIRO GLOBAL
    =============================== */

    const isFinanceiroRoute =

      url.includes("/financeiro")

    /* ===============================
       TOKEN
    =============================== */

    if (accessToken) {

      config.headers.Authorization =
        `Bearer ${accessToken}`
    }

    /* ===============================
       AUTH NÃO USA LOJA
    =============================== */

    if (isAuthRoute) {

      return config
    }

    /* ===============================
       FALLBACK STORAGE
    =============================== */

    if (!lojaId) {

      const sessionLoja =
        sessionStorage.getItem(
          "loja_id"
        )

      const localLoja =
        localStorage.getItem(
          "loja_id"
        )

      const storageLoja =
        sessionLoja || localLoja

      if (

        storageLoja &&

        storageLoja !== "null" &&

        storageLoja !== "undefined"

      ) {

        lojaId =
          Number(storageLoja)
      }
    }

    /* ===============================
       ENVIA HEADER LOJA
       (EXCETO FINANCEIRO)
    =============================== */

    if (

      !isFinanceiroRoute &&

      lojaId &&

      !isNaN(lojaId)

    ) {

      config.headers["x-loja-id"] =
        String(lojaId)
    }

    return config
  },

  (error) =>
    Promise.reject(error)
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

    const status =
      error.response.status

    const mensagem =
      error.response.data?.erro || ""

    console.error(
      "ERRO API:",
      {
        status,
        mensagem
      }
    )

    /* ===============================
       401 → TOKEN
    =============================== */

  if (
    status === 401 &&
    !error.config._retry
  ) {

  const tokenExpirado =

    mensagem.toLowerCase().includes("token") ||

    mensagem.toLowerCase().includes("jwt") ||

    mensagem.toLowerCase().includes("expirado") ||

    mensagem.toLowerCase().includes("unauthorized")

  if (!tokenExpirado) {

    return Promise.reject(error)
  }

  try {

    const state =
      useAppStore.getState()

    const refreshToken =
      state.refreshToken

    if (!refreshToken) {

      state.logout()

      return Promise.reject(error)
    }

      console.warn(
        "🔄 Renovando token..."
      )

      error.config._retry = true

      const response =
        await axios.post(
        "https://api.mfscars.com.br/auth/refresh",
        {
          refreshToken
        }
      )

    const novoToken =
      response.data.accessToken

    state.setAccessToken(
      novoToken
    )

    error.config.headers.Authorization =
      `Bearer ${novoToken}`

    console.warn(
      "✅ Token renovado"
    )

    return api(error.config)

  } catch (e) {

    console.error(
      "❌ Falha refresh",
      e
    )

    useAppStore
      .getState()
      .logout()

    return Promise.reject(error)
  }
}

    /* ===============================
       403 → LOJA INATIVA
    =============================== */

    if (

      status === 403 &&

      mensagem.includes("INATIVA")

    ) {

      if (!lojaInativaToastAtivo) {

        lojaInativaToastAtivo =
          true

        toast(
          mensagem,
          {
            icon: "⚠️"
          }
        )

        setTimeout(() => {

          lojaInativaToastAtivo =
            false

        }, 3000)
      }

      useAppStore.setState({

        lojaInativa: true
      })

      return Promise.resolve({

        data: null,

        lojaInativa: true
      })
    }

/* ===============================
   LIMITE VEÍCULOS → UPGRADE
=============================== */

if (
  mensagem.includes(
    "Limite de lojas atingido"
  )
) {

  useAppStore
    .getState()
    .abrirPaywall(
      "Você atingiu o limite de lojas do seu plano. Faça upgrade para continuar."
    )

  return Promise.reject(error)
}


/* ===============================
   LIMITE VEÍCULOS → UPGRADE
=============================== */

if (
  mensagem.includes(
    "Limite de veículos atingido"
  )
) {

  useAppStore
    .getState()
    .abrirPaywall(
      "Você atingiu o limite de veículos do seu plano. Faça upgrade para continuar."
    )

  return Promise.reject(error)
}



/* ===============================
   LIMITE VENDEDORES → UPGRADE
=============================== */

if (
  mensagem.includes(
    "Limite de vendedores atingido"
  )
) {

  useAppStore
    .getState()
    .abrirPaywall(
      "Você atingiu o limite de vendedores do seu plano. Faça upgrade para continuar."
    )

  return Promise.reject(error)
}


/* ===============================
   BLOQUEIO PLANO
=============================== */

const bloqueioPlano =

  mensagem.includes(
    "inadimplente"
  ) ||

  mensagem.includes(
    "Nenhum plano ativo"
  ) ||

  mensagem.includes(
    "Plano vencido"
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

        mensagem ||
        "Sem permissão"
      )

      return Promise.reject(
        error
      )
    }

    /* ===============================
       OUTROS ERROS
    =============================== */

    toast.error(
      mensagem || "Erro inesperado"
    )

    return Promise.reject(error)
  }
)

export default api