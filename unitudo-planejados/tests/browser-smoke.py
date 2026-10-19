"""Local built-site checks, without visiting company links or sending messages."""
import functools,http.server,threading
from pathlib import Path
from urllib.parse import urlparse,parse_qs
from playwright.sync_api import sync_playwright,expect
root=Path(__file__).resolve().parents[1];artifacts=Path('/workspace/artifacts/unitudo-planejados');artifacts.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*_args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(root/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);page=browser.new_page(viewport={'width':1440,'height':1000});errors=[];failures=[]
        page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:failures.append(r.url) if r.status>=400 else None)
        base=f'http://127.0.0.1:{server.server_port}/';page.goto(base);page.evaluate('document.fonts.ready')
        expect(page.get_by_role('heading',level=1)).to_have_text('Seu espaço. Novas possibilidades.')
        page.keyboard.press('Tab');expect(page.get_by_role('link',name='Pular para o conteúdo')).to_be_focused()
        for link in page.locator('a[href^="#"]').all():assert page.locator(link.get_attribute('href')).count()==1
        maps=urlparse(page.get_by_role('link',name='Pesquisar endereço no Maps').get_attribute('href'));assert maps.path=='/maps/search/' and 'Olivio Domingos Leonardi, 89' in parse_qs(maps.query)['query'][0]
        page.get_by_role('button',name='Continuar',exact=True).click();expect(page.locator('#error-environment')).to_be_visible()
        page.get_by_role('link',name='Começar briefing para Cozinhas').click();expect(page.get_by_role('radio',name='Cozinha',exact=True)).to_be_checked();expect(page.locator('#error-environment')).not_to_be_visible()
        page.get_by_role('button',name='Continuar',exact=True).click();expect(page.locator('#brief-heading')).to_be_focused()
        page.get_by_role('button',name='Continuar',exact=True).click();expect(page.locator('#error-need')).to_be_visible()
        page.get_by_role('radio',name='Aproveitar melhor o espaço',exact=True).check();page.get_by_role('button',name='Continuar',exact=True).click()
        page.get_by_role('radio',name='Ainda não tenho preferência',exact=True).check();page.get_by_role('button',name='Continuar',exact=True).click()
        page.get_by_role('button',name='Revisar meu briefing',exact=True).click();expect(page.locator('#brief-name')).to_be_focused()
        page.locator('#brief-name').fill('Pessoa de teste');page.locator('#brief-location').fill('Curitiba');page.locator('#brief-measurements').fill('2,80 × 3 m');page.locator('#brief-notes').fill('Móveis & organização.\nReferência: madeira.')
        page.get_by_role('button',name='Voltar',exact=True).click();expect(page.get_by_role('radio',name='Ainda não tenho preferência')).to_be_checked();page.get_by_role('button',name='Continuar',exact=True).click();expect(page.locator('#brief-name')).to_have_value('Pessoa de teste')
        page.get_by_role('button',name='Revisar meu briefing',exact=True).click();expect(page.locator('#brief-heading')).to_be_focused()
        link=page.get_by_role('link',name='Enviar meu briefing pelo WhatsApp');url=urlparse(link.get_attribute('href'));message=parse_qs(url.query)['text'][0]
        assert url.path=='/5541995935907' and 'Ambiente: Cozinha' in message and 'Medidas: 2,80 × 3 m' in message and 'Móveis & organização.\n' in message
        assert link.get_attribute('target')=='_blank' and 'noopener' in link.get_attribute('rel')
        page.context.grant_permissions(['clipboard-read','clipboard-write']);page.get_by_role('button',name='Copiar briefing').click();expect(page.get_by_role('status')).to_have_text('Briefing copiado.');assert page.evaluate('navigator.clipboard.readText()')==message
        page.evaluate("() => { navigator.clipboard.writeText = async () => { throw new Error('unavailable'); }; }");page.get_by_role('button',name='Copiar briefing').click();expect(page.get_by_role('status')).to_contain_text('Não foi possível copiar')
        page.get_by_role('button',name='Revisar respostas').click();expect(page.get_by_role('radio',name='Cozinha',exact=True)).to_be_checked()
        page.get_by_role('button',name='04 Informações').click();expect(page.locator('#brief-notes')).to_have_value('Móveis & organização.\nReferência: madeira.')
        page.locator('#brief-location').fill(' ');page.get_by_role('button',name='05 Revisão').click()
        # Review requires valid fields even if a previously completed step is revisited.
        expect(page.locator('#error-location')).to_be_visible();expect(page.locator('#brief-location')).to_be_focused();page.locator('#brief-location').fill('Curitiba')
        for category,count in [('Closets',1),('Home offices',1),('Todos',6)]:page.get_by_role('button',name=category,exact=True).click();assert page.locator('.gallery-item').count()==count
        opener=page.get_by_role('button',name='Ampliar inspiração: Rotina com outro ritmo');opener.click();expect(page.get_by_role('dialog')).to_be_visible();expect(page.get_by_role('button',name='Fechar imagem')).to_be_focused();page.keyboard.press('ArrowRight');expect(page.locator('#lightbox-title')).to_have_text('Um lugar para desacelerar');page.get_by_role('button',name='Imagem anterior').click();expect(page.locator('#lightbox-title')).to_have_text('Rotina com outro ritmo');page.keyboard.press('Escape');expect(page.get_by_role('dialog')).not_to_be_visible();expect(opener).to_be_focused()
        assert page.evaluate('localStorage.length===0&&sessionStorage.length===0')
        page.emulate_media(reduced_motion='reduce')
        for width in [360,390,768,1024,1440]:
            page.set_viewport_size({'width':width,'height':1000 if width>599 else 844});page.evaluate("window.scrollTo({top:0,behavior:'instant'})")
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'Overflow {width}'
            if width in [390,1440]:page.screenshot(path=str(artifacts/f'{width}.png'),full_page=True,animations='disabled');page.screenshot(path=str(artifacts/f'{width}-hero.png'))
        page.set_viewport_size({'width':390,'height':844});page.evaluate("window.scrollTo({top:0,behavior:'instant'})");page.get_by_role('button',name='Abrir menu').click();page.keyboard.press('Escape');expect(page.get_by_role('button',name='Abrir menu')).to_be_focused();page.get_by_role('button',name='Abrir menu').click();page.locator('#main-nav').get_by_role('link',name='Contato',exact=True).click();expect(page.get_by_role('button',name='Abrir menu')).to_have_attribute('aria-expanded','false');page.wait_for_function("Math.abs(document.querySelector('#contato').getBoundingClientRect().top-86)<5")
        assert page.evaluate('getComputedStyle(document.documentElement).scrollBehavior')=='auto'
        page.locator('#inspiracoes').scroll_into_view_if_needed();page.wait_for_function('Array.from(document.querySelectorAll(".gallery-item img")).every(i=>i.complete&&i.naturalWidth>0)')
        page.route('**/images/kitchen.webp',lambda route:route.abort());page.reload();page.locator('.environment-0').scroll_into_view_if_needed();expect(page.locator('.environment-0 img')).to_have_attribute('data-fallback','true');expect(page.locator('.environment-0 img')).to_have_attribute('alt',__import__('re').compile('Imagem indisponível'))
        assert not errors,errors
        assert not failures,failures
        browser.close()
    print('PASS: five-step briefing, validation/edit/preservation, WhatsApp encoding/copy/failure, filters/lightbox/keyboard/focus, menu, five widths, imagery fallback, reduced motion, no stored form data or JavaScript errors.')
finally:server.shutdown();server.server_close()
