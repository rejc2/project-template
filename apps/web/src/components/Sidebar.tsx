import {
	Box,
	Button,
	CircularProgress,
	List,
	ListItem,
	ListItemText,
	Typography,
} from '@mui/material';
import { Link, useMatch } from 'react-router-dom';

import { useAuthors, useWork } from '../apis/open-library-api';
import { useSavedDocs } from '../state/SavedDocs';

interface SavedWorkItemProps {
	workKey: string;
}

function SavedWorkItem({ workKey }: SavedWorkItemProps) {
	const match = useMatch('/doc/:id');
	const isActive = match != null && match.params.id === workKey;

	const { data: work, isPending, isError } = useWork(workKey);
	const authorKeys = work?.authors?.map((a) => a.author.key) ?? [];
	const authorQueries = useAuthors(authorKeys);

	if (isPending) return <CircularProgress size={16} sx={{ m: 1 }} />;
	if (isError)
		return (
			<ListItem>
				<ListItemText primary="Failed to load" secondary={workKey} />
			</ListItem>
		);

	const authorNames = authorQueries
		.map((q) => q.data?.name)
		.filter((name): name is string => name != null);

	return (
		<ListItem
			disablePadding
			component={Link}
			to={`/doc/${encodeURIComponent(workKey)}`}
			sx={{
				px: 2,
				py: 0.5,
				color: 'inherit',
				textDecoration: 'none',
				bgcolor: isActive ? 'action.selected' : undefined,
			}}
		>
			<ListItemText
				primary={work.title}
				secondary={authorNames.length > 0 ? authorNames.join(', ') : undefined}
				slotProps={{
					primary: { variant: 'body2', noWrap: true },
					secondary: { variant: 'caption', noWrap: true },
				}}
			/>
		</ListItem>
	);
}

export default function SideBar() {
	const savedKeys = useSavedDocs((s) => s.savedKeys);

	return (
		<Box sx={{ p: 1 }}>
			<Button
				component={Link}
				to="/search"
				fullWidth
				sx={{ justifyContent: 'flex-start', mb: 1 }}
			>
				Search
			</Button>
			<Typography variant="overline" sx={{ px: 1 }}>
				Saved Works
			</Typography>
			{savedKeys.length === 0 ? (
				<Typography variant="body2" color="text.secondary" sx={{ px: 1, mt: 1 }}>
					No saved works yet.
				</Typography>
			) : (
				<List dense disablePadding>
					{savedKeys.map((key) => (
						<SavedWorkItem key={key} workKey={key} />
					))}
				</List>
			)}
		</Box>
	);
}
