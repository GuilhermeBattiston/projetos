"""Built-site smoke check. Inspects contact URLs without messaging the company."""
import functools
import http.server
from pathlib import Path
import threading
from urllib.parse import urlparse, parse_qs
from playwright.sync_api import sync_playwright, expect

root = Path(__file__).resolve().parents[1]
artifacts = Path('/workspace/artifacts/lucas-construcoes')
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
        expect(page.get_by_role('heading', level=1)).to_have_text('Sua obra começa com uma boa escolha.')
        assert page.locator('h1').count() == 1
        page.keyboard.press('Tab')
        expect(page.get_by_role('link', name='Pular para o conteúdo')).to_be_focused()
        for link in page.locator('a[href^="https://wa.me/"]').all():
            url = urlparse(link.get_attribute('href'))
            assert url.path == '/5541998175073'
            assert parse_qs(url.query)['text'][0].startswith('Olá! Conheci a Lucas')
            assert link.get_attribute('target') == '_blank'
            assert 'noopener' in link.get_attribute('rel')
        assert '14687284506171798171' in page.get_by_role('link', name='Ver endereço no Google Maps').get_attribute('href')
        for link in page.locator('a[href^="#"]').all():
            assert page.locator(link.get_attribute('href')).count() == 1
        page.get_by_role('button', name='02 Reformas residenciais').click()
        expect(page.get_by_role('region', name='02 Reformas residenciais')).to_be_visible()
        expect(page.get_by_role('region', name='01 Construção civil')).not_to_be_visible()
        page.get_by_role('button', name='Interiores', exact=True).click()
        assert page.locator('.gallery-item').count() == 1
        expect(page.locator('.gallery-item')).to_contain_text('Outra forma de viver a casa')
        opener = page.get_by_role('button', name='Ampliar referência: Outra forma de viver a casa')
        opener.click()
        expect(page.get_by_role('dialog')).to_be_visible()
        page.keyboard.press('Escape')
        expect(page.get_by_role('dialog')).not_to_be_visible()
        expect(opener).to_be_focused()
        page.get_by_role('button', name='Todas', exact=True).click()
        assert page.locator('.gallery-item').count() == 3
        for width in [360, 390, 768, 1024, 1440]:
            page.set_viewport_size({'width': width, 'height': 1000 if width > 599 else 844})
            page.evaluate('window.scrollTo(0, 0)')
            page.wait_for_timeout(250)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'Overflow {width}'
            assert page.evaluate('Array.from(document.images).every(i => i.complete && i.naturalWidth > 0)')
            if width in [390,1440]:
                page.screenshot(path=str(artifacts / f'{width}.png'), full_page=True)
        page.set_viewport_size({'width': 390, 'height': 844})
        page.get_by_role('button', name='Abrir menu').click()
        expect(page.get_by_role('button', name='Fechar menu')).to_have_attribute('aria-expanded', 'true')
        page.keyboard.press('Escape')
        expect(page.get_by_role('button', name='Abrir menu')).to_be_focused()
        page.get_by_role('button', name='Abrir menu').click()
        page.locator('#main-nav').get_by_role('link', name='Contato', exact=True).click()
        expect(page.get_by_role('button', name='Abrir menu')).to_have_attribute('aria-expanded', 'false')
        page.wait_for_timeout(900)
        assert abs(page.locator('#contato').bounding_box()['y'] - 85) < 5, page.locator('#contato').bounding_box()
        page.emulate_media(reduced_motion='reduce')
        assert page.evaluate('getComputedStyle(document.documentElement).scrollBehavior') == 'auto'
        assert not errors, errors
        assert not failures, failures
        browser.close()
    print('PASS: navigation, contact URLs, accordion, filters, modal/keyboard/focus, mobile menu, five widths, images, reduced motion; no browser errors.')
finally:
    server.shutdown()
    server.server_close()
