import { expect, test } from '@playwright/test';

test.describe('books example page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/books-example');
	});

	test('shows heading', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Books' })).toBeVisible();
	});

	test('shows initial list of books', async ({ page }) => {
		const items = page.getByRole('listitem');
		await expect(items.first()).toBeVisible();
		const count = await items.count();
		expect(count).toBeGreaterThan(0);
		// Each item has a title (letters) and an author
		for (let i = 0; i < count; i++) {
			await expect(items.nth(i)).toContainText(/[a-zA-Z]/);
		}
	});

	test('shows load more button when more books are available', async ({ page }) => {
		await expect(page.getByRole('button', { name: 'Load more' })).toBeVisible();
	});

	test('loads more books when load more is clicked', async ({ page }) => {
		const items = page.getByRole('listitem');
		await expect(items.first()).toBeVisible();
		const initialCount = await items.count();

		await page.getByRole('button', { name: 'Load more' }).click();
		await expect(items).toHaveCount(initialCount * 2);
	});

	// Only reenable this with e.g. a search:
	// test('hides load more button when all books are loaded', async ({ page }) => {
	// 	const loadMore = page.getByRole('button', { name: 'Load more' });
	// 	await expect(loadMore).toBeVisible();

	// 	while (await loadMore.isVisible()) {
	// 		await loadMore.click();
	// 		await expect(loadMore).not.toHaveAttribute('loading');
	// 	}

	// 	await expect(loadMore).not.toBeVisible();
	// });
});
