import { useState, useEffect } from "react"
import api from "../../api/api"
import toast from "react-hot-toast"

import { useUIStore } from "../../store/uiStore"
import { usePermissao } from "../permissao/usePermissao"

const API_URL =
  import.meta.env.VITE_API_URL

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

  useEffect(() => {

    if (
      !id ||
      !podeVisualizar
    ) return

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
              `${API_URL}/uploads/${f.url}`,

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

    carregarFotos()

  }, [
    id,
    podeVisualizar,
    setLoadingGlobal
  ])

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
      files.length > 6
    ) {

      toast.error(
        "Máximo de 6 fotos"
      )

      return
    }

    setFotos(prev => [
      ...prev,
      ...files
    ])

    const previews =
      files.map(file => ({

        file,

        url:
          URL.createObjectURL(file),

        isBackend: false
      }))

    setPreview(prev => [
      ...prev,
      ...previews
    ])
  }

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

      toast.success(
        "Fotos enviadas!"
      )

      const res =
        await api.get(
          `/veiculos/${veiculoId}/fotos`
        )

      const fotosBackend =
        res.data || []

      setPreview(

        fotosBackend.map(f => ({

          id: f.id,

          url:
            `${API_URL}/uploads/${f.url}`,

          isBackend: true
        }))
      )

      setFotos([])

    } catch (e) {

      console.error(e)

      toast.error(
        e.response?.data?.erro ||
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

    upload
  }
}