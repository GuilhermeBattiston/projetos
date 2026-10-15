"""Local compiled-site validation. Never send messages or contact the company."""
import functools,http.server,threading,re
from pathlib import Path
from urllib.parse import urlparse,parse_qs
from playwright.sync_api import sync_playwright,expect
root=Path(__file__).resolve().parents[1];artifacts=Path('/workspace/artifacts/planejados-curitiba');artifacts.mkdir(parents=True,exist_ok=True)
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*_args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(QuietHandler,directory=str(root/'dist')))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':1440,'height':1000});errors=[];failures=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('response',lambda r:failures.append(r.url) if r.status>=400 else None)
        page.goto(f'http://127.0.0.1:{server.server_port}/');page.evaluate('document.fonts.ready')
        expect(page.get_by_role('heading',level=1)).to_have_text('O seu jeito de viver, na cozinha.')
        assert page.locator('h1').count()==1
        page.keyboard.press('Tab');expect(page.get_by_role('link',name='Pular para o conteúdo')).to_be_focused()
        for link in page.locator('a[href^="#"]').all():assert page.locator(link.get_attribute('href')).count()==1
        assert '17027054168084007393' in page.get_by_role('link',name='Ver no Google Maps').get_attribute('href')
        page.get_by_role('button',name='Continuar',exact=True).click();expect(page.locator('#error-layout')).to_be_visible()
        page.get_by_role('radio',name='Em L',exact=True).check();page.get_by_role('radio',name='Natural',exact=True).check()
        page.get_by_role('button',name='Continuar',exact=True).click();expect(page.get_by_role('heading',name='O que faz diferença na rotina?')).to_be_focused()
        page.get_by_role('button',name='Continuar',exact=True).click();expect(page.locator('#error-priority')).to_be_visible()
        page.get_by_role('radio',name='Mais armazenamento',exact=True).check();page.locator('#pref-location').fill('Centro, Curitiba')
        page.get_by_role('button',name='Continuar',exact=True).click()
        page.get_by_role('button',name='Revisar mensagem',exact=True).click();expect(page.locator('#pref-name')).to_be_focused()
        page.locator('#pref-name').fill('Pessoa de teste');page.locator('#pref-description').fill('Armários & espaço para café.\nTons naturais.')
        page.get_by_role('button',name='Voltar',exact=True).click();expect(page.locator('#pref-location')).to_have_value('Centro, Curitiba')
        page.get_by_role('button',name='Continuar',exact=True).click();expect(page.locator('#pref-name')).to_have_value('Pessoa de teste')
        page.get_by_role('button',name='Revisar mensagem',exact=True).click();expect(page.locator('#review-title')).to_be_focused()
        link=page.get_by_role('link',name='Continuar no WhatsApp');url=urlparse(link.get_attribute('href'));message=parse_qs(url.query)['text'][0]
        assert url.path=='/5541984172689' and 'Tipo de cozinha: Em L' in message and 'Estilo: Natural' in message and 'café.\nTons naturais.' in message
        assert link.get_attribute('target')=='_blank' and 'noopener' in link.get_attribute('rel')
        page.context.grant_permissions(['clipboard-read','clipboard-write']);page.get_by_role('button',name='Copiar texto').click();expect(page.get_by_role('status')).to_have_text('Mensagem copiada.')
        assert page.evaluate('navigator.clipboard.readText()')==message
        page.evaluate("() => { navigator.clipboard.writeText = async () => { throw new Error('unavailable'); }; }")
        page.get_by_role('button',name='Copiar texto').click();expect(page.get_by_role('status')).to_contain_text('Não foi possível copiar')
        page.get_by_role('button',name='Editar preferências').click();expect(page.get_by_role('radio',name='Em L',exact=True)).to_be_checked()
        for category,count in [('Compacta',1),('Com ilha',1),('Tons naturais',1),('Todas',6)]:
            page.get_by_role('button',name=category,exact=True).click();assert page.locator('.reference').count()==count
        opener=page.get_by_role('button',name='Ampliar inspiração: Encontros do dia a dia');opener.click()
        expect(page.get_by_role('dialog')).to_be_visible();expect(page.get_by_role('button',name='Fechar imagem')).to_be_focused()
        page.keyboard.press('ArrowRight');expect(page.locator('#lightbox-title')).to_have_text('O essencial encontra lugar')
        page.get_by_role('button',name='Imagem anterior').click();expect(page.locator('#lightbox-title')).to_have_text('Encontros do dia a dia')
        page.keyboard.press('Escape');expect(page.get_by_role('dialog')).not_to_be_visible();expect(opener).to_be_focused()
        page.locator('.reference-minimalista').get_by_role('link',name='Partir desta inspiração').click()
        expect(page.get_by_role('radio',name='Linear',exact=True)).to_be_checked();expect(page.get_by_role('radio',name='Minimalista',exact=True)).to_be_checked()
        page.get_by_role('button',name='03 Sua ideia').click();expect(page.locator('#pref-name')).to_have_value('Pessoa de teste')
        assert page.evaluate('localStorage.length===0&&sessionStorage.length===0')
        page.emulate_media(reduced_motion='reduce')
        for width in [360,390,768,1024,1440]:
            page.set_viewport_size({'width':width,'height':1000 if width>599 else 844});page.evaluate("window.scrollTo({top:0,behavior:'instant'})")
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'Overflow {width}'
            if width in [390,1440]:page.screenshot(path=str(artifacts/f'{width}.png'),full_page=True,animations='disabled');page.screenshot(path=str(artifacts/f'{width}-hero.png'))
        page.set_viewport_size({'width':390,'height':844});page.evaluate("window.scrollTo({top:0,behavior:'instant'})")
        page.get_by_role('button',name='Abrir menu').click();expect(page.get_by_role('button',name='Fechar menu')).to_have_attribute('aria-expanded','true')
        page.keyboard.press('Escape');expect(page.get_by_role('button',name='Abrir menu')).to_be_focused()
        page.get_by_role('button',name='Abrir menu').click();page.locator('#main-nav').get_by_role('link',name='Contato',exact=True).click();expect(page.get_by_role('button',name='Abrir menu')).to_have_attribute('aria-expanded','false')
        page.wait_for_function("Math.abs(document.querySelector('#contato').getBoundingClientRect().top-86)<5")
        assert page.evaluate('getComputedStyle(document.documentElement).scrollBehavior')=='auto'
        page.locator('#inspiracoes').scroll_into_view_if_needed();page.wait_for_function('Array.from(document.querySelectorAll(".reference img")).every(i=>i.complete&&i.naturalWidth>0)')
        assert not errors,errors
        assert not failures,failures
        browser.close()
    print('PASS: three-step preferences, validation, back/edit/preset preservation, WhatsApp review/encoding/copy/failure, filters, modal, keyboard/focus, mobile menu, five widths, images, reduced motion; no browser errors or stored form data.')
finally:server.shutdown();server.server_close()
