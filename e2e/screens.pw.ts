import { expect, test, type Page } from '@playwright/test'

const BAD = "I'm sorry, but you never tell me anything. It was just a joke, you're overreacting."
const shot = (page: Page, name: string, info: { project: { name: string } }) =>
  page.screenshot({ path: `e2e/screenshots/${info.project.name}-${name}.png`, fullPage: false })

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
}

async function tapTargetsOk(page: Page, scope = 'body') {
  const small = await page.$$eval(`${scope} button:visible`, (els) =>
    els.map((e) => ({ t: e.textContent?.trim() || e.getAttribute('aria-label'), h: e.getBoundingClientRect().height })).filter((b) => b.h < 43.5),
  )
  expect(small).toEqual([])
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }) // screenshots show resting state, not mid-animation
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
})

test('main screen: empty', async ({ page }, info) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Say sorry, the right way')
  await expect(page.getByRole('button', { name: 'Ready to send?' })).toBeDisabled()
  await noHorizontalScroll(page)
  await tapTargetsOk(page)
  await shot(page, '01-main-empty', info)
})

test('main screen: flags and hints', async ({ page }, info) => {
  await page.getByLabel('Your apology').fill(BAD)
  await expect(page.getByRole('heading', { name: /things to look at/ })).toBeVisible()
  await expect(page.locator('.flag--strong').first()).toBeVisible()
  await expect(page.getByText('words').first()).toBeVisible()
  await noHorizontalScroll(page)
  await tapTargetsOk(page)
  await page.evaluate(() => window.scrollTo(0, 0))
  await shot(page, '02-main-flags', info)
  await page.screenshot({ path: `e2e/screenshots/${info.project.name}-02-main-flags-full.png`, fullPage: true })

  // Ignore removes a card; Show in text selects the phrase.
  const before = await page.locator('.flag').count()
  await page.getByRole('button', { name: 'Ignore' }).first().click()
  await expect(page.locator('.flag')).toHaveCount(before - 1)
})

test('starter overlay', async ({ page }, info) => {
  await page.getByRole('button', { name: 'Need a start?' }).click()
  const dlg = page.getByRole('dialog')
  await expect(dlg).toBeVisible()
  await shot(page, '03-starter-empty', info)
  await dlg.getByRole('button', { name: 'Guilty' }).click()
  await expect(dlg.locator('.template__blank').first()).toBeVisible()
  await tapTargetsOk(page, '[role=dialog]')
  await shot(page, '04-starter-picked', info)
  await dlg.getByRole('button', { name: 'Use this' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByLabel('Your apology')).toHaveValue(/^I'm sorry for ___/)
  await expect(page.getByLabel('Your apology')).toBeFocused()
})

test('starter overlay: asks before replacing', async ({ page }, info) => {
  await page.getByLabel('Your apology').fill('Something already here.')
  await page.getByRole('button', { name: 'Need a start?' }).click()
  await page.getByRole('button', { name: 'Hurt' }).click()
  await page.getByRole('button', { name: 'Use this' }).click()
  await expect(page.getByText('You already wrote something.')).toBeVisible()
  await shot(page, '05-starter-confirm', info)
  await page.getByRole('button', { name: 'Add below it' }).click()
  await expect(page.getByLabel('Your apology')).toHaveValue(/Something already here\.\n\nI've been feeling/)
})

test('checklist -> pause -> copy', async ({ page }, info) => {
  await page.getByLabel('Your apology').fill(BAD)
  await page.getByRole('button', { name: 'Ready to send?' }).click()
  const dlg = page.getByRole('dialog', { name: 'Before you send' })
  await expect(dlg.getByText(/may cause trouble/)).toBeVisible()
  await expect(dlg.getByRole('button', { name: 'Continue' })).toBeDisabled()
  await shot(page, '06-checklist', info)
  for (const box of await dlg.getByRole('checkbox').all()) await box.check({ force: true })
  await expect(dlg.getByRole('button', { name: 'Continue' })).toBeEnabled()
  await shot(page, '07-checklist-ticked', info)
  await tapTargetsOk(page, '[role=dialog]')
  await dlg.getByRole('button', { name: 'Continue' }).click()

  const pause = page.getByRole('dialog', { name: 'One more thing' })
  await expect(pause.getByText('Read it out loud first.')).toBeVisible()
  await shot(page, '08-pause', info)
  await pause.getByRole('button', { name: /Copy message/ }).click()
  await expect(pause.getByText('Copied')).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(BAD)
  await shot(page, '09-pause-copied', info)
})

test('clear confirm', async ({ page }, info) => {
  await page.getByLabel('Your apology').fill('Hello there friend')
  await page.getByRole('button', { name: 'Clear', exact: true }).click()
  await expect(page.getByRole('dialog', { name: 'Clear your message?' })).toBeVisible()
  await shot(page, '10-clear-confirm', info)
  await page.getByRole('button', { name: 'Clear', exact: true }).last().click()
  await expect(page.getByLabel('Your apology')).toHaveValue('')
})

test('overlays close via Escape, backdrop and X; focus returns to the text box', async ({ page }) => {
  const ta = page.getByLabel('Your apology')
  await page.getByRole('button', { name: 'Need a start?' }).click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(ta).toBeFocused()

  await page.getByRole('button', { name: 'Need a start?' }).click()
  await page.getByRole('button', { name: 'Close' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)

  await page.getByRole('button', { name: 'Need a start?' }).click()
  await page.mouse.click(5, 5)
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('responsive layout: sheet on mobile, modal on desktop', async ({ page }, info) => {
  await page.getByRole('button', { name: 'Need a start?' }).click()
  const box = (await page.locator('.overlay__panel').boundingBox())!
  const vp = page.viewportSize()!
  if (info.project.name === 'mobile') {
    expect(box.width).toBeCloseTo(vp.width, 0) // full-width bottom sheet
    expect(box.y + box.height).toBeCloseTo(vp.height, 0)
  } else {
    expect(box.width).toBeLessThanOrEqual(480)
    expect(box.y).toBeGreaterThan(0) // centered, not docked
    expect(box.y + box.height).toBeLessThan(vp.height)
  }
})

test('nothing is stored or sent', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (r) => requests.push(r.url()))
  await page.getByLabel('Your apology').fill(BAD)
  await page.waitForTimeout(400)
  const stored = await page.evaluate(() => localStorage.length + sessionStorage.length)
  expect(stored).toBe(0)
  expect(requests.filter((u) => !u.startsWith('http://localhost') && !u.includes('fonts.g'))).toEqual([])
})
