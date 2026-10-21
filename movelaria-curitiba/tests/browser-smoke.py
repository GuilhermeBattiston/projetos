"""Local built-prototype validation. Never visits company links or sends messages."""
import functools,http.server,threading,re
from pathlib import Path
from urllib.parse import urlparse,parse_qs
from playwright.sync_api import sync_playwright,expect
root=Path(__file__).resolve().parents[1]
artifacts=Path('/workspace/artifacts/movelaria-curitiba');artifacts.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*_args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(root/'dist')))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':1440,'height':1000});errors=[];failures=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('response',lambda r:failures.append(r.url) if r.status>=400 else None)
        page.goto(f'http://127.0.0.1:{server.server_port}/');page.evaluate('document.fonts.ready');page.emulate_media(reduced_motion='reduce')
        expect(page.get_by_role('heading',level=1)).to_have_text('O detalhe transforma o espaço.')
        expect(page.locator('.portfolio-intro h2')).to_have_text('Possibilidades para cada jeito de viver.')
        expect(page.locator('meta[name=robots]')).to_have_attribute('content','noindex,nofollow,noarchive')
        page.keyboard.press('Tab');expect(page.get_by_role('link',name='Pular para o conteúdo')).to_be_focused()
        for link in page.locator('a[href^="#"]').all():assert page.locator(link.get_attribute('href')).count()==1
        assert page.locator('a[href="mailto:contato@movelariacuritiba.com.br"]').count()==1
        for link in page.locator('a[href^="https://wa.me/"]').all():assert urlparse(link.get_attribute('href')).path=='/5541996152584'
        page.get_by_role('button',name='Continuar',exact=True).click();expect(page.locator('#error-environment')).to_be_visible();expect(page.get_by_role('radio',name='Cozinha',exact=True)).to_be_focused()
        page.locator('.environment-links').get_by_role('link',name='01 Cozinhas').click();expect(page.get_by_role('radio',name='Cozinha',exact=True)).to_be_checked();expect(page.locator('#error-environment')).not_to_be_visible()
        page.keyboard.press('Tab');page.get_by_role('button',name='Continuar',exact=True).click();expect(page.locator('#brief-heading')).to_be_focused()
        page.get_by_role('button',name='Continuar',exact=True).click();expect(page.locator('#error-type')).to_be_visible()
        page.get_by_role('radio',name='Armário planejado').check();page.get_by_role('button',name='Continuar',exact=True).click()
        page.get_by_role('button',name='Continuar',exact=True).click();expect(page.locator('#error-priorities')).to_be_visible()
        page.get_by_role('checkbox',name='Aproveitamento de espaço').check();page.get_by_role('checkbox',name='Organização',exact=True).check();page.get_by_role('checkbox',name='Estética',exact=True).check();page.get_by_role('checkbox',name='Estética',exact=True).uncheck();page.get_by_role('button',name='Continuar',exact=True).click()
        page.get_by_role('button',name='Revisar briefing',exact=True).click();expect(page.locator('#brief-name')).to_be_focused();expect(page.locator('#error-name')).to_be_visible();expect(page.locator('#error-location')).to_be_visible();expect(page.locator('#error-description')).to_be_visible()
        page.locator('#brief-name').fill('Pessoa de teste');page.locator('#brief-location').fill('Curitiba / Água Verde');page.locator('#brief-measurements').fill('2,80 × 3 m');page.locator('#brief-description').fill('Armário & organização.\nReferência: madeira.')
        page.get_by_role('button',name='Voltar',exact=True).click();expect(page.get_by_role('checkbox',name='Organização',exact=True)).to_be_checked();expect(page.get_by_role('checkbox',name='Aproveitamento de espaço')).to_be_checked();expect(page.get_by_role('checkbox',name='Estética',exact=True)).not_to_be_checked();page.get_by_role('button',name='Continuar',exact=True).click();expect(page.locator('#brief-location')).to_have_value('Curitiba / Água Verde')
        page.get_by_role('button',name='Revisar briefing',exact=True).click();expect(page.locator('#brief-heading')).to_be_focused();expect(page.locator('.brief-review pre')).to_contain_text('Prioridades: Aproveitamento de espaço, Organização')
        page.context.grant_permissions(['clipboard-read','clipboard-write']);page.get_by_role('button',name='Copiar briefing').click();expect(page.locator('.copy-status')).to_have_text('Briefing copiado.');assert 'Pessoa de teste' in page.evaluate('navigator.clipboard.readText()')
        page.evaluate("() => {navigator.clipboard.writeText=async()=>{throw new Error('unavailable')};}");page.get_by_role('button',name='Copiar briefing').click();expect(page.locator('.copy-status')).to_contain_text('Não foi possível copiar')
        page.get_by_role('button',name='Continuar para o WhatsApp',exact=True).click();link=page.get_by_role('link',name='Enviar briefing pelo WhatsApp');url=urlparse(link.get_attribute('href'));message=parse_qs(url.query)['text'][0]
        assert url.path=='/5541996152584' and 'Tipo de projeto: Armário planejado' in message and 'Medidas: 2,80 × 3 m' in message and 'Armário & organização.\n' in message
        assert link.get_attribute('target')=='_blank' and 'noopener' in link.get_attribute('rel')
        expect(page.locator('.brief-review')).to_contain_text('Nenhum pedido foi enviado por este site.')
        page.get_by_role('button',name='Editar respostas').click();page.get_by_role('button',name='04 Informações').click();page.locator('#brief-location').fill(' ');page.get_by_role('button',name='06 WhatsApp',exact=True).click();expect(page.locator('#error-location')).to_be_visible();expect(page.locator('#brief-location')).to_be_focused();page.locator('#brief-location').fill('Curitiba')
        page.get_by_role('button',name='Revisar briefing',exact=True).click();page.get_by_role('button',name='Editar respostas').click();page.locator('.gallery-living').get_by_role('link').click();expect(page.get_by_role('radio',name='Sala',exact=True)).to_be_checked();expect(page.get_by_role('button',name='04 Informações')).to_be_enabled();page.get_by_role('button',name='04 Informações').click();expect(page.locator('#brief-name')).to_have_value('Pessoa de teste')
        for category in ['Cozinhas','Salas','Banheiros','Quartos','Escritórios']:
            page.locator('.filters').get_by_role('button',name=category,exact=True).click();assert page.locator('.gallery-item').count()==1
        page.locator('.filters').get_by_role('button',name='Todos',exact=True).click();assert page.locator('.gallery-item').count()==5
        opener=page.get_by_role('button',name='Ampliar: Uma cozinha que participa da casa');opener.click();expect(page.get_by_role('dialog')).to_be_visible();expect(page.get_by_role('button',name='Fechar imagem')).to_be_focused();page.keyboard.press('Shift+Tab');expect(page.get_by_role('button',name='Próxima imagem')).to_be_focused();page.keyboard.press('Tab');expect(page.get_by_role('button',name='Fechar imagem')).to_be_focused();page.keyboard.press('ArrowRight');expect(page.locator('#lightbox-title')).to_have_text('Espaço para reunir');page.get_by_role('button',name='Imagem anterior').click();expect(page.locator('#lightbox-title')).to_have_text('Uma cozinha que participa da casa');page.keyboard.press('Escape');expect(page.get_by_role('dialog')).not_to_be_visible();expect(opener).to_be_focused()
        for img in page.locator('img').all():
            img.scroll_into_view_if_needed();expect(img).to_have_js_property('complete',True);assert img.evaluate('(i)=>i.naturalWidth>0')
        for width in [360,390,768,1024,1440]:
            page.set_viewport_size({'width':width,'height':1000 if width>599 else 844});page.evaluate("window.scrollTo({top:0,behavior:'instant'})")
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'Overflow {width}'
            page.screenshot(path=str(artifacts/f'{width}.png'),full_page=True,animations='disabled')
            if width in [390,1440]:page.screenshot(path=str(artifacts/f'{width}-hero.png'),animations='disabled')
        page.set_viewport_size({'width':390,'height':844});page.get_by_role('button',name='Abrir menu').click();page.keyboard.press('Escape');expect(page.get_by_role('button',name='Abrir menu')).to_be_focused();page.get_by_role('button',name='Abrir menu').click();page.keyboard.press('Shift+Tab');expect(page.locator('#main-nav .button')).to_be_focused();page.keyboard.press('Tab');expect(page.get_by_role('button',name='Fechar menu')).to_be_focused();page.locator('#main-nav').get_by_role('link',name='Contato',exact=True).click();expect(page.get_by_role('button',name='Abrir menu')).to_have_attribute('aria-expanded','false');assert abs(page.locator('#contato').bounding_box()['y']-95)<5
        assert page.evaluate('getComputedStyle(document.documentElement).scrollBehavior')=='auto'
        assert page.evaluate('localStorage.length===0&&sessionStorage.length===0')
        page.route('**/images/bathroom.webp',lambda route:route.abort());page.reload();img=page.locator('.gallery-bathroom img');img.scroll_into_view_if_needed();expect(img).to_have_attribute('data-fallback','true');expect(img).to_have_attribute('alt',re.compile('Imagem indisponível'));page.wait_for_function('document.querySelector(".gallery-bathroom img").complete&&document.querySelector(".gallery-bathroom img").naturalWidth>0')
        assert not errors,errors
        assert not failures,failures
        browser.close()
    print('PASS: six-step briefing, multiple priorities, validation/edit/preservation, WhatsApp encoding and clipboard failure, all filters, modal keyboard/focus, menu, five widths, image loading/fallback, reduced motion and no stored data or JavaScript errors.')
finally:server.shutdown();server.server_close()
