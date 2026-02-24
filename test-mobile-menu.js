const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    
    // Modo Escritorio
    const desktopPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await desktopPage.goto('http://localhost:8080/stem/ciencia-datos.html');
    await desktopPage.waitForTimeout(2000);
    await desktopPage.screenshot({ path: 'screenshots/desktop-view.png', fullPage: false });
    console.log('✓ Captura escritorio guardada');
    
    // Verificar que NO hay botón hamburguesa en desktop
    const hamburgerDesktop = await desktopPage.$('.mobile-menu-btn');
    console.log(hamburgerDesktop ? '⚠ Botón hamburguesa VISIBLE en desktop' : '✓ Botón hamburguesa OCULTO en desktop (correcto)');
    
    // Verificar que SÍ hay navegación desktop
    const navDesktop = await desktopPage.$('.nav-desktop');
    console.log(navDesktop ? '✓ Navegación desktop VISIBLE (correcto)' : '⚠ Navegación desktop NO visible');
    
    await desktopPage.close();
    
    // Modo Móvil
    const mobilePage = await browser.newPage({ viewport: { width: 375, height: 667 } });
    await mobilePage.goto('http://localhost:8080/stem/ciencia-datos.html');
    await mobilePage.waitForTimeout(2000);
    await mobilePage.screenshot({ path: 'screenshots/mobile-view.png', fullPage: false });
    console.log('✓ Captura móvil guardada');
    
    // Verificar que SÍ hay botón hamburguesa en móvil
    const hamburgerMobile = await mobilePage.$('.mobile-menu-btn');
    console.log(hamburgerMobile ? '✓ Botón hamburguesa VISIBLE en móvil (correcto)' : '✗ Botón hamburguesa NO visible en móvil (ERROR)');
    
    // Verificar que NO hay navegación desktop en móvil
    const navDesktopMobile = await mobilePage.$('.nav-desktop');
    const navDesktopVisible = await navDesktopMobile.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none';
    }).catch(() => false);
    console.log(navDesktopVisible ? '⚠ Navegación desktop visible en móvil' : '✓ Navegación desktop OCULTA en móvil (correcto)');
    
    // Hacer clic en el menú hamburguesa y capturar
    if (hamburgerMobile) {
        await hamburgerMobile.click();
        await mobilePage.waitForTimeout(500);
        await mobilePage.screenshot({ path: 'screenshots/mobile-menu-open.png', fullPage: false });
        console.log('✓ Captura menú abierto guardada');
        
        // Verificar que el menú móvil está visible
        const navMobile = await mobilePage.$('.nav-mobile');
        const hasActiveClass = await navMobile.evaluate(el => el.classList.contains('active'));
        console.log(hasActiveClass ? '✓ Menú móvil tiene clase active (correcto)' : '✗ Menú móvil NO tiene clase active (ERROR)');
    }
    
    await mobilePage.close();
    await browser.close();
    
    console.log('\n=== RESUMEN ===');
    console.log('Las capturas se guardaron en:');
    console.log('- screenshots/desktop-view.png');
    console.log('- screenshots/mobile-view.png');
    console.log('- screenshots/mobile-menu-open.png');
})();
