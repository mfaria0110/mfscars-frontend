import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query"

import api from "../../api/api"
import toast from "react-hot-toast"

import { useAppStore }
  from "../../store/useAppStore"

import { usePermissao }
  from "../permissao/usePermissao"

import { tratarErro }
  from "../../utils/tratarErro"

export function useLojas() {

  const queryClient =
    useQueryClient()

  const { temPermissao } =
    usePermissao()

  const podeVisualizar =
    temPermissao(
      "loja.visualizar"
    )

  const podeCriar =
    temPermissao(
      "loja.criar"
    )

  const podeEditar =
    temPermissao(
      "loja.editar"
    )

  const podeExcluir =
    temPermissao(
      "loja.excluir"
    )

  /* ===============================
     📦 QUERY
  ============================== */
  const query = useQuery({

    queryKey: ["lojas"],

    queryFn: async () => {

      const res =
        await api.get(
          "/lojas/todas"
        )

      return res.data || []
    },

    enabled:
      podeVisualizar
  })

  /* ===============================
     💾 SALVAR
  ============================== */
  const salvarMutation =
    useMutation({

      mutationFn:
        async ({
          dados,
          id
        }) => {

          if (
            id &&
            !podeEditar
          ) {

            throw new Error(
              "Sem permissão para editar loja"
            )
          }

          if (
            !id &&
            !podeCriar
          ) {

            throw new Error(
              "Sem permissão para criar loja"
            )
          }

          if (id) {

            await api.put(
              `/lojas/${id}`,
              dados
            )

          } else {

            await api.post(
              "/lojas",
              dados
            )
          }
        },

      onSuccess:
        async () => {

          toast.success(
            "Loja salva com sucesso"
          )

          const res =
            await api.get(
              "/lojas/todas"
            )

          useAppStore
            .getState()
            .setLojas(
              res.data || []
            )

          queryClient.invalidateQueries({

            queryKey: [
              "lojas"
            ]
          })

          window.dispatchEvent(
            new Event(
              "lojasUpdated"
            )
          )
        },

      onError: (e) => {

        tratarErro(e)
      }
    })

  /* ===============================
     🗑️ EXCLUIR
  ============================== */
  const excluirMutation =
    useMutation({

      mutationFn:
        async ({
          id,
          senha
        }) => {

          if (
            !podeExcluir
          ) {

            throw new Error(
              "Sem permissão para excluir loja"
            )
          }

          if (!senha) {

            throw new Error(
              "Senha obrigatória"
            )
          }

          await api.delete(
            `/lojas/${id}`,
            {
              data: {
                senha
              }
            }
          )
        },

      onSuccess:
        async () => {

          toast.success(
            "Loja excluída com sucesso"
          )

          const res =
            await api.get(
              "/lojas/todas"
            )

          useAppStore
            .getState()
            .setLojas(
              res.data || []
            )

          queryClient.invalidateQueries({

            queryKey: [
              "lojas"
            ]
          })

          window.dispatchEvent(
            new Event(
              "lojasUpdated"
            )
          )
        },

      onError: (e) => {

        tratarErro(e)
      }
    })

  /* ===============================
     🔍 BUSCAR
  ============================== */
  async function buscar(id) {

    if (
      !podeVisualizar
    ) {

      throw new Error(
        "Sem permissão para visualizar loja"
      )
    }

    const res =
      await api.get(
        `/lojas/${id}`
      )

    return res.data
  }

  /* ===============================
     📤 RETURN
  ============================== */
  return {

    lojas:
      query.data || [],

    loading:
      query.isLoading,

    error:
      query.error?.message || null,

    salvar:
      salvarMutation.mutateAsync,

    salvarLoading:
      salvarMutation.isPending,

    excluir:
      excluirMutation.mutateAsync,

    buscar
  }
}