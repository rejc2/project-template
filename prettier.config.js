export default {
	printWidth: 100,
	singleQuote: true,
	tabWidth: 3,
	useTabs: true,
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
			files: '**/*.y{,a}ml',
			options: {
				useTabs: false,
				tabWidth: 2,
			},
		},
	],
};
