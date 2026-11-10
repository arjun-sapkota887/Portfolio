import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const seriousViolations = async (page: Page) => {
  const { violations } = await new AxeBuilder({ page }).analyze();
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
};

test('intro has no serious accessibility violations', async ({ page }) => {
  await page.goto('/?static=1');
  await expect(page.getByRole('dialog', { name: /welcome/i })).toBeVisible();
  expect(await seriousViolations(page)).toEqual([]);
});

test('overview and open panel have no serious accessibility violations', async ({ page }) => {
  await page.goto('/?static=1');
  await page.getByRole('button', { name: /skip intro/i }).click();
  expect(await seriousViolations(page)).toEqual([]);
  await page.getByRole('button', { name: 'Projects' }).click();
  await expect(page.getByRole('region', { name: 'Projects' })).toBeVisible();
  expect(await seriousViolations(page)).toEqual([]);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('Enter goes straight to the solar system', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /enter/i }).click();
    await expect(page.getByRole('navigation', { name: /solar system/i })).toBeVisible({
      timeout: 500,
    });
  });
});

test('nav and open panel do not overlap', async ({ page }) => {
  await page.goto('/?static=1#skills');
  const nav = await page.getByRole('navigation', { name: /solar system/i }).boundingBox();
  const panel = await page.getByRole('region', { name: 'Skills' }).boundingBox();
  const overlaps =
    nav!.x < panel!.x + panel!.width &&
    panel!.x < nav!.x + nav!.width &&
    nav!.y < panel!.y + panel!.height &&
    panel!.y < nav!.y + nav!.height;
  expect(overlaps).toBe(false);
});

test('falls back to a readable page without WebGL', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...rest: unknown[]
    ) {
      if (type.startsWith('webgl')) return null;
      return original.call(this, type, ...(rest as []));
    } as typeof original;
  });
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: /sections/i })).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
});
