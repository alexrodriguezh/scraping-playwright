// @ts-check

const { chromium } = require('playwright')

const shops = [
  {
    vendor: 'Amazon',
    hasSchema: false,
    url: 'https://www.amazon.es/dp/B08H93ZRLL/ref=cm_sw_r_cp_apa_glt_i_91H0Z62WVDRT6FMW033Z?tag=eol00-21',
    checkStock: async ({ page }) => {
      const addToCartButton = await page.$$('#add-to-cart-button')
      return addToCartButton.length > 0
    }
  },
  {
    vendor: 'Microsoft',
    hasSchema: false,
    url: 'https://www.xbox.com/es-es/configure/8WJ714N3RBTL',
    checkStock: async ({ page }) => {
      const content = await page.textContent('[aria-label="Finalizar la compra del pack"]')
      return content.includes('Sin existencias') === false
    }
  },
  {
    vendor: 'Fnac',
    hasSchema: true,
    url: 'https://www.fnac.es/Consola-Xbox-Series-X-1TB-Negro-Videoconsola-Consola/a7732201',
    checkStock: async ({ page }) => {
      const notAvailableIcon = await page.$$('.f-buyBox-availabilityStatus-unavailable')
      return notAvailableIcon.length === 0
    }
  },
  {
    vendor: 'El Corte Inglés',
    hasSchema: false,
    url: 'https://www.elcorteingles.es/videojuegos/A37047078-xbox-series-x/',
    checkStock: async ({ page }) => {
      const content = await page.textContent('#js_add_to_cart_desktop')
      return content.includes('Agotado temporalmente') === false
    }
  },
  {
    vendor: 'PCComponentes',
    hasSchema: true,
    url: 'https://www.pccomponentes.com/microsoft-xbox-series-x-1tb',
    checkStock: async ({ page }) => {
      const content = await page.textContent('#buy-buttons-section')
      return content && content.includes('Añadir al carrito') === true
    }
  }

]

;( async () => {
  const browser = await chromium.launch({ headless: false })
  const available = []

  for (const shop of shops) {
    const { checkStock, vendor, url } = shop

    const page = await browser.newPage()
    await page.goto(url)

    const hasStock = await checkStock({ page })
    if (hasStock) available.push(vendor)

    const log = `${vendor}: ${hasStock ? 'HAS STOCK!!!! 🤩' : 'Out of Stock 🥲'}`

    console.log(log)

    await page.screenshot({ path: `screenshots/${vendor}.png` })
    await page.close()
  }

  const availableOn = available.length > 0
    ? `Disponible en: ${available.join(', ')}`
    : 'No hay stock 😢'

  await browser.close()
})()
