import { useState, useEffect } from "react"
import api from "../../api/api"
import toast from "react-hot-toast"

import { useUIStore } from "../../store/uiStore"
import { usePermissao } from "../permissao/usePermissao"

const API_URL =
  import.meta.env.VITE_API_URL

/* =========================
   🔥 NORMALIZA URL
========================= */
function normalizarUrl(url) {

  if (!url) {
    return `${API_URL}/assets/sem-foto.jpg`
  }

  /* já é URL completa */
  if (url.startsWith("http")) {

    return url.replace(
      /^http:\/\//,
      "https://"
    )
  }

  /* remove uploads duplicado */
  const limpa =
    url.replace(
      /^uploads\//,
      ""
    )

  return `${API_URL}/uploads/${limpa}`
}

export function useVeiculoFotos(id) {

  const [fotos, setFotos] =
    useState([])

  const [preview, setPreview] =
    useState([])

  const setLoadingGlobal =
    useUIStore(
      state => state.setLoading
    )

  const { temPermissao } =
    usePermissao()

  const podeVisualizar =
    temPermissao(
      "veiculo.visualizar"
    )

  const podeEditar =
    temPermissao(
      "veiculo.editar"
    )

  /* =========================
     🔥 CARREGAR FOTOS
  ========================= */
  useEffect(() => {

    if (
      !id ||
      !podeVisualizar
    ) return

    carregarFotos()

  }, [
    id,
    podeVisualizar
  ])

  /* =========================
     🔥 CARREGAR
  ========================= */
  async function carregarFotos() {

    try {

      setLoadingGlobal(true)

      const res =
        await api.get(
          `/veiculos/${id}/fotos`
        )

      const fotosBackend =
        res.data || []

      const previews =
        fotosBackend.map(f => ({

          id: f.id,

          url:
            normalizarUrl(
              f.url
            ),

          principal:
            f.principal,

          isBackend: true
        }))

      setPreview(previews)

    } catch (e) {

      console.error(
        "Erro ao carregar fotos",
        e
      )

      toast.error(
        e.response?.data?.erro ||
        "Erro ao carregar fotos"
      )

    } finally {

      setLoadingGlobal(false)
    }
  }

  /* =========================
     🔥 SELECIONAR
  ========================= */
  function handleSelect(e) {

    if (!podeEditar) {

      toast.error(
        "Sem permissão para adicionar fotos"
      )

      return
    }

    const files =
      Array.from(
        e.target.files
      )

    if (
      preview.length +
      files.length > 10
    ) {

      toast.error(
        "Máximo de 10 fotos"
      )

      return
    }

    setFotos(prev => [
      ...prev,
      ...files
    ])

    const previews =
      files.map(file => ({

        id: null,
        
        file,

        url:
          URL.createObjectURL(file),

        principal: false,

        isBackend: false
      }))

    setPreview(prev => [
      ...prev,
      ...previews
    ])
  }

  /* =========================
     🔥 REMOVER
  ========================= */
  async function remover(index) {

    if (!podeEditar) {

      toast.error(
        "Sem permissão para remover fotos"
      )

      return
    }

    const item =
      preview[index]

    try {

      setLoadingGlobal(true)

      if (item.isBackend) {

        await api.delete(
          `/veiculos/fotos/${item.id}`
        )

        setPreview(prev =>
          prev.filter(
            (_, i) => i !== index
          )
        )

        toast.success(
          "Foto removida!"
        )

        await carregarFotos()

        return
      }

      setFotos(prev =>
        prev.filter(
          (_, i) => i !== index
        )
      )

      setPreview(prev => {

        const novo = [...prev]

        URL.revokeObjectURL(
          novo[index].url
        )

        return novo.filter(
          (_, i) => i !== index
        )
      })

    } catch (e) {

      console.error(e)

      toast.error(
        e.response?.data?.erro ||
        "Erro ao remover foto"
      )

    } finally {

      setLoadingGlobal(false)
    }
  }

  /* =========================
     🔥 DEFINIR PRINCIPAL
  ========================= */
  async function definirPrincipal(fotoId) {

  if (!podeEditar) {

    toast.error(
      "Sem permissão"
    )

    return
  }

  try {

    setLoadingGlobal(true)

    await api.put(

      `/veiculos/fotos/${fotoId}/principal`

    )

    toast.success(
      "Foto principal definida"
    )

    await carregarFotos()

  } catch (e) {

    console.error(e)

    toast.error(
      e.response?.data?.erro ||
      "Erro ao definir principal"
    )

  } finally {

    setLoadingGlobal(false)
  }
}
  
  /* =========================
     🔥 UPLOAD
  ========================= */
  async function upload(veiculoId) {

    if (!podeEditar) {

      toast.error(
        "Sem permissão para enviar fotos"
      )

      return
    }

    if (
      !veiculoId ||
      fotos.length === 0
    ) return

    try {

      setLoadingGlobal(true)

      const formData =
        new FormData()

      fotos.forEach(f => {

        formData.append(
          "foto",
          f
        )
      })

      await api.post(

        `/veiculos/${veiculoId}/fotos`,

        formData,

        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      )

    setFotos([])

    await carregarFotos()

    toast.success(
      "Fotos enviadas!"
    )

    } catch (e) {

    console.error(
      "UPLOAD FOTO ERRO:",
      e.response?.data || e
    )

    toast.error(
      e.response?.data?.erro ||
      e.message ||
      "Erro ao enviar fotos"
    )

    } finally {

      setLoadingGlobal(false)
    }
  }

  return {

    preview,

    handleSelect,

    remover,

    upload,

    definirPrincipal
  }
}