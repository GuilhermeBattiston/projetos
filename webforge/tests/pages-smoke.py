"""Exercise static Pages navigation with disposable browser credentials."""
import functools
import hashlib
import http.server
import json
from pathlib import Path
import secrets
import tempfile
import threading
from playwright.sync_api import sync_playwright, expect

repo = Path(__file__).resolve().parents[2]
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass

with tempfile.TemporaryDirectory() as directory:
    Path(directory, 'projetos').symlink_to(repo / 'pages-dist', target_is_directory=True)
    handler = functools.partial(QuietHandler, directory=directory)
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}/projetos/'
    password = secrets.token_urlsafe(18)
    registry = json.loads((repo / 'webforge/pages/access.json').read_text())
    builds = json.loads((repo / 'webforge/prototypes.json').read_text())
    assert len(registry) == len(builds) and len(registry) > 1
    assert {a['project'] for a in registry} == {entry['slug'] for entry in builds}
    assert all(len(a['passwordHash']) == 64 for a in registry)
    accounts = [{**a, 'passwordHash': hashlib.sha256(f"{a['username']}:{password}".encode()).hexdigest()} for a in registry]
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
            page = browser.new_page()
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.route('**/portal/access.json', lambda route: route.fulfill(json=accounts))
            page.goto(base)
            expect(page.get_by_role('heading', name='Acesse seu projeto.')).to_be_visible()
            page.locator('#username').fill('incorrect')
            page.locator('#password').fill('incorrect')
            page.get_by_role('button', name='Acessar projeto').click()
            expect(page.get_by_role('alert')).to_have_text('Usuário ou senha incorretos.')
            for account in accounts:
                page.locator('#username').fill(account['username'])
                page.locator('#password').fill(password)
                page.get_by_role('button', name='Acessar projeto').click()
                page.wait_for_url(base + account['project'] + '/')
                expect(page.locator('#root')).not_to_be_empty()
                page.reload()
                expect(page.get_by_role('button', name='Sair', exact=True)).to_be_visible()
                other = next(a for a in accounts if a != account)
                page.goto(base + other['project'] + '/')
                page.wait_for_url(base + '?expired=1')
                page.locator('#username').fill(account['username'])
                page.locator('#password').fill(password)
                page.get_by_role('button', name='Acessar projeto').click()
                page.wait_for_url(base + account['project'] + '/')
                page.get_by_role('button', name='Sair', exact=True).click()
                page.wait_for_url(base)
                page.goto(base + account['project'] + '/')
                page.wait_for_url(base + '?expired=1')
            page.set_viewport_size({'width': 390, 'height': 844})
            expect(page.get_by_role('button', name='Acessar projeto')).to_be_visible()
            assert not errors, errors
            browser.close()
        print('PASS: invalid login, all configured destinations, refresh, cross-project redirect, logout, direct navigation and mobile; no JavaScript errors.')
    finally:
        server.shutdown()
        server.server_close()
