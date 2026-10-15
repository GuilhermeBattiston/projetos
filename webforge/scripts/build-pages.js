import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const repo = fileURLToPath(new URL('../../', import.meta.url));
const out = path.join(repo, 'pages-dist');
const registry = JSON.parse(await readFile(new URL('../prototypes.json', import.meta.url)));
await rm(out, { recursive: true, force: true });
await mkdir(path.join(out, 'portal'), { recursive: true });
await cp(new URL('../public/', import.meta.url), path.join(out, 'portal'), { recursive: true });
await cp(new URL('../pages/', import.meta.url), path.join(out, 'portal'), { recursive: true });
let login = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
login = login.replace('href="/projetos"', 'href="/projetos/"').replaceAll('Ambiente privado de apresentação', 'Ambiente de apresentação').replace('ACESSO PRIVADO', 'ACESSO AO PROJETO');
await writeFile(path.join(out, 'index.html'), login);
await writeFile(path.join(out, '.nojekyll'), '');
for (const { slug, source } of registry) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source)) throw new Error('Registro inválido');
  const result = spawnSync('npm', ['run', 'build'], {
    cwd: path.join(repo, source), stdio: 'inherit',
    env: { ...process.env, GITHUB_PAGES: 'false', WEBFORGE_BASE: `/projetos/${slug}/` },
  });
  if (result.status !== 0) process.exit(result.status || 1);
  const target = path.join(out, slug);
  await cp(path.join(repo, source, 'dist'), target, { recursive: true });
  const htmlPath = path.join(target, 'index.html');
  const html = await readFile(htmlPath, 'utf8');
  await writeFile(htmlPath, html.replace('<head>', `<head>\n<meta name="robots" content="noindex,nofollow,noarchive">\n<script src="/projetos/portal/gate.js" data-project="${slug}"></script>`));
}
console.log('GitHub Pages preparado em pages-dist. Acesso visual; arquivos públicos.');
