import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle(/Drumpulse/);
});

test('home page loads', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('body')).toBeVisible();
});
