import eslint from '@eslint/js';
import type { Linter } from 'eslint';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

/**
 * Shared ESLint configuration for TypeScript and React projects.
 */
export function getConfig({
	tsconfigRootDir,
	includeReact = false,
	ignores = [],
}: {
	tsconfigRootDir: string;
	includeReact?: boolean;
	ignores?: string[];
}): Linter.Config[] {
	return [
		eslint.configs.recommended,
		...tseslint.configs.recommended,
		{
			files: ['**/*.{ts,tsx}'],
			plugins: {
				import: importPlugin,
				...(includeReact && {
					react: reactPlugin,
					'react-hooks': reactHooksPlugin,
				}),
			},
			languageOptions: {
				parserOptions: {
					tsconfigRootDir,
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
			settings: {
				react: {
					version: 'detect',
				},
			},
			rules: {
				...(includeReact && {
					// React rules
					...reactPlugin.configs.recommended.rules,
					...reactPlugin.configs['jsx-runtime'].rules,

					// React Hooks rules
					'react-hooks/rules-of-hooks': 'error',
					'react-hooks/exhaustive-deps': 'error',
				}),

				// TypeScript rules
				'@typescript-eslint/no-unused-vars': [
					'warn',
					{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
				],
				'@typescript-eslint/consistent-type-imports': 'warn',

				'import/no-extraneous-dependencies': 'warn',
			},
		},
		{
			ignores: [
				'**/node_modules/**',
				'**/build/**',
				'**/dist/**',
				'**/generated/**',
				'**/playwright-report/**',
				'**/test-results/**',
				...ignores,
			],
		},
	];
}
