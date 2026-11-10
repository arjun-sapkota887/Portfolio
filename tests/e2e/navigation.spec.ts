import { expect, test } from '@playwright/test';

test('nav opens a section panel and Escape returns to the overview', async ({ page }) => {
  await page.goto('/?static=1');
  await page
    .getByRole('navigation', { name: /solar system/i })
    .getByRole('button', { name: 'Projects' })
    .click();
  const panel = page.getByRole('region', { name: 'Projects' });
  await expect(panel).toBeVisible();
  await expect(page).toHaveURL(/#projects$/);

  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(page).not.toHaveURL(/#/);
});

test('deep link opens the contact panel', async ({ page }) => {
  await page.goto('/?static=1#contact');
  await expect(page.getByRole('region', { name: 'Contact' })).toBeVisible();
});
