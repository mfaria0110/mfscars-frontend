import {
  useAppStore
} from "../../store/useAppStore"

export function usePermissao() {

  const usuario =
    useAppStore(
      (state) => state.usuario
    )

  const permissoes =
    useAppStore(
      (state) => state.permissoes
    )

  /* =========================
     ADMIN GLOBAL
  ========================= */

  function isAdminGlobal() {

    if (!usuario) {

      return false
    }

    /* =========================
       MASTER
    ========================= */

    if (

      usuario.master === true ||

      usuario.master === "true" ||

      usuario.master === 1 ||

      usuario.master === "1"

    ) {

      return true
    }

    /* =========================
       PERFIL ADMIN
    ========================= */

    if (

      typeof usuario.perfil ===
        "string" &&

      usuario.perfil
        .toLowerCase()
        .trim() === "admin"

    ) {

      return true
    }

    return false
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

      console.warn(

        "Permissão inválida:",

        chave

      )

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