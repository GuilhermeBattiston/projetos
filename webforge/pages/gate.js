(() => {
  const project = document.currentScript.dataset.project;
  const valid = () => {
    try {
      const access = JSON.parse(sessionStorage.getItem('webforge-presentation'));
      return access?.project === project && access.expires > Date.now();
    } catch { return false; }
  };
  const check = () => {
    if (!valid()) window.location.replace('/projetos/?expired=1');
  };
  check();
  window.addEventListener('pageshow', check);
  window.addEventListener('focus', check);
  document.addEventListener('DOMContentLoaded', () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/projetos/portal/session.css';
    document.head.append(link);
    const button = document.createElement('button');
    button.className = 'webforge-exit';
    button.textContent = 'Sair';
    button.type = 'button';
    button.addEventListener('click', () => {
      sessionStorage.removeItem('webforge-presentation');
      window.location.replace('/projetos/');
    });
    document.body.append(button);
  });
})();
