const form = document.querySelector("#login-form");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const error = document.querySelector("#error");
const submit = form.querySelector("[type=submit]");
const toggle = document.querySelector("#toggle-password");
const showError = (message) => {
  error.textContent = message;
  error.hidden = false;
};
const busy = (value) => {
  submit.disabled = value;
  form.setAttribute("aria-busy", String(value));
  form.querySelector(".button-label").textContent = value
    ? "Verificando acesso…"
    : "Acessar projeto";
  form.querySelector(".spinner").hidden = !value;
  form.querySelector(".button-arrow").hidden = value;
};
const navigate = (destination) => {
  if (
    typeof destination !== "string" ||
    !/^\/projetos\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(destination)
  )
    throw new Error("Destino inválido.");
  window.location.replace(destination);
};
toggle.addEventListener("click", () => {
  const visible = password.type === "password";
  password.type = visible ? "text" : "password";
  toggle.setAttribute(
    "aria-label",
    visible ? "Ocultar senha" : "Mostrar senha",
  );
  toggle.setAttribute("aria-pressed", String(visible));
  toggle.querySelector(".eye-open").hidden = visible;
  toggle.querySelector(".eye-closed").hidden = !visible;
});
if (new URLSearchParams(window.location.search).has("expired"))
  showError("Sua sessão terminou. Entre novamente para continuar.");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (submit.disabled) return;
  error.hidden = true;
  username.removeAttribute("aria-invalid");
  password.removeAttribute("aria-invalid");
  if (!username.value.trim() || !password.value) {
    showError("Informe seu usuário e sua senha para continuar.");
    const field = !username.value.trim() ? username : password;
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", "error");
    field.focus();
    return;
  }
  busy(true);
  try {
    const response = await fetch("/projetos/portal/access.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Configuração indisponível");
    const accounts = await response.json();
    const account = accounts.find((item) => item.username === username.value.trim());
    const value = new TextEncoder().encode(`${username.value.trim()}:${password.value}`);
    const digest = await crypto.subtle.digest("SHA-256", value);
    const hash = [...new Uint8Array(digest)].map((n) => n.toString(16).padStart(2, "0")).join("");
    if (!account || account.passwordHash !== hash) {
      showError("Usuário ou senha incorretos.");
      password.setAttribute("aria-invalid", "true");
      password.focus();
      return;
    }
    sessionStorage.setItem("webforge-presentation", JSON.stringify({ project: account.project, expires: Date.now() + 8 * 60 * 60 * 1000 }));
    navigate(`/projetos/${account.project}/`);
  } catch {
    showError(
      "Não foi possível conectar ao portal. Verifique sua conexão e tente novamente.",
    );
  } finally {
    busy(false);
  }
});
