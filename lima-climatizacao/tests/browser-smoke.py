"""Smoke test without sending WhatsApp messages. Requires Playwright and system Chromium."""
import os
from urllib.parse import urlparse, parse_qs
from playwright.sync_api import sync_playwright, expect
BASE = os.environ.get('LIMA_TEST_URL', 'http://127.0.0.1:5177/')
ARTIFACTS = '/workspace/artifacts/lima-climatizacao'
os.makedirs(ARTIFACTS, exist_ok=True)
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    context = browser.new_context(permissions=['clipboard-read','clipboard-write'], viewport={'width':1440,'height':1000})
    page = context.new_page()
    errors=[]
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('console', lambda m: errors.append(m.text) if m.type=='error' else None)
    assert page.goto(BASE, wait_until='networkidle').status==200
    expect(page.get_by_role('heading',name='Climatização começa com uma boa conversa.')).to_be_visible()
    assert page.locator('h1').count()==1
    assert page.locator('#servicos article').count()==5
    for link in page.locator('a[href^="#"]').all():
        href=link.get_attribute('href')
        assert page.locator(href).count()==1,href
    for image in page.locator('img').all():
        image.scroll_into_view_if_needed()
        expect(image).to_be_visible()
    page.wait_for_function('Array.from(document.images).every(i=>i.complete && i.naturalWidth>0)')
    assert page.evaluate('document.fonts.check("500 20px Manrope")')
    assert page.evaluate("document.fonts.check('500 20px Space Grotesk')")
    for link in page.locator('a[href^="https://wa.me/"]').all():
        parsed=urlparse(link.get_attribute('href'))
        assert parsed.path=='/5541999927966'
        assert parse_qs(parsed.query)['text'][0].startswith('Olá!')
        assert link.get_attribute('target')=='_blank'
        assert 'noopener' in link.get_attribute('rel')
    assert page.locator('a[href="tel:+5541999927966"]').count()==1
    assert page.locator('a[href="https://maps.google.com/?cid=46830226042662314"]').count()==1
    page.get_by_role('button',name='Preparar mensagem').click()
    assert page.locator('.field-error').count()==4
    page.get_by_role('textbox',name='Seu nome').fill('  ')
    page.get_by_role('textbox',name='Cidade ou bairro').fill('Curitiba — Água Verde')
    page.get_by_role('combobox').select_option(label='Instalação de ar-condicionado')
    assert page.get_by_role('textbox',name='Cidade ou bairro').input_value()=='Curitiba — Água Verde'
    page.get_by_role('textbox',name='Descreva sua necessidade').fill('Sala 20 m² & aparelho com ruído?')
    page.get_by_role('button',name='Preparar mensagem').click()
    assert page.locator('.field-error').count()==1
    page.get_by_role('textbox',name='Seu nome').fill('Ana Souza')
    page.get_by_role('button',name='Preparar mensagem').click()
    expect(page.get_by_role('heading',name='Confira antes de continuar.')).to_be_focused()
    message=page.locator('.quote-review pre').inner_text()
    assert all(t in message for t in ['Ana Souza','Instalação','Curitiba — Água Verde','20 m² & aparelho com ruído?'])
    url=page.get_by_role('link',name='Continuar no WhatsApp').get_attribute('href')
    assert urlparse(url).path=='/5541999927966'
    assert parse_qs(urlparse(url).query)['text']==[message]
    expect(page.get_by_text('Esta mensagem ainda não foi enviada.')).to_be_visible()
    page.get_by_role('button',name='Copiar mensagem').click()
    expect(page.get_by_role('button',name='Mensagem copiada')).to_be_visible()
    assert page.evaluate('navigator.clipboard.readText()')==message
    page.screenshot(path=f'{ARTIFACTS}/quote-review.png')
    page.get_by_role('button',name='Editar informações').click()
    expect(page.get_by_role('textbox',name='Seu nome')).to_have_value('Ana Souza')
    page.locator('#servicos .service-list article').first.get_by_role('link',name='Solicitar informações').click()
    expect(page.get_by_role('combobox')).to_have_value('Manutenção preventiva')
    expect(page.get_by_role('textbox',name='Seu nome')).to_have_value('Ana Souza')
    page.locator('.faq-list summary').first.click()
    assert page.locator('.faq-list details').first.get_attribute('open') is not None
    page.locator('.faq-list summary').first.click()
    for width in [320,390,768,1024,1440]:
        page.set_viewport_size({'width':width,'height':900})
        page.evaluate('window.scrollTo(0,0)')
        assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth'),width
        if width<=850:
            page.get_by_role('button',name='Abrir menu').click()
            expect(page.get_by_role('navigation',name='Navegação principal')).to_be_visible()
            page.get_by_role('navigation',name='Navegação principal').get_by_role('link',name='Serviços',exact=True).click()
            expect(page.get_by_role('button',name='Abrir menu')).to_be_visible()
    page.set_viewport_size({'width':1440,'height':1000})
    page.evaluate('window.scrollTo(0,0)')
    page.screenshot(path=f'{ARTIFACTS}/desktop.png',full_page=True)
    page.set_viewport_size({'width':390,'height':844})
    page.evaluate('window.scrollTo(0,0)')
    page.screenshot(path=f'{ARTIFACTS}/mobile.png',full_page=True)
    page.emulate_media(reduced_motion='reduce')
    assert page.evaluate('getComputedStyle(document.documentElement).scrollBehavior')=='auto'
    page.reload(wait_until='networkidle')
    page.keyboard.press('Tab')
    expect(page.get_by_role('link',name='Pular para o conteúdo')).to_be_focused()
    page.keyboard.press('Enter')
    expect(page.get_by_role('heading',name='Um olhar técnico. Para cada necessidade.')).to_be_in_viewport()
    assert page.evaluate('localStorage.length')==0
    assert not errors,errors
    print('PASS: menu, anchors, 5 widths, photos, local fonts, form validation, service preselection, retained values, message encoding, WhatsApp links (no send), copy/edit, FAQ, keyboard, reduced motion, no stored personal data, no console errors.')
    browser.close()
