import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../../api/api"
import toast from "react-hot-toast"
import { usePermissao } from "./usePermissao"

export function usePermissoes() {
  const queryClient = useQueryClient()
  const { temPermissao } = usePermissao()

  const podeVisualizar = temPermissao("permissao.visualizar")
  const podeCriar = temPermissao("permissao.criar")
  const podeEditar = temPermissao("permissao.editar")
  const podeExcluir = temPermissao("permissao.excluir")

  const query = useQuery({
    queryKey: ["permissoes"],
    queryFn: async () => {
      const res = await api.get("/permissoes")
      return res.data || {}
    },
    enabled: podeVisualizar
  })

  const permissoes = query.data?.permissoes || []
  const roles = query.data?.roles || []
  const relacoes = query.data?.relacoes || []

  const salvarMutation = useMutation({
    mutationFn: async ({ nome, permissoesIds, roleId }) => {
      if (roleId && !podeEditar) {
        throw new Error("Sem permissão para editar roles")
      }

      if (!roleId && !podeCriar) {
        throw new Error("Sem permissão para criar roles")
      }

      if (!nome) {
        throw new Error("Informe o nome da role")
      }

      if (!permissoesIds || permissoesIds.length === 0) {
        throw new Error("Selecione ao menos uma permissão")
      }

      if (roleId) {
        await api.put(`/permissoes/${roleId}`, {
          nome,
          permissoes: permissoesIds
        })
      } else {
        await api.post("/permissoes", {
          nome,
          permissoes: permissoesIds
        })
      }
    },

    onSuccess: () => {
      toast.success("Role salva com sucesso")

      queryClient.invalidateQueries({
        queryKey: ["permissoes"]
      })
    },

    onError: (e) => {
      toast.error(
        e.response?.data?.erro ||
        e.message ||
        "Erro ao salvar"
      )
    }
  })

  const excluirMutation = useMutation({
    mutationFn: async (id) => {
      if (!podeExcluir) {
        throw new Error("Sem permissão para excluir roles")
      }

      await api.delete(`/permissoes/${id}`)
    },

    onSuccess: () => {
      toast.success("Role excluída")

      queryClient.invalidateQueries({
        queryKey: ["permissoes"]
      })
    },

    onError: (e) => {
      toast.error(
        e.response?.data?.erro ||
        e.message ||
        "Erro ao excluir"
      )
    }
  })

  function getPermissoesRole(roleId) {
    return relacoes
      .filter(r => r.role_id === roleId)
      .map(r => r.permissao_id)
  }

  return {
    permissoes,
    roles,
    relacoes,

    loading: query.isLoading,
    error: query.error?.message || null,

    salvar: salvarMutation.mutateAsync,
    excluir: excluirMutation.mutateAsync,

    getPermissoesRole
  }
}