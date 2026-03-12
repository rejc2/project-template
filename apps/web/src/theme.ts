import { createTheme } from '@mui/material';

export const theme = createTheme({
	components: {
		MuiButton: {
			styleOverrides: {
				root: { textTransform: 'none' },
			},
		},
	},
	palette: {
		primary: {
			// MUI default:
			main: '#1976d2',
		},
	},
	shape: {},
	typography: {
		fontFamily: '"Open Sans", sans-serif',
	},
});
