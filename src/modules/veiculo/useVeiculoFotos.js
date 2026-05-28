import { useState, useEffect } from "react"
import api from "../../api/api"
import toast from "react-hot-toast"
import { tratarErro }
  from "../../utils/tratarErro"
import imageCompression
  from "browser-image-compression"

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

    } 

catch (e) {

  console.error(
    "Erro ao carregar fotos",
    e
  )

  tratarErro(e)

}

    finally {

      setLoadingGlobal(false)
    }
  }

  /* =========================
     🔥 SELECIONAR
  ========================= */
  async function handleSelect(e) {

    if (!podeEditar) {

      toast.error(
        "Sem permissão para adicionar fotos"
      )

      return
    }

    const rawFiles =
      Array.from(
        e.target.files
      )

    const files =
      await Promise.all(

        rawFiles.map(file =>

          imageCompression(

            file,

            {

              maxSizeMB: 0.7,

              maxWidthOrHeight: 1600,

              useWebWorker: true

            }
          )
        )
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

        id:
          `tmp-${Date.now()}-${Math.random()}`,

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

      /* FOTO BACKEND */
      if (item.isBackend) {

        await api.delete(
          `/veiculos/fotos/${item.id}`
        )

        toast.success(
          "Foto removida!"
        )

        await carregarFotos()

        return
      }

      /* FOTO LOCAL */
      setFotos(prev =>
        prev.filter(
          (_, i) => i !== index
        )
      )

      setPreview(prev => {

        const novo = [...prev]

        if (
          novo[index]?.url?.startsWith(
            "blob:"
          )
        ) {

          URL.revokeObjectURL(
            novo[index].url
          )
        }

        return novo.filter(
          (_, i) => i !== index
        )
      })

    } 

catch (e) {

  console.error(e)

  tratarErro(e)

}

    finally {

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

      await carregarFotos()

      toast.success(
        "Foto principal definida"
      )

    } 

catch (e) {

  console.error(e)

  tratarErro(e)

}

    finally {

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

      /* limpa blobs locais */
      preview.forEach(p => {

        if (
          !p.isBackend &&
          p.url?.startsWith("blob:")
        ) {

          URL.revokeObjectURL(
            p.url
          )
        }
      })

      /* limpa estados */
      setFotos([])

      /* mantém somente backend */
      setPreview(prev =>
        prev.filter(
          p => p.isBackend
        )
      )

      await carregarFotos()

      toast.success(
        "Fotos enviadas!"
      )

    } 

catch (e) {

  console.error(
    "UPLOAD FOTO ERRO:",
    e.response?.data || e
  )

  tratarErro(e)

} 

    finally {

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