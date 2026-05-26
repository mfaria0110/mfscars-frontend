import api from "../../api/api"
import { useAppStore } from "../../store/useAppStore"

/* ===============================
   VALIDA PERMISSÃO
=============================== */

function validarPermissao(
  chave
) {

  const {
    usuario,
    permissoes
  } =
    useAppStore.getState()

  /*
    MASTER LIBERADO
  */

  if (
    usuario?.master
  ) {

    return true
  }

  return Array.isArray(
    permissoes
  )

    ? permissoes.includes(
        chave
      )

    : false
}

/* ===============================
   LISTA PLANOS
=============================== */

export async function getPlanos() {



  try {

    const { data } =
      await api.get(
        "/planos"
      )

    return data || []

  } catch (e) {

    console.error(e)

    return []
  }
}

/* ===============================
   PLANO ATUAL
=============================== */

export async function getPlanoAtual() {

  const state =
    useAppStore.getState()

  const lojaId =
    state.lojaId

  const isChangingLoja =
    state.isChangingLoja

  /*
    evita corrida troca loja
  */

  if (

    !lojaId ||

    isChangingLoja

  ) {

    console.warn(

      "Bloqueado getPlanoAtual -> loja não pronta"

    )



    return null
  }


  try {

    const { data } =
      await api.get(
        "/planos/atual"
      )

  return data || null

  } catch (e) {

    /*
      loja sem plano
    */

    if (
      e.response?.status === 400
    ) {

      return null
    }

    console.error(e)

    throw e
  }
}

/* ===============================
   UPGRADE LOCAL
=============================== */

export async function upgradePlano(
  plano_id,
  loja_id
) {

  const podeAssinar =
    validarPermissao(
      "billing.assinar"
    )

  const podeUpgrade =
    validarPermissao(
      "billing.upgrade"
    )

  if (

    !podeAssinar &&

    !podeUpgrade

  ) {

    throw new Error(
      "Sem permissão para alterar plano"
    )
  }

  const { data } =
    await api.post(

      "/planos/upgrade",

      {
        plano_id,
        loja_id
      }
    )

  return data
}

/* ===============================
   ASSINAR PLANO
=============================== */

export async function assinarPlano(
  plano_id
) {

  /*
    billing próprio SaaS
  */

  if (

    !validarPermissao(
      "billing.assinar"
    )

  ) {

    throw new Error(
      "Sem permissão para assinar plano"
    )
  }

  const loja_id =
    useAppStore
      .getState()
      .lojaId

  if (!loja_id) {

    throw new Error(
      "Loja não encontrada"
    )
  }

  const { data } =
    await api.post(

      "/billing/assinar",

      {
        loja_id,
        plano_id
      }
    )

  return data
}

/* ===============================
   GERAR PIX
=============================== */

export async function gerarPixPlano(
  plano_id
) {

  /*
    billing próprio SaaS
  */

  if (

    !validarPermissao(
      "billing.assinar"
    )

  ) {

    throw new Error(
      "Sem permissão para assinar plano"
    )
  }

  const loja_id =
    useAppStore
      .getState()
      .lojaId

  if (!loja_id) {

    throw new Error(
      "Loja não encontrada"
    )
  }

  const { data } =
    await api.post(

      "/billing/pix",

      {
        loja_id,
        plano_id
      }
    )

  return data
}

/* ===============================
   STATUS PIX
=============================== */

export async function consultarStatusPix(
  payment_id
) {

  const { data } =
    await api.get(

      `/billing/status/${payment_id}`

    )

  return data
}

/* ===============================
   RESUMO CONSUMO
=============================== */

export function getResumoConsumo(
  planoAtual
) {

  if (!planoAtual) {

    return {

      usadosVeiculos: 0,
      limiteVeiculos: 0,

      usadosLojas: 0,
      limiteLojas: 0,

      usadosVendedores: 0,
      limiteVendedores: 0
    }
  }

  return {

    usadosVeiculos:
      Number(
        planoAtual.usados || 0
      ),

    limiteVeiculos:
      Number(
        planoAtual.limite_veiculos || 0
      ),

    usadosLojas:
      Number(
        planoAtual.usados_lojas || 0
      ),

    limiteLojas:

      planoAtual.limite_lojas === null

        ? "∞"

        : Number(
            planoAtual.limite_lojas || 0
          ),

    usadosVendedores:
      Number(
        planoAtual.usados_vendedores || 0
      ),

    limiteVendedores:

      planoAtual.limite_vendedores === null

        ? "∞"

        : Number(
            planoAtual.limite_vendedores || 0
          )
  }
}

/* ===============================
   FOUNDERS
=============================== */

export async function getFounders() {

  const { data } =
    await api.get(
      "/billing/founders"
    )

  return data
}