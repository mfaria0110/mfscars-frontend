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

    console.log(
      "HEADER LOJA:",
      config.headers["x-loja-id"]
    )

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

    if (status === 401) {

      const tokenExpirado =

        mensagem.toLowerCase().includes("token") ||

        mensagem.toLowerCase().includes("jwt") ||

        mensagem.toLowerCase().includes("expirado") ||

        mensagem.toLowerCase().includes("unauthorized")

      if (tokenExpirado) {

        console.warn(
          "Token expirado → logout"
        )

        const logout =
          useAppStore
            .getState()
            .logout

        logout()
      }

      return Promise.reject(error)
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
   LIMITE LOJAS → UPGRADE
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