const API_URL = "https://mfscars-backend.onrender.com";

/* ===============================
   🔓 REQUEST PUBLICO
============================== */

export async function requestPublic(url, options = {}) {

  try {

    const headers = {
      ...(options.headers || {})
    };

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(API_URL + url, {
      ...options,
      headers
    });

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    return {
      ok: response.ok,
      status: response.status,
      data
    };

  } catch (err) {

    console.error("Erro API PUBLIC:", err);

    return {
      ok: false,
      status: 500,
      data: { erro: "Erro de conexão" }
    };

  }

}