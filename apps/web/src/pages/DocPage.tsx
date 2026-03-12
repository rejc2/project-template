import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';

import { useAuthors, useWork } from '@/apis/open-library-api';
import SaveDocButton from '@/components/SaveDocButton';

export default function DocPage() {
	const { id } = useParams<{ id: string }>();
	const workKey = decodeURIComponent(id!);

	const { data: work, isPending, isError } = useWork(workKey);
	const authorKeys = work?.authors?.map((a) => a.author.key) ?? [];
	const authorQueries = useAuthors(authorKeys);

	if (isPending) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (isError) {
		return (
			<Box sx={{ p: 4 }}>
				<Typography color="error">Failed to load work.</Typography>
			</Box>
		);
	}

	const authorNames = authorQueries
		.map((q) => q.data?.name)
		.filter((name): name is string => name != null);

	const description =
		work.description == null
			? null
			: typeof work.description === 'string'
				? work.description
				: work.description.value;

	return (
		<Box sx={{ p: 4, maxWidth: 720 }}>
			<Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
				<Typography variant="h4" gutterBottom>
					{work.title}
				</Typography>
				<SaveDocButton workKey={workKey} />
			</Box>
			{authorNames.length > 0 && (
				<Typography variant="subtitle1" color="text.secondary" gutterBottom>
					{authorNames.join(', ')}
				</Typography>
			)}
			{description && (
				<Typography variant="body1" sx={{ mt: 2, whiteSpace: 'pre-line' }}>
					{description}
				</Typography>
			)}
		</Box>
	);
}
