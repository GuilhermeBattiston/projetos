const button = document.createElement("button");
button.type = "button";
button.className = "webforge-exit";
button.setAttribute("aria-label", "Encerrar sessão e sair da apresentação");
button.innerHTML =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 17v4H3V3h7v4m4 1 4 4-4 4m-7-4h12"/></svg><span>Sair</span>';
document.body.append(button);
button.addEventListener("click", async () => {
  button.disabled = true;
  try {
    const result = await fetch("/projetos/api/logout", {
      method: "POST",
      credentials: "same-origin",
      signal: AbortSignal.timeout(10000),
    });
    if (!result.ok) throw new Error();
    window.location.replace("/projetos");
  } catch {
    button.disabled = false;
    button.querySelector("span").textContent = "Tentar sair novamente";
  }
});
const checkSession = async () => {
  try {
    const response = await fetch("/projetos/api/session", {
      credentials: "same-origin",
      cache: "no-store",
    });
    if (response.status === 401) window.location.replace("/projetos?expired=1");
  } catch {
    /* Network loss is not treated as a successful logout. */
  }
};
window.addEventListener("pageshow", (event) => {
  if (event.persisted) window.location.reload();
  else checkSession();
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") checkSession();
});
setInterval(checkSession, 30000);
