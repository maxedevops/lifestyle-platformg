import { test, expect } from '@playwright/test';

test('User can register and see trust badge', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Mock WebAuthn (Playwright Virtual Authenticator)
  await page.addInitScript(() => {
    // Virtual Authenticator logic here
  });

  await page.click('button:has-text("Register with Passkey")');
  await page.fill('input[placeholder="your_username"]', 'test_user_alpha');
  
  // Wait for the Trust Badge to appear on the dashboard
  await expect(page.locator('text=Reputation: 50')).toBeVisible();
});