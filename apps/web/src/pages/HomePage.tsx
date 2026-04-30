import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';
import { Box, Button, Link as MuiLink, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';

export function HomePage() {
	return (
		<Box display="flex" flexDirection="column" p={3} gap={2}>
			<Typography variant="h1">
				<Trans context="heading">Home</Trans>
			</Typography>
			<Box display="flex" gap={1}>
				<Button onClick={() => i18n.activate('en-GB')}>English (UK)</Button>
				<Button onClick={() => i18n.activate('de-DE')}>Deutsch</Button>
				<Button onClick={() => i18n.activate('zh-Hant-TW')}>整體中文</Button>
			</Box>
			<Box>
				<MuiLink component={RouterLink} to={'/books-example'}>
					<Trans context="link">Books Example</Trans>
				</MuiLink>
			</Box>
		</Box>
	);
}
