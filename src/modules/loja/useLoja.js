import api from "../../api/api"
import { useAppStore } from "../../store/useAppStore"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { usePermissao } from "../permissao/usePermissao"

export function useLoja() {
  const setLojaId = useAppStore(
    (state) => state.setLojaId
  )

  const setAccessToken = useAppStore(
    (state) => state.setAccessToken
  )

  const setLojas = useAppStore(
    (state) => state.setLojas
  )

  const setPerfil = useAppStore(
    (state) => state.setPerfil
  )

  const setPermissoes = useAppStore(
    (state) => state.setPermissoes
  )

  const setChangingLoja = useAppStore(
    (state) => state.setChangingLoja
  )

  const lojaAtual = useAppStore(
    (state) => state.lojaId
  )

  const isVendaAtiva = useAppStore(
    (state) => state.isVendaAtiva
  )

  const queryClient =
    useQueryClient()

  const { temPermissao } =
    usePermissao()

  async function trocarLoja(
    loja_id
  ) {
    const id = Number(
      loja_id
    )

    console.log(
      "USUARIO STORE:",
      useAppStore.getState().usuario
    )

    console.log(
      "LOJA ATUAL:",
      lojaAtual
    )

    console.log(
      "LOJA NOVA:",
      id
    )

    if (!id) {
      toast.error(
        "Selecione uma loja válida"
      )
      return
    }

// 🔥 BLOQUEIO DURANTE VENDA
if (isVendaAtiva) {
  toast.error("Finalize ou cancele a venda antes de trocar de loja")
  return
}    

const usuario = useAppStore.getState().usuario;

if (
  lojaAtual &&
  !usuario?.master &&
  usuario?.tipo !== "admin" &&
  !temPermissao("loja.trocar")
) {
  toast.error("Sem permissão para trocar loja")
  return
}

    try {
      /*
        trava UI
      */
      setChangingLoja(true)

      useAppStore.setState({
        lojaInativa: false,
        isChangingLoja: true
      })

      /*
        cancela queries antigas
      */
      await queryClient.cancelQueries()

      queryClient.clear()

      /*
        troca token
      */
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

      /*
        token novo
      */
      setAccessToken(
        data.accessToken
      )

      /*
        salva novo refresh token
      */
      if (data.refreshToken) {
        sessionStorage.setItem(
          "refreshToken",
          data.refreshToken
        )
      }

      /*
        perfil
      */
      if (data.perfil) {
        setPerfil(
          data.perfil
        )
      }

      /*
        permissões
      */
      if (
        data.permissoes
      ) {
        setPermissoes(
          data.permissoes
        )
      }

      /*
        salva loja nova
      */
      setLojaId(id)

      /*
        atualiza storage
      */
      sessionStorage.setItem(
        "loja_id",
        String(id)
      )

      /*
       limpa novamente
        evita refetch antigo
      */
      await queryClient.cancelQueries()

      queryClient.clear()

      /*
        refetch agora com loja correta
      */
      await queryClient.invalidateQueries()

      window.dispatchEvent(
        new Event(
          "lojaChanged"
        )
      )

      toast.success(
        "Loja alterada com sucesso"
      )

      /*
        libera tela somente no final
      */
      setTimeout(() => {
        setChangingLoja(
          false
        )
      }, 300)

    } catch (e) {
      console.error(
        "Erro ao trocar loja:",
        e
      )

      setChangingLoja(
        false
      )

      const msg =
        e.response?.data
          ?.erro ||
        e.message ||
        "Erro ao trocar loja"

      toast.error(msg)
    }
  }

  return {
    trocarLoja
  }
}