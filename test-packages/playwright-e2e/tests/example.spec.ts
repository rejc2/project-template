import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle(/projecttemplate/);
});

test('home page loads', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('body')).toBeVisible();
});
