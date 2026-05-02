import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query"

import { useAppStore } from "../../store/useAppStore"
import { usePermissao } from "../permissao/usePermissao"

import {
  getPlanos,
  getPlanoAtual,
  upgradePlano
} from "./plano.service"

export function usePlano() {
  const lojaId = useAppStore(
    state => state.lojaId
  )

  const isChangingLoja =
    useAppStore(
      state =>
        state.isChangingLoja
    )

  const queryClient =
    useQueryClient()

  const { temPermissao } =
    usePermissao()

  const podeVisualizar =
    temPermissao(
      "plano.visualizar"
    )

  const podeEditar =
    temPermissao(
      "plano.editar"
    )

  /* lista planos */
  const planosQuery =
    useQuery({
      queryKey: ["planos"],

      queryFn:
        getPlanos,

      enabled:
        podeVisualizar,

      retry: false
    })

  /* plano atual */
  const planoAtualQuery =
    useQuery({
      queryKey: [
        "planoAtual",
        lojaId
      ],

      queryFn:
        getPlanoAtual,

      enabled:
        Boolean(lojaId) &&
        Boolean(
          podeVisualizar
        ) &&
        !isChangingLoja,

      retry: false,
      refetchOnMount:
        false,
      refetchOnWindowFocus:
        false
    })

  /* upgrade */
  const mutation =
    useMutation({
      mutationFn: ({
        plano_id,
        loja_id
      }) =>
        upgradePlano(
          plano_id,
          loja_id
        ),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            "planoAtual",
            lojaId
          ]
        })

        queryClient.invalidateQueries({
          queryKey: [
            "dashboard",
            lojaId
          ]
        })
      }
    })

  async function trocar(
    plano_id
  ) {
    if (!podeEditar) {
      alert(
        "Sem permissão para alterar plano"
      )
      return
    }

    if (!lojaId) {
      alert(
        "Selecione uma loja"
      )
      return
    }

    try {
      await mutation.mutateAsync({
        plano_id,
        loja_id: lojaId
      })
    } catch (e) {
      alert(
        e.message
      )
    }
  }

  return {
    planos:
      planosQuery.data || [],

    planoAtual:
      planoAtualQuery.data ||
      null,

    loading:
      planosQuery.isLoading ||
      planoAtualQuery.isLoading ||
      mutation.isPending,

    error:
      planosQuery.error
        ?.message ||
      planoAtualQuery.error
        ?.message ||
      mutation.error
        ?.message ||
      null,

    trocar
  }
}