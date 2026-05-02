export async function buscarCNPJ(
  cnpj,
  toast
) {
  try {
    const clean =
      cnpj.replace(/\D/g, "")

    if (clean.length !== 14) {
      toast?.error(
        "CNPJ inválido"
      )
      return null
    }

    const res = await fetch(
      `https://brasilapi.com.br/api/cnpj/v1/${clean}`
    )

    if (!res.ok) {
      throw new Error(
        "BrasilAPI falhou"
      )
    }

    const data =
      await res.json()

    console.log(
      "BRASIL API:",
      data
    )

    toast?.success(
      "Dados carregados pelo CNPJ"
    )

    return {
      nome:
        data.razao_social || "",

      telefone:
        data.ddd_telefone_1 || "",

      endereco:
        data.logradouro || "",

      numero:
        data.numero || "",

      bairro:
        data.bairro || "",

      cidade:
        data.municipio || "",

      estado:
        data.uf || "",

      cep:
        data.cep || ""
    }

  } catch (e) {
    console.error(
      "Erro BrasilAPI:",
      e
    )

    toast?.error(
      "CNPJ não encontrado. Preencha manualmente."
    )

    return null
  }
}