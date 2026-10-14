"""Run with Python and Playwright installed; uses system Chromium, no downloaded browser."""
import os
from playwright.sync_api import sync_playwright, expect
BASE = os.environ.get('TAPIOCA_TEST_URL', 'http://127.0.0.1:5174')
ARTIFACTS = '/workspace/artifacts/tapioca'
os.makedirs(ARTIFACTS, exist_ok=True)
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 1440, 'height': 1050})
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('console', lambda message: errors.append(message.text) if message.type == 'error' else None)
    assert page.goto(BASE, wait_until='networkidle').status == 200
    expect(page.get_by_role('heading', name='Uma boa pausa pede tapioca.')).to_be_visible()
    assert page.locator('.product-card').count() == 8
    page.get_by_role('button', name='Doces', exact=True).click()
    assert page.locator('.product-card').count() == 2
    page.get_by_role('button', name='Bebidas', exact=True).click()
    assert page.locator('.product-card').count() == 2
    page.get_by_role('button', name='Todos', exact=True).click()
    page.get_by_role('button', name='Adicionar Frango & queijo', exact=True).click()
    page.get_by_role('button', name='Adicionar Café coado', exact=True).click()
    page.get_by_role('button', name='Meu pedido').click()
    expect(page.locator('dialog')).to_be_visible()
    expect(page.get_by_test_id('subtotal')).to_have_text('R$ 29,80')
    page.get_by_role('button', name='Aumentar Frango & queijo').click()
    expect(page.get_by_test_id('subtotal')).to_have_text('R$ 52,70')
    page.get_by_role('button', name='Diminuir Frango & queijo').click()
    expect(page.get_by_test_id('subtotal')).to_have_text('R$ 29,80')
    page.get_by_role('button', name='Revisar pedido').click()
    assert page.locator('.order-review').count() == 0
    page.get_by_role('textbox', name='Seu nome').fill('Ana Oliveira')
    page.get_by_role('radio', name='Entrega').check()
    page.get_by_role('button', name='Revisar pedido').click()
    assert page.locator('.order-review').count() == 0
    page.get_by_role('textbox', name='Endereço de entrega').fill('   ')
    page.get_by_role('button', name='Revisar pedido').click()
    assert page.locator('.order-review').count() == 0
    page.get_by_role('textbox', name='Endereço de entrega').fill('Rua São João, 10, Centro, Curitiba')
    page.get_by_role('textbox', name='Alguma observação?').fill('Sem tomate & bem quente')
    page.get_by_role('button', name='Revisar pedido').click()
    message = page.locator('.order-review pre').inner_text()
    assert all(s in message for s in ['Ana Oliveira', 'Rua São João', 'Sem tomate & bem quente', '29,80'])
    expect(page.get_by_role('button', name='WhatsApp não configurado')).to_be_disabled()
    assert page.locator('a[href*="wa.me"]').count() == 0
    page.screenshot(path=f'{ARTIFACTS}/cart-delivery.png')
    page.get_by_role('radio', name='Retirada').check()
    page.get_by_role('button', name='Revisar pedido').click()
    assert 'Endereço:' not in page.locator('.order-review pre').inner_text()
    page.keyboard.press('Escape')
    expect(page.locator('dialog')).not_to_be_visible()
    page.reload(wait_until='networkidle')
    page.get_by_role('button', name='Meu pedido').click()
    expect(page.get_by_test_id('subtotal')).to_have_text('R$ 29,80')
    page.get_by_role('button', name='Remover Café coado').click()
    expect(page.get_by_test_id('subtotal')).to_have_text('R$ 22,90')
    page.get_by_role('button', name='Diminuir Frango & queijo').click()
    expect(page.get_by_text('Sua pausa começa aqui.')).to_be_visible()
    page.get_by_role('button', name='Explorar cardápio').click()
    for width in [320, 390, 768, 1024, 1440]:
        page.set_viewport_size({'width': width, 'height': 900})
        page.evaluate('window.scrollTo(0,0)')
        assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), width
        if width < 700:
            page.get_by_role('button', name='Abrir menu').click()
            page.get_by_role('navigation', name='Navegação principal').get_by_role('link', name='Cardápio').click()
            expect(page.get_by_role('button', name='Abrir menu')).to_be_visible()
        assert page.evaluate('Array.from(document.images).every(img => !img.complete || img.naturalWidth > 0)')
    page.set_viewport_size({'width':1440,'height':1050})
    page.evaluate('window.scrollTo(0,0)')
    page.screenshot(path=f'{ARTIFACTS}/desktop.png', full_page=True)
    page.set_viewport_size({'width':390,'height':844})
    page.screenshot(path=f'{ARTIFACTS}/mobile.png', full_page=True)
    page.get_by_role('button', name='Adicionar Frango & queijo', exact=True).click()
    page.locator('.mobile-cart').click()
    page.keyboard.press('Tab')
    assert page.evaluate('document.querySelector("dialog").contains(document.activeElement)')
    page.screenshot(path=f'{ARTIFACTS}/mobile-cart.png')
    page.keyboard.press('Escape')
    page.emulate_media(reduced_motion='reduce')
    assert page.evaluate('getComputedStyle(document.documentElement).scrollBehavior') == 'auto'
    assert not errors, errors
    print('PASS: filters, arithmetic, quantities, removal, empty cart, persistence, required fields, delivery/pickup, message preview, missing-phone blocking, mobile menu, modal keyboard focus, five viewport sizes, images and console.')
    browser.close()
