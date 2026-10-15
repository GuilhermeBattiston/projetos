"""Disposable in-memory test clients only; never use production accounts."""
import os
from playwright.sync_api import sync_playwright, expect
BASE=os.environ['WEBFORGE_TEST_ORIGIN']
PASSWORD=os.environ['WEBFORGE_TEST_PASSWORD']
ARTIFACTS='/workspace/artifacts/webforge'
os.makedirs(ARTIFACTS,exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':1440,'height':1000})
    page=context.new_page()
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    assert page.goto(BASE+'/projetos').status==200
    expect(page.get_by_role('heading',name='Acesse seu projeto.')).to_be_visible()
    page.keyboard.press('Tab')
    expect(page.get_by_role('link',name='Pular para o acesso')).to_be_focused()
    page.get_by_role('button',name='Acessar projeto').click()
    expect(page.get_by_role('alert')).to_have_text('Informe seu usuário e sua senha para continuar.')
    page.get_by_role('textbox',name='Usuário',exact=True).fill('browser-client-a')
    page.locator('#password').fill('incorrect')
    page.get_by_role('button',name='Mostrar senha').click()
    assert page.locator('#password').get_attribute('type')=='text'
    page.get_by_role('button',name='Ocultar senha').click()
    assert page.locator('#password').get_attribute('type')=='password'
    page.get_by_role('button',name='Acessar projeto').click()
    expect(page.get_by_role('alert')).to_contain_text('Usuário ou senha inválidos')
    expect(page.get_by_role('textbox',name='Usuário',exact=True)).to_have_value('browser-client-a')
    page.route('**/projetos/api/login',lambda route:route.abort())
    page.get_by_role('button',name='Acessar projeto').click()
    expect(page.get_by_role('alert')).to_contain_text('Não foi possível conectar')
    expect(page.locator('#password')).to_have_value('incorrect')
    page.unroute('**/projetos/api/login')
    page.reload(wait_until='domcontentloaded')
    expect(page.get_by_role('heading',name='Acesse seu projeto.')).to_be_visible()
    page.evaluate('document.fonts.ready')
    for width in [320,390,768,1024,1440]:
        page.set_viewport_size({'width':width,'height':900})
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
    page.set_viewport_size({'width':1440,'height':1000})
    page.screenshot(path=ARTIFACTS+'/desktop-login.png',full_page=True)
    page.set_viewport_size({'width':390,'height':844})
    page.screenshot(path=ARTIFACTS+'/mobile-login.png',full_page=True)
    page.get_by_role('textbox',name='Usuário',exact=True).fill('browser-client-a')
    page.locator('#password').fill(PASSWORD)
    page.get_by_role('button',name='Acessar projeto').click()
    page.wait_for_url(BASE+'/projetos/tapioca-estacao-br/')
    expect(page.get_by_role('heading',name='Uma boa pausa pede tapioca.')).to_be_visible()
    page.reload(wait_until='domcontentloaded')
    expect(page.get_by_role('heading',name='Uma boa pausa pede tapioca.')).to_be_visible()
    page.get_by_role('button',name='Adicionar Frango & queijo',exact=True).click()
    page.get_by_role('button',name='Meu pedido').click()
    expect(page.get_by_test_id('subtotal')).to_have_text('R$ 22,90')
    page.keyboard.press('Escape')
    for img in page.locator('img').all():img.scroll_into_view_if_needed()
    page.wait_for_function('Array.from(document.images).every(i=>i.complete && i.naturalWidth>0)')
    assert context.request.get(BASE+'/projetos/lima-climatizacao/').status==403
    assert context.request.get(BASE+'/projetos/lima-climatizacao/images/hero.webp').status==403
    page.get_by_role('button',name='Encerrar sessão e sair da apresentação').click()
    page.wait_for_url(BASE+'/projetos')
    assert context.request.get(BASE+'/projetos/tapioca-estacao-br/images/tapioca-frango.webp').status==401
    page.get_by_role('textbox',name='Usuário',exact=True).fill('browser-client-b')
    page.locator('#password').fill(PASSWORD)
    page.get_by_role('button',name='Acessar projeto').click()
    page.wait_for_url(BASE+'/projetos/lima-climatizacao/')
    expect(page.get_by_role('heading',name='Climatização começa com uma boa conversa.')).to_be_visible()
    page.reload(wait_until='domcontentloaded')
    page.get_by_role('textbox',name='Seu nome').fill('Cliente de teste')
    page.get_by_role('textbox',name='Cidade ou bairro').fill('Curitiba')
    page.get_by_role('combobox').select_option(label='Manutenção preventiva')
    page.get_by_role('textbox',name='Descreva sua necessidade').fill('Solicitação de demonstração')
    page.get_by_role('button',name='Preparar mensagem').click()
    expect(page.get_by_role('link',name='Continuar no WhatsApp')).to_be_visible()
    for img in page.locator('img').all():img.scroll_into_view_if_needed()
    page.wait_for_function('Array.from(document.images).every(i=>i.complete && i.naturalWidth>0)')
    page.get_by_role('button',name='Encerrar sessão e sair da apresentação').click()
    page.wait_for_url(BASE+'/projetos')
    page.emulate_media(reduced_motion='reduce')
    assert page.evaluate('getComputedStyle(document.querySelector(".spinner")).animationName')=='none'
    assert not errors,errors
    print('PASS: real browser login for both companies; private prototypes, assets, refresh, cart, quote form, cross-company denial, logout, input validation, show/hide password, network retry, keyboard and five widths. No production accounts created.')
    browser.close()
