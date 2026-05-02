import { useState } from "react"
import api from "../../api/api"
import { useAppStore } from "../../store/useAppStore"
import { iniciarIdleLogout } from "../../utils/idleLogout"
import { useLoja } from "../loja/useLoja"
import toast from "react-hot-toast" // 🔥 ADICIONADO

export function useAuth() {

  const {
    setAuth,
    clearSession
  } = useAppStore()

  const { trocarLoja } = useLoja()

  const [loading, setLoading] =
    useState(false)

  const [erro, setErro] =
    useState(null)

  async function login(email, senha) {

    setErro(null)

    // 🔥 VALIDAÇÃO COM FEEDBACK
    if (!email || !senha) {
      const msg = "Preencha email e senha"

      setErro(msg)
      toast.error(msg)

      return false
    }

    try {
      setLoading(true)

      // limpa sessão anterior
      clearSession()

      const res = await api.post(
        "/auth/login",
        { email, senha }
      )

      console.log("LOGIN RESPONSE:", res.data)
      console.log("LOJAS:", res.data.lojas)

      const {
        accessToken,
        refreshToken,
        usuario,
        lojas,
        permissoes
      } = res.data

      if (!lojas || lojas.length === 0) {
        const msg = "Usuário sem acesso a lojas"

        setErro(msg)
        toast.error(msg)

        return false
      }

      // salva sessão
      setAuth({
        accessToken,
        refreshToken,
        usuario,
        lojas,
        permissoes
      })

      // auto seleção de loja
      if (lojas.length === 1) {
        const lojaId = lojas[0].id

        console.log("🔥 Auto selecionando loja:", lojaId)

        setTimeout(() => {
          trocarLoja(lojaId)
        }, 100)
      }

      // inicia logout por inatividade
      iniciarIdleLogout(clearSession)

      return true

    } catch (e) {
      console.error("Erro login:", e)

      // 🔒 MENSAGEM SEGURA (NÃO EXPÕE BACKEND)
      const msg = "Email ou senha inválidos"

      setErro(msg)
      toast.error(msg)

      return false

    } finally {
      setLoading(false)
    }
  }

  return {
    login,
    loading,
    erro
  }
}