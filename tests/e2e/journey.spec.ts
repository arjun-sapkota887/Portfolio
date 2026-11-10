import { expect, test } from '@playwright/test';

const sections = ['About', 'Skills', 'Projects', 'Experience', 'Contact'];

test('full journey: galaxy dive, every section, keyboard and browser history', async ({ page }) => {
  await page.goto('/');

  // Galaxy intro → animated dive into the solar system.
  await page.getByRole('button', { name: /enter the system/i }).click();
  const nav = page.getByRole('navigation', { name: /solar system/i });
  await expect(nav).toBeVisible({ timeout: 5000 });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  // Every section opens its panel from the nav.
  for (const name of sections) {
    await nav.getByRole('button', { name }).click();
    await expect(page.getByRole('region', { name })).toBeVisible();
    await expect(nav.getByRole('button', { name })).toHaveAttribute('aria-current', 'true');
  }

  // Arrow keys cycle (wrapping from Contact to About).
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('region', { name: 'About' })).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('region', { name: 'Contact' })).toBeVisible();

  // Browser back walks the section history.
  await page.goBack();
  await expect(page.getByRole('region', { name: 'About' })).toBeVisible();

  // The panel's close button returns to the overview.
  await page.getByRole('button', { name: /back to overview/i }).click();
  await expect(page.getByRole('region')).toHaveCount(0);
  await expect(page).not.toHaveURL(/#/);
});

test('external project links open safely in a new tab', async ({ page }) => {
  await page.goto('/#projects');
  const links = page.getByRole('region', { name: 'Projects' }).getByRole('link');
  await expect(links.first()).toBeVisible();
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
    await expect(link).toHaveAttribute('href', /^https:\/\//);
  }
});
