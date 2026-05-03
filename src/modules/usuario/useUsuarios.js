import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query"

import api from "../../api/api"
import toast from "react-hot-toast"
import { useAppStore } from "../../store/useAppStore"
import { usePermissao } from "../permissao/usePermissao"

export function useUsuarios() {

  const queryClient = useQueryClient()

  const lojaId = useAppStore(
    state => state.lojaId
  )

  const { temPermissao } =
    usePermissao()

  const podeVisualizar =
    temPermissao("usuario.visualizar")

  const podeCriar =
    temPermissao("usuario.criar")

  const podeEditar =
    temPermissao("usuario.editar")

  const podeExcluir =
    temPermissao("usuario.excluir")

  /* ===============================
     🔥 QUERY USUÁRIOS
  ============================== */
  const query = useQuery({
    queryKey: ["usuarios", lojaId],

    queryFn: async () => {

      console.log(
        "🔥 BUSCANDO USUÁRIOS DA LOJA:",
        lojaId
      )

      const res =
        await api.get("/usuarios") // ✅ SEM params

      return res.data || []
    },

    enabled: podeVisualizar,

    retry: false,

    refetchOnMount: true,
    refetchOnWindowFocus: true,

    staleTime: 0
  })

  /* ===============================
     🔥 SALVAR (CRIAR/EDITAR)
  ============================== */
  const salvarMutation = useMutation({

    mutationFn: async ({
      dados,
      id
    }) => {

      if (id && !podeEditar) {
        throw new Error(
          "Sem permissão para editar usuário"
        )
      }

      if (!id && !podeCriar) {
        throw new Error(
          "Sem permissão para criar usuário"
        )
      }

      if (!dados.nome?.trim()) {
        throw new Error("Nome obrigatório")
      }

      if (!dados.email?.trim()) {
        throw new Error("Email obrigatório")
      }

      dados.email =
        dados.email.trim()

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!emailRegex.test(dados.email)) {
        throw new Error("Email inválido")
      }

      if (!dados.tipo) {
        throw new Error("Tipo obrigatório")
      }

      if (!id && !dados.senha) {
        throw new Error("Senha obrigatória")
      }

      if (id) {
        await api.put(
          `/usuarios/${id}`,
          dados
        )
      } else {
        await api.post(
          "/usuarios",
          dados
        )
      }
    },

    onSuccess: () => {
      toast.success(
        "Usuário salvo com sucesso"
      )

      queryClient.invalidateQueries({
        queryKey: ["usuarios", lojaId]
      })
    },

    onError: (e) => {
      toast.error(
        e.response?.data?.erro ||
        e.message ||
        "Erro ao salvar usuário"
      )
    }
  })

  /* ===============================
     🔥 ALTERAR STATUS
  ============================== */
  const statusMutation = useMutation({

    mutationFn: async ({
      id,
      ativo
    }) => {

      if (!podeEditar) {
        throw new Error(
          "Sem permissão para alterar status"
        )
      }

      await api.put(
        `/usuarios/${id}/status`,
        { ativo }
      )
    },

    onSuccess: () => {
      toast.success(
        "Status atualizado"
      )

      queryClient.invalidateQueries({
        queryKey: ["usuarios", lojaId]
      })
    },

    onError: (e) => {
      toast.error(
        e.message ||
        "Erro ao atualizar status"
      )
    }
  })

  /* ===============================
     🔥 EXCLUIR
  ============================== */
  const excluirMutation = useMutation({

    mutationFn: async (id) => {

      if (!podeExcluir) {
        throw new Error(
          "Sem permissão para excluir usuário"
        )
      }

      await api.delete(
        `/usuarios/${id}`
      )
    },

    onSuccess: () => {
      toast.success(
        "Usuário excluído"
      )

      queryClient.invalidateQueries({
        queryKey: ["usuarios", lojaId]
      })
    },

    onError: (e) => {
      toast.error(
        e.message ||
        "Erro ao excluir usuário"
      )
    }
  })

  /* ===============================
     🔥 RETURN
  ============================== */
  return {

    usuarios:
      query.data || [],

    loading:
      query.isLoading,

    error:
      query.error?.message || null,

    salvar:
      salvarMutation.mutateAsync,

    alterarStatus:
      statusMutation.mutateAsync,

    excluir:
      excluirMutation.mutateAsync
  }
}