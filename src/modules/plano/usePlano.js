import {
  useState,
  useEffect
} from "react"

import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query"

import toast from "react-hot-toast"

import { useAppStore }
  from "../../store/useAppStore"

import { usePermissao }
  from "../permissao/usePermissao"

import { tratarErro }
  from "../../utils/tratarErro"

import {

  getPlanos,
  getPlanoAtual,
  upgradePlano,
  gerarPixPlano,
  consultarStatusPix,
  getFounders

} from "./plano.service"

export function usePlano() {

  const lojaId =
    useAppStore(
      state => state.lojaId
    )

  const isChangingLoja =
    useAppStore(
      state =>
        state.isChangingLoja
    )

  const queryClient =
    useQueryClient()

  /* ===============================
     PIX
  =============================== */

  const [
    pixData,
    setPixData
  ] = useState(null)

  const [
    showPixModal,
    setShowPixModal
  ] = useState(false)

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

  /* ===============================
     LISTA PLANOS
  =============================== */

  const planosQuery =
    useQuery({

      queryKey: [
        "planos"
      ],

      queryFn:
        getPlanos,

      enabled:
        podeVisualizar,

      retry: false,

      refetchOnWindowFocus:
        false
    })

  /* ===============================
     PLANO ATUAL
  =============================== */

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
        !isChangingLoja,

      retry: false,

      refetchOnMount:
        false,

      refetchOnWindowFocus:
        false
    })

  /* ===============================
     FOUNDERS
  =============================== */

  const foundersQuery =
    useQuery({

      queryKey: [
        "founders"
      ],

      queryFn:
        getFounders,

      retry: false,

      refetchOnWindowFocus:
        false
    })

  /* ===============================
     UPGRADE LOCAL
  =============================== */

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

        window.dispatchEvent(
          new Event(
            "planoAtualizado"
          )
        )

        toast.success(
          "Plano alterado com sucesso"
        )
      },

      onError: (e) => {

        tratarErro(e)
      }
    })

  /* ===============================
     TROCAR PLANO
  =============================== */

  async function trocar(
    plano_id
  ) {

    if (!podeEditar) {

      toast.error(
        "Sem permissão para alterar plano"
      )

      return
    }

    if (!lojaId) {

      toast.error(
        "Selecione uma loja"
      )

      return
    }

    await mutation.mutateAsync({

      plano_id,

      loja_id:
        lojaId
    })
  }

  /* ===============================
     ASSINAR PLANO
  =============================== */

  async function handleAssinar(
    plano
  ) {

    try {

      /* ===========================
         FREE
      ============================ */

      if (

        plano?.nome
          ?.toLowerCase?.() === "free"

      ) {

        await upgradePlano(

          plano.id,

          lojaId
        )

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

        window.dispatchEvent(
          new Event(
            "planoAtualizado"
          )
        )

        toast.success(
          "Plano FREE ativado com sucesso!"
        )

        return
      }

      /* ===========================
         PLANOS PAGOS
      ============================ */

      const response =
        await gerarPixPlano(
          plano.id
        )

      if (
        response?.payment_id
      ) {

        setPixData({

          ...response,

          plano
        })

        setShowPixModal(
          true
        )

        return
      }

      toast.error(
        "Erro ao gerar PIX"
      )

    } catch (e) {

      tratarErro(e)
    }
  }

  /* ===============================
     POLLING PIX
  =============================== */

  useEffect(() => {

    if (
      !pixData?.payment_id
    ) return

    const startedAt =
      Date.now()

    const interval =
      setInterval(async () => {

        const elapsed =
          Date.now() - startedAt

        const limite =
          15 * 60 * 1000

        /* ===========================
           EXPIRA PIX
        ============================ */

        if (
          elapsed > limite
        ) {

          clearInterval(
            interval
          )

          setShowPixModal(
            false
          )

          setPixData(null)

          toast.error(
            "PIX expirado. Gere uma nova cobrança."
          )

          return
        }

        try {

          const status =
            await consultarStatusPix(
              pixData.payment_id
            )

          /* ===========================
             PAGAMENTO APROVADO
          ============================ */

          if (
            status?.status ===
            "pago"
          ) {

            clearInterval(
              interval
            )

            toast.success(
              "Plano ativado com sucesso!"
            )

            setShowPixModal(
              false
            )

            setPixData(null)

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

            window.dispatchEvent(
              new Event(
                "planoAtualizado"
              )
            )
          }

        } catch (e) {

          tratarErro(e)
        }

      }, 3000)

    return () =>
      clearInterval(interval)

  }, [
    pixData,
    lojaId,
    queryClient
  ])

  /* ===============================
     RETURN
  =============================== */

  return {

    planos:
      planosQuery.data || [],

    planoAtual:
      planoAtualQuery.data,

    semPlano:

      planoAtualQuery.status ===
        "success" &&

      !planoAtualQuery.data,

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

    trocar,

    handleAssinar,

    pixData,

    showPixModal,

    setShowPixModal,

    founders:
      foundersQuery.data || null
  }
}