import { expect, test } from '@playwright/test';

test('renders the solar system canvas filling the viewport', async ({ page }) => {
  await page.goto('/?static=1');
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
  const viewport = page.viewportSize()!;
  await expect
    .poll(async () => (await canvas.boundingBox())?.width ?? 0)
    .toBeGreaterThanOrEqual(viewport.width - 1);
});

test('static scene matches the visual baseline', async ({ page }) => {
  await page.goto('/?static=1');
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(500);
  await expect(page).toHaveScreenshot('solar-system.png', { maxDiffPixelRatio: 0.03 });
});
