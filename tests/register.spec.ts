import { test, expect } from '@playwright/test';
test('Register page loads correctly', async ({ page }) => {
  await page.goto('/#/auth/register');

  await expect(
    page.locator('[data-test="email"], input[type="email"]').first()
  ).toBeVisible();
});
