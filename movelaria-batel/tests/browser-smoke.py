"""Exercise built prototype locally; never send a message or visit company links."""
import functools
import http.server
from pathlib import Path
import threading
from urllib.parse import urlparse, parse_qs
from playwright.sync_api import sync_playwright, expect

root = Path(__file__).resolve().parents[1]
artifacts = Path('/workspace/artifacts/movelaria-batel')
artifacts.mkdir(parents=True, exist_ok=True)
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass
server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(QuietHandler, directory=str(root / 'dist')))
threading.Thread(target=server.serve_forever, daemon=True).start()
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1440, 'height': 1000})
        errors, failures = [], []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('response', lambda r: failures.append(r.url) if r.status >= 400 else None)
        page.goto(f'http://127.0.0.1:{server.server_port}/')
        page.evaluate('document.fonts.ready')
        expect(page.get_by_role('heading', level=1)).to_have_text('Seu espaço merece um projeto à altura.')
        assert page.locator('h1').count() == 1
        page.keyboard.press('Tab')
        expect(page.get_by_role('link', name='Pular para o conteúdo')).to_be_focused()
        for link in page.locator('a[href^="https://wa.me/"]').all():
            url = urlparse(link.get_attribute('href'))
            assert url.path == '/5541996318510'
            assert parse_qs(url.query)['text'][0].startswith('Olá! Conheci a Movelaria Batel')
            assert link.get_attribute('target') == '_blank'
            assert 'noopener' in link.get_attribute('rel')
        assert '14432097110645917681' in page.get_by_role('link', name='Ver localização no Google Maps').get_attribute('href')
        for link in page.locator('a[href^="#"]').all():
            assert page.locator(link.get_attribute('href')).count() == 1
        for i, name in enumerate(['Cozinhas', 'Dormitórios', 'Salas de estar', 'Home office', 'Ambientes integrados']):
            tab = page.get_by_role('tab', name=f'0{i+1} {name}')
            tab.click()
            expect(tab).to_have_attribute('aria-selected', 'true')
            panel = page.get_by_role('tabpanel')
            expect(panel).to_be_visible()
            assert name.upper() in panel.inner_text()
            assert 'Tenho interesse' in parse_qs(urlparse(panel.get_by_role('link').get_attribute('href')).query)['text'][0]
        page.get_by_role('tab', name='05 Ambientes integrados').focus()
        page.keyboard.press('Home')
        expect(page.get_by_role('tab', name='01 Cozinhas')).to_be_focused()
        page.keyboard.press('ArrowRight')
        expect(page.get_by_role('tab', name='02 Dormitórios')).to_be_focused()
        page.keyboard.press('End')
        expect(page.get_by_role('tab', name='05 Ambientes integrados')).to_be_focused()
        opener = page.get_by_role('button', name='Ampliar inspiração: O centro da casa')
        opener.click()
        expect(page.get_by_role('dialog')).to_be_visible()
        expect(page.get_by_role('button', name='Fechar imagem')).to_be_focused()
        page.keyboard.press('ArrowRight')
        expect(page.locator('#inspiration-title')).to_have_text('A beleza de perto')
        page.get_by_role('button', name='Imagem anterior').click()
        expect(page.locator('#inspiration-title')).to_have_text('O centro da casa')
        page.keyboard.press('Escape')
        expect(page.get_by_role('dialog')).not_to_be_visible()
        expect(opener).to_be_focused()
        for width in [360, 390, 768, 1024, 1440]:
            page.set_viewport_size({'width': width, 'height': 1000 if width > 599 else 844})
            page.evaluate("window.scrollTo({top: 0, behavior: 'instant'})")
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'Overflow {width}'
            if width in [390, 1440]:
                page.screenshot(path=str(artifacts / f'{width}.png'), full_page=True)
                page.screenshot(path=str(artifacts / f'{width}-hero.png'))
        page.set_viewport_size({'width': 390, 'height': 844})
        page.evaluate("window.scrollTo({top: 0, behavior: 'instant'})")
        page.get_by_role('button', name='Abrir menu').click()
        expect(page.get_by_role('button', name='Fechar menu')).to_have_attribute('aria-expanded', 'true')
        page.keyboard.press('Escape')
        expect(page.get_by_role('button', name='Abrir menu')).to_be_focused()
        page.get_by_role('button', name='Abrir menu').click()
        page.locator('#main-navigation').get_by_role('link', name='Contato', exact=True).click()
        expect(page.get_by_role('button', name='Abrir menu')).to_have_attribute('aria-expanded', 'false')
        page.wait_for_function("Math.abs(document.querySelector('#contato').getBoundingClientRect().top - 87) < 5")
        page.emulate_media(reduced_motion='reduce')
        assert page.evaluate('getComputedStyle(document.documentElement).scrollBehavior') == 'auto'
        page.locator('#inspiracoes').scroll_into_view_if_needed()
        page.wait_for_function('Array.from(document.querySelectorAll(".inspiration img")).every(i => i.complete && i.naturalWidth > 0)')
        assert not errors, errors
        assert not failures, failures
        browser.close()
    print('PASS: five environments, tab keyboard navigation, gallery/lightbox, focus, contact links, mobile menu, five widths, images and reduced motion; no browser errors.')
finally:
    server.shutdown()
    server.server_close()
