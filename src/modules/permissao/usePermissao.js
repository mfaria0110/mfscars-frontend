import { useAppStore } from "../../store/useAppStore"

export function usePermissao() {
  const usuario = useAppStore((state) => state.usuario)
  const permissoes = useAppStore((state) => state.permissoes)

  function isAdminGlobal() {
    if (!usuario) return false

    // 🔥 regra alinhada com backend
    if (usuario.master) return true

    // garante consistência (case insensitive)
    if (
      typeof usuario.perfil === "string" &&
      usuario.perfil.toLowerCase() === "admin"
    ) {
      return true
    }

    return false
  }

  function temPermissao(chave) {
    if (!chave || typeof chave !== "string") {
      console.warn("Permissão inválida:", chave)
      return false
    }

    // 🔥 bypass global
    if (isAdminGlobal()) {
      return true
    }

    // segurança contra estado indefinido
    if (!Array.isArray(permissoes)) {
      return false
    }

    return permissoes.includes(chave)
  }

  return {
    temPermissao,
    isAdminGlobal
  }
}