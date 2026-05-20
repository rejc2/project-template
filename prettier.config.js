export default {
	printWidth: 100,
	singleQuote: true,
	tabWidth: 3,
	useTabs: true,

	plugins: [
		await import('@rejc2/prettier-plugin-caddyfile'),
		await import('@trivago/prettier-plugin-sort-imports'),
		await import('prettier-plugin-nginx'),
		await import('prettier-plugin-prisma'),
	],
	alignDirectives: false,
	importOrder: ['<THIRD_PARTY_MODULES>', '^@/', '^[./]'],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,

	overrides: [
		{
			files: '**/package.json',
			options: {
				useTabs: false,
				tabWidth: 2,
				singleQuote: false,
			},
		},
		{
			files: '**/*.prisma',
			options: {
				useTabs: false,
				tabWidth: 2,
			},
		},
		{
			files: '**/*.y{,a}ml',
			options: {
				singleQuote: false,
				tabWidth: 2,
				useTabs: false,
			},
		},
	],
};
