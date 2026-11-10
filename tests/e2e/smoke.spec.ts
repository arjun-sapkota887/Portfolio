import { expect, test } from '@playwright/test';

test('home page shows the owner heading', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /skip intro/i }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your Name');
});
