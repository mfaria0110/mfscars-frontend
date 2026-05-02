import Swal from "sweetalert2";

let timeout = null;
let warningTimeout = null;

const TEMPO_TOTAL = 30 * 60 * 1000; // 30 min
const TEMPO_AVISO = 29 * 60 * 1000; // aviso com 1 min restante

export function iniciarIdleLogout(logoutCallback) {
  function resetTimer() {
    if (timeout) clearTimeout(timeout);
    if (warningTimeout) clearTimeout(warningTimeout);

    // ⏰ AVISO 1 MINUTO ANTES
    warningTimeout = setTimeout(() => {
      mostrarAviso(logoutCallback);
    }, TEMPO_AVISO);

    // ⏳ LOGOUT FINAL
    timeout = setTimeout(() => {
      logoutCallback();
    }, TEMPO_TOTAL);
  }

  function mostrarAviso(logoutCallback) {
    let tempoRestante = 60;

    const interval = setInterval(() => {
      tempoRestante--;

      const el = document.getElementById("contador-idle");
      if (el) el.innerText = tempoRestante;

      if (tempoRestante <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    Swal.fire({
      title: "Sessão expirada",
      html: `
        <p>Você será desconectado por inatividade.</p>
        <p><b id="contador-idle">60</b> segundos restantes</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Continuar logado",
      cancelButtonText: "Sair agora",
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      clearInterval(interval);

      if (result.isConfirmed) {
        resetTimer(); // 🔥 continua sessão
      } else {
        logoutCallback(); // 🔒 logout
      }
    });
  }

  const eventos = [
    "mousemove",
    "mousedown",
    "keypress",
    "scroll",
    "touchstart"
  ];

  eventos.forEach((evento) => {
    window.addEventListener(evento, resetTimer);
  });

  resetTimer();
}