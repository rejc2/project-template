import nullthrows from 'nullthrows';

const localeRegex = /^\.\.\/locale-data\/([-a-zA-Z0-9]+)\/messages.po$/;

const localeImports = import.meta.glob('../locale-data/*/messages.po');

export const availableLocales = Object.keys(localeImports).map(
	(filePath) => nullthrows(filePath.match(localeRegex))[1],
);
