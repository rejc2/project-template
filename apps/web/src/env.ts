const apiHost = import.meta.env['VITE_API_HOST'];
const apiUrl = import.meta.env['VITE_API_URL'] ?? (apiHost ? `https://${apiHost}` : '');

export const env = {
	apiUrl,
};
