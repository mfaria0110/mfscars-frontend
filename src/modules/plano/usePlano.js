import {
  useState,
  useEffect
} from "react"

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
  upgradePlano,
  assinarPlano,
  gerarPixPlano,
  consultarStatusPix

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

      retry: false
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
      }
    })

  /* ===============================
     TROCAR PLANO
  =============================== */

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

        loja_id:
          lojaId
      })

    } catch (e) {

      alert(
        e.message
      )
    }
  }

  /* ===============================
     ASSINAR PLANO PIX
  =============================== */

  async function handleAssinar(
    plano_id
  ) {

    try {

      const response =
        await gerarPixPlano(
          plano_id
        )

      /*
        PIX GERADO
      */

      if (
        response?.payment_id
      ) {

        /*
          PIX REUTILIZADO
        */

        if (
          response?.reutilizado
        ) {

          alert(
            "PIX anterior reutilizado."
          )
        }

        /*
          ABRE MODAL PIX
        */

        setPixData(response)

        setShowPixModal(true)

        return
      }

      alert(
        "Erro ao gerar PIX"
      )

    } catch (e) {

      console.error(e)

      alert(
        "Erro ao iniciar pagamento"
      )
    }
  }

  /* ===============================
     POLLING PIX
  =============================== */

  useEffect(() => {

    if (
      !pixData?.payment_id
    ) return

    /* ===============================
       TEMPO INICIAL PIX
    =============================== */

    const startedAt =
      Date.now()

    const interval =
      setInterval(async () => {

        /* ===============================
           EXPIRA PIX
        =============================== */

        const elapsed =
          Date.now() - startedAt

        const limite =
          15 * 60 * 1000

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

          alert(
            "PIX expirado. Gere uma nova cobrança."
          )

          return
        }

        try {

          const status =
            await consultarStatusPix(
              pixData.payment_id
            )

          /*
            PAGAMENTO APROVADO
          */

          if (
            status?.status ===
            "pago"
          ) {

            clearInterval(
              interval
            )

            alert(
              "Plano ativado com sucesso!"
            )

            setShowPixModal(
              false
            )

            setPixData(null)

            /*
              RELOAD
            */

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

        } catch (e) {

          console.error(e)
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

    trocar,

    handleAssinar,

    pixData,

    showPixModal,

    setShowPixModal
  }
}