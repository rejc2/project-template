import { Box } from '@mui/material';

interface AppLayoutProps {
	sidebar: React.ReactNode;
	children: React.ReactNode;
}

export default function AppLayout({ sidebar, children }: AppLayoutProps) {
	return (
		<Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
			<Box
				component="aside"
				sx={{
					width: 280,
					flexShrink: 0,
					borderRight: 1,
					borderColor: 'divider',
					overflowY: 'auto',
				}}
			>
				{sidebar}
			</Box>
			<Box component="main" sx={{ flex: 1, overflowY: 'auto' }}>
				{children}
			</Box>
		</Box>
	);
}
