import { useState }
  from "react"

import { useNavigate }
  from "react-router-dom"

import toast
  from "react-hot-toast"

import { useAuth }
  from "../../modules/auth/useAuth"

import { useAppStore }
  from "../../store/useAppStore"

import api
  from "../../api/api"

import "./login.css"

export default function Login() {

  const navigate =
    useNavigate()

  const { login, loading } =
    useAuth()

  const abrirAceite =
    useAppStore(
      s => s.abrirAceite
    )

  const [email, setEmail] =
    useState("")

  const [senha, setSenha] =
    useState("")

  async function handleLogin() {

    if (!email || !senha) {

      toast.error(
        "Preencha email e senha"
      )

      return
    }

    try {

      const ok =
        await login(
          email,
          senha
        )

      if (!ok) return

      /* ===============================
         VERIFICA NOVOS TERMOS
      =============================== */

      try {

        const aceite =
          await api.get(
            "/juridico/verificar-aceite"
          )

        if (

          aceite.data?.precisaAceite

        ) {

          abrirAceite(
            aceite.data.pendentes || []
          )
        }

      } catch(e){

        console.error(
          "Erro ao verificar aceite",
          e
        )
      }

      toast.success(
        "Login realizado com sucesso"
      )

      navigate(
        "/app/veiculos"
      )

    } catch (error) {

      console.error(error)

      toast.error(
        "Erro ao conectar com o servidor"
      )
    }
  }

  return (

    <div className="login-page">

      <div className="login-card">

        <h1 className="login-title">
          🚗 MFS Cars
        </h1>

        <p className="login-subtitle">
          Acesse sua conta
        </p>

        <input

          className="login-input"

          placeholder="Email"

          value={email}

          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <input

          type="password"

          className="login-input"

          placeholder="Senha"

          value={senha}

          onChange={(e) =>
            setSenha(
              e.target.value
            )
          }
        />

        <button

          className="login-btn"

          onClick={handleLogin}

          disabled={loading}

        >

          {

            loading
              ? "Entrando..."
              : "Entrar"

          }

        </button>

      </div>

    </div>
  )
}