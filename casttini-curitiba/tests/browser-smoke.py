"""Exercise local compiled prototype; never contact the company or send messages."""
import functools
import http.server
from pathlib import Path
import threading
from urllib.parse import urlparse,parse_qs
from playwright.sync_api import sync_playwright,expect
root=Path(__file__).resolve().parents[1]
artifacts=Path('/workspace/artifacts/casttini-curitiba');artifacts.mkdir(parents=True,exist_ok=True)
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*_args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(QuietHandler,directory=str(root/'dist')))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':1440,'height':1000})
        errors=[];failures=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('response',lambda r:failures.append(r.url) if r.status>=400 else None)
        page.goto(f'http://127.0.0.1:{server.server_port}/');page.evaluate('document.fonts.ready')
        expect(page.get_by_role('heading',level=1)).to_have_text('Planejar o espaço. Mudar o viver.')
        assert page.locator('h1').count()==1
        page.keyboard.press('Tab');expect(page.get_by_role('link',name='Pular para o conteúdo')).to_be_focused()
        for link in page.locator('a[href^="#"]').all():assert page.locator(link.get_attribute('href')).count()==1
        assert '15415016691241166023' in page.get_by_role('link',name='Abrir no Google Maps').get_attribute('href')
        names=['Cozinhas','Dormitórios','Closets','Salas de estar','Home offices','Ambientes corporativos']
        for i,name in enumerate(names):
            button=page.get_by_role('button',name=f'0{i+1} {name}',exact=True);button.click();expect(button).to_have_attribute('aria-pressed','true')
            expect(page.locator('#environment-detail img')).to_have_attribute('src',__import__('re').compile('images/'))
        page.get_by_role('button',name='03 Closets',exact=True).click()
        page.get_by_role('link',name='Planejar este ambiente').click();expect(page.locator('#quote-environment')).to_have_value('closet')
        page.get_by_role('button',name='Preparar mensagem').click();expect(page.locator('#quote-name')).to_be_focused();expect(page.locator('#error-name')).to_have_text('Informe seu nome.')
        assert page.locator('.quote-review').count()==0
        page.locator('#quote-name').fill('Pessoa de teste')
        page.locator('#quote-location').fill('Batel, Curitiba')
        page.locator('#quote-description').fill('Organizar roupas & acessórios.\nReferência: madeira clara.')
        page.get_by_role('button',name='Preparar mensagem').click();expect(page.locator('#review-title')).to_be_visible()
        link=page.get_by_role('link',name='Continuar no WhatsApp');url=urlparse(link.get_attribute('href'));message=parse_qs(url.query)['text'][0]
        assert url.path=='/554130422121' and 'Ambiente: Closets' in message and 'roupas & acessórios.\n' in message
        assert link.get_attribute('target')=='_blank' and 'noopener' in link.get_attribute('rel')
        page.context.grant_permissions(['clipboard-read','clipboard-write'])
        page.get_by_role('button',name='Copiar texto').click();expect(page.get_by_role('status')).to_have_text('Mensagem copiada.')
        assert page.evaluate('navigator.clipboard.readText()')==message
        page.evaluate("() => { navigator.clipboard.writeText = async () => { throw new Error('unavailable'); }; }")
        page.get_by_role('button',name='Copiar texto').click();expect(page.get_by_role('status')).to_contain_text('Não foi possível copiar')
        page.locator('#quote-description').fill('Uma nova ideia de organização.');assert page.locator('.quote-review').count()==0
        expect(page.locator('#quote-name')).to_have_value('Pessoa de teste')
        assert page.evaluate('localStorage.length===0 && sessionStorage.length===0')
        for category,expected in [('Cozinhas',1),('Closets',1),('Detalhes',1),('Todos',7)]:
            page.get_by_role('button',name=category,exact=True).click();assert page.locator('.gallery-item').count()==expected
        opener=page.get_by_role('button',name='Ampliar inspiração: Entre encontros e receitas');opener.click()
        expect(page.get_by_role('dialog')).to_be_visible();expect(page.get_by_role('button',name='Fechar imagem')).to_be_focused()
        page.keyboard.press('ArrowRight');expect(page.locator('#lightbox-title')).to_have_text('Uma pausa, um novo olhar')
        page.get_by_role('button',name='Imagem anterior').click();expect(page.locator('#lightbox-title')).to_have_text('Entre encontros e receitas')
        page.keyboard.press('Escape');expect(page.get_by_role('dialog')).not_to_be_visible();expect(opener).to_be_focused()
        for width in [360,390,768,1024,1440]:
            page.set_viewport_size({'width':width,'height':1000 if width>599 else 844});page.evaluate("window.scrollTo({top:0,behavior:'instant'})")
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'Overflow {width}'
            if width in [390,1440]:page.screenshot(path=str(artifacts/f'{width}.png'),full_page=True);page.screenshot(path=str(artifacts/f'{width}-hero.png'))
        page.set_viewport_size({'width':390,'height':844});page.evaluate("window.scrollTo({top:0,behavior:'instant'})")
        page.get_by_role('button',name='Abrir menu').click();expect(page.get_by_role('button',name='Fechar menu')).to_have_attribute('aria-expanded','true')
        page.keyboard.press('Escape');expect(page.get_by_role('button',name='Abrir menu')).to_be_focused()
        page.get_by_role('button',name='Abrir menu').click();page.locator('#main-nav').get_by_role('link',name='Contato',exact=True).click()
        expect(page.get_by_role('button',name='Abrir menu')).to_have_attribute('aria-expanded','false')
        page.wait_for_function("Math.abs(document.querySelector('#contato').getBoundingClientRect().top-86)<5")
        page.emulate_media(reduced_motion='reduce');assert page.evaluate('getComputedStyle(document.documentElement).scrollBehavior')=='auto'
        page.locator('#inspiracoes').scroll_into_view_if_needed()
        page.wait_for_function('Array.from(document.querySelectorAll(".gallery-item img")).every(i=>i.complete&&i.naturalWidth>0)')
        assert not errors,errors
        assert not failures,failures
        browser.close()
    print('PASS: environments, filters, modal/keyboard/focus, form validation/review/copy/failure/edit, contact URLs, no data storage, mobile menu, five widths, images, reduced motion; no browser errors.')
finally:server.shutdown();server.server_close()
