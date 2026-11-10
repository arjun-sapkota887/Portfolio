import { expect, test } from '@playwright/test';

test('renders the solar system canvas', async ({ page }) => {
  await page.goto('/?static=1');
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
  const box = await canvas.boundingBox();
  expect(box!.width).toBeGreaterThan(300);
});

test('static scene matches the visual baseline', async ({ page }) => {
  await page.goto('/?static=1');
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(500);
  await expect(page).toHaveScreenshot('solar-system.png', { maxDiffPixelRatio: 0.03 });
});
