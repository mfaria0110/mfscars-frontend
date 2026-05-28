import {
  useAppStore
} from "../../store/useAppStore"

export function usePermissao() {

  const usuario =
    useAppStore(
      state => state.usuario
    )

  const permissoes =
    useAppStore(
      state => state.permissoes
    )

  /* =========================
     ADMIN GLOBAL
  ========================= */
  function isAdminGlobal() {

    if (!usuario) {
      return false
    }

    return (

      usuario.master === true ||

      usuario.master === "true" ||

      usuario.master === 1 ||

      usuario.master === "1" ||

      (
        typeof usuario.perfil ===
          "string" &&

        usuario.perfil
          .toLowerCase()
          .trim() === "admin"
      )
    )
  }

  /* =========================
     TEM PERMISSÃO
  ========================= */
  function temPermissao(
    chave
  ) {

    if (

      !chave ||

      typeof chave !==
        "string"

    ) {

      return false
    }

    /* =========================
       BYPASS ADMIN
    ========================= */
    if (isAdminGlobal()) {

      return true
    }

    /* =========================
       SEGURANÇA
    ========================= */
    if (

      !Array.isArray(
        permissoes
      )

    ) {

      return false
    }

    return permissoes.includes(
      chave
    )
  }

  return {

    temPermissao,

    isAdminGlobal
  }
}