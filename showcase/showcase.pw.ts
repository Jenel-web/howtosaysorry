import { expect, test, type Browser, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// Two steps, in order:
//   1. drive the REAL app through real user flows and save a screenshot of each state
//   2. lay those screenshots into the launch slides and render them to PNG
// Nothing here is mocked: every flag card in the images was produced by the checker.

const BAD = "I'm sorry you feel that way, but it's not my fault. You always push my buttons, and I didn't mean it that way."
const GOOD =
  "I'm sorry I snapped at you this morning. I raised my voice over the dishes, and I know it made you feel small. Next time I'll take a breath and walk away before I say something I can't take back."

const root = path.dirname(fileURLToPath(import.meta.url))
const shots = path.join(root, 'shots')
const out = path.join(root, 'out')

test.describe.configure({ mode: 'serial' })

// `height` lets a slide use a shorter (still real-sized) phone so the phones can be drawn larger.
async function open(browser: Browser, kind: 'desktop' | 'mobile', height?: number) {
  const context = await browser.newContext({
    // 1040 wide so the app fills the browser frames on the slides and text stays readable
    viewport: kind === 'desktop' ? { width: 1040, height: 800 } : { width: 390, height: height ?? 844 },
    deviceScaleFactor: 2,
    isMobile: kind === 'mobile',
    hasTouch: kind === 'mobile',
    reducedMotion: 'reduce', // resting state, never mid-animation
    permissions: ['clipboard-read', 'clipboard-write'],
  })
  const page = await context.newPage()
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  return { context, page }
}

const type = async (page: Page, text: string) => {
  await page.getByLabel('Your apology').fill(text)
  await page.waitForTimeout(500) // let the 300ms debounce settle
}

test('1. capture real states of the app', async ({ browser }) => {
  fs.mkdirSync(shots, { recursive: true })

  // ---- desktop ----
  {
    const { context, page } = await open(browser, 'desktop')

    await type(page, BAD)
    await expect(page.locator('.flag--strong').first()).toBeVisible()
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.screenshot({ path: path.join(shots, 'desk-bad.png'), fullPage: true })

    await type(page, GOOD)
    await expect(page.locator('.flag')).toHaveCount(0)
    await page.screenshot({ path: path.join(shots, 'desk-good.png'), fullPage: true })

    await page.getByLabel('Your apology').fill('')
    await page.getByRole('button', { name: 'Need a start?' }).click()
    const dlg = page.getByRole('dialog')
    await dlg.getByRole('button', { name: 'Hurt' }).click()
    await expect(dlg.locator('.template__blank').first()).toBeVisible()
    await page.screenshot({ path: path.join(shots, 'desk-starter.png') })

    await context.close()
  }

  // ---- mobile ----
  {
    const { context, page } = await open(browser, 'mobile')
    await type(page, BAD)
    await expect(page.locator('.flag--strong').first()).toBeVisible()
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.screenshot({ path: path.join(shots, 'mob-bad.png') })
    await context.close()
  }
  {
    const { context, page } = await open(browser, 'mobile', 720) // slide 3
    await page.getByRole('button', { name: 'Need a start?' }).click()
    const dlg = page.getByRole('dialog')
    await dlg.getByRole('button', { name: 'Guilty' }).click()
    await dlg.getByRole('button', { name: 'Use this' }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(page.getByLabel('Your apology')).toHaveValue(/^I'm sorry for ___/)
    await page.waitForTimeout(300)
    await page.screenshot({ path: path.join(shots, 'mob-template.png') })
    await context.close()
  }
  {
    const { context, page } = await open(browser, 'mobile', 680) // slide 4
    await type(page, BAD)
    await page.getByRole('button', { name: 'Ready to send?' }).click()
    await expect(page.getByRole('dialog', { name: 'Before you send' }).getByText(/may cause trouble/)).toBeVisible()
    await page.evaluate(() => window.scrollTo(0, 0)) // clicking "Ready to send?" scrolled the page; show it from the top
    await page.waitForTimeout(200)
    await page.screenshot({ path: path.join(shots, 'mob-checklist-warn.png') })
    await context.close()
  }
  {
    const { context, page } = await open(browser, 'mobile', 680) // slide 4
    await type(page, GOOD)
    await page.getByRole('button', { name: 'Ready to send?' }).click()
    const dlg = page.getByRole('dialog', { name: 'Before you send' })
    for (const box of await dlg.getByRole('checkbox').all()) await box.check({ force: true })
    await expect(dlg.getByRole('button', { name: 'Continue' })).toBeEnabled()
    await page.screenshot({ path: path.join(shots, 'mob-checklist-ticked.png') })

    await dlg.getByRole('button', { name: 'Continue' }).click()
    const pause = page.getByRole('dialog', { name: 'One more thing' })
    await pause.getByRole('button', { name: /Copy message/ }).click()
    await expect(pause.getByText('Copied')).toBeVisible()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(GOOD)
    await page.screenshot({ path: path.join(shots, 'mob-pause-copied.png') })
    await context.close()
  }
})

test('2. render the launch slides', async ({ browser }) => {
  fs.mkdirSync(out, { recursive: true })
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 })
  const page = await context.newPage()

  const slides = fs.readdirSync(path.join(root, 'slides')).filter((f) => /^\d\d-.*\.html$/.test(f)).sort()
  expect(slides.length).toBe(4)
  for (const file of slides) {
    await page.goto(pathToFileURL(path.join(root, 'slides', file)).href)
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => document.fonts.ready)
    await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0))
    await page.screenshot({ path: path.join(out, file.replace('.html', '.png')) })
  }
  await context.close()
})
