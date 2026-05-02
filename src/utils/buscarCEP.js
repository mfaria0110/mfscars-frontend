export async function buscarCEP(cep, setForm, toast) {
  try {
    const clean = cep.replace(/\D/g, "")

    if (clean.length !== 8) return

    const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
    const data = await res.json()

    if (data.erro) {
      toast?.error("CEP não encontrado")
      return
    }

    setForm(prev => ({
      ...prev,
      endereco: data.logradouro || "",
      bairro: data.bairro || "",
      cidade: data.localidade || "",
      estado: data.uf || ""
    }))

    toast?.success("Endereço preenchido pelo CEP")

  } catch (e) {
    console.error(e)
    toast?.error("Erro ao buscar CEP")
  }
}