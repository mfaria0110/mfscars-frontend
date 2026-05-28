import api from "../../api/api"
import { useAppStore } from "../../store/useAppStore"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { usePermissao } from "../permissao/usePermissao"
import { tratarErro } from "../../utils/tratarErro"

export function useLoja() {

  const setLojaId = useAppStore(
    state => state.setLojaId
  )

  const setAccessToken = useAppStore(
    state => state.setAccessToken
  )

  const setPerfil = useAppStore(
    state => state.setPerfil
  )

  const setPermissoes = useAppStore(
    state => state.setPermissoes
  )

  const setChangingLoja = useAppStore(
    state => state.setChangingLoja
  )

  const lojaAtual = useAppStore(
    state => state.lojaId
  )

  const isVendaAtiva = useAppStore(
    state => state.isVendaAtiva
  )

  const queryClient =
    useQueryClient()

  const { temPermissao } =
    usePermissao()

  async function trocarLoja(
    loja_id
  ) {

    const id =
      Number(loja_id)

    if (!id) {

      toast.error(
        "Selecione uma loja válida"
      )

      return
    }

    /* ===============================
       🔥 BLOQUEIO DURANTE VENDA
    ============================== */
    if (isVendaAtiva) {

      toast.error(
        "Finalize ou cancele a venda antes de trocar de loja"
      )

      return
    }

    const usuario =
      useAppStore
        .getState()
        .usuario

    /* ===============================
       🔐 PERMISSÃO
    ============================== */
    if (

      lojaAtual &&

      !usuario?.master &&

      usuario?.tipo !== "admin" &&

      !temPermissao(
        "loja.trocar"
      )

    ) {

      toast.error(
        "Sem permissão para trocar loja"
      )

      return
    }

    try {

      /* ===============================
         🔒 TRAVA UI
      ============================== */
      setChangingLoja(true)

      useAppStore.setState({

        lojaInativa: false,

        isChangingLoja: true
      })

      /* ===============================
         🧹 LIMPA QUERIES ANTIGAS
      ============================== */
      await queryClient.cancelQueries()

      queryClient.clear()

      /* ===============================
         🔄 TROCA TOKEN
      ============================== */
      const res =
        await api.post(
          "/auth/selecionar-loja",
          {
            loja_id: id
          }
        )

      const data =
        res.data

      if (
        !data?.accessToken
      ) {

        throw new Error(
          "Token não recebido"
        )
      }

      /* ===============================
         🔑 TOKEN NOVO
      ============================== */
      setAccessToken(
        data.accessToken
      )

      /* ===============================
         ♻️ REFRESH TOKEN
      ============================== */
      if (data.refreshToken) {

        sessionStorage.setItem(
          "refreshToken",
          data.refreshToken
        )
      }

      /* ===============================
         👤 PERFIL
      ============================== */
      if (data.perfil) {

        setPerfil(
          data.perfil
        )
      }

      /* ===============================
         🔐 PERMISSÕES
      ============================== */
      if (data.permissoes) {

        setPermissoes(
          data.permissoes
        )
      }

      /* ===============================
         🏪 NOVA LOJA
      ============================== */
      setLojaId(id)

      sessionStorage.setItem(
        "loja_id",
        String(id)
      )

      /* ===============================
         🧹 LIMPA NOVAMENTE
      ============================== */
      await queryClient.cancelQueries()

      queryClient.clear()

      /* ===============================
         🔄 REFRESH
      ============================== */
      await queryClient.invalidateQueries()

      /* ===============================
         📢 EVENTOS
      ============================== */
      window.dispatchEvent(
        new Event(
          "lojaChanged"
        )
      )

      window.dispatchEvent(
        new Event(
          "dashboardAtualizado"
        )
      )

      window.dispatchEvent(
        new Event(
          "planoAtualizado"
        )
      )

      toast.success(
        "Loja alterada com sucesso"
      )

      /* ===============================
         🔓 LIBERA UI
      ============================== */
      setTimeout(() => {

        setChangingLoja(
          false
        )

      }, 300)

    } catch (e) {

      setChangingLoja(
        false
      )

      tratarErro(e)
    }
  }

  return {
    trocarLoja
  }
}