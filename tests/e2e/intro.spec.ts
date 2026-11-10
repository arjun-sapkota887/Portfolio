import { expect, test } from '@playwright/test';

test('galaxy intro leads into the solar system', async ({ page }) => {
  await page.goto('/?static=1');
  const intro = page.getByRole('dialog', { name: /welcome/i });
  await expect(intro).toBeVisible();
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(500);
  await expect(page).toHaveScreenshot('galaxy.png', { maxDiffPixelRatio: 0.03 });

  await intro.getByRole('button', { name: /enter/i }).click();
  await expect(intro).toBeHidden();
  await expect(page.getByRole('navigation', { name: /solar system/i })).toBeVisible();
});
