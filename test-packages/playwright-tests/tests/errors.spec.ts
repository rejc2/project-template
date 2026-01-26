import { test, expect } from '@playwright/test';

test.describe('error pages', () => {
	test('shows 404 for bad route', async ({ page }) => {
		await page.goto('/nonexistent-route');
		await expect(page.getByRole('heading', { name: /404 Not Found/i })).toBeVisible();
	});

	test('shows error page when render error occurs', async ({ page }) => {
		await page.goto('/test-error');
		await expect(page.getByRole('heading', { name: /Something went wrong/i })).toBeVisible();
		await expect(page.getByText('Test error')).toBeVisible();
	});
});
