import { Card, CardActionArea } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

import type { OpenLibrarySearchDoc } from '@/apis/open-library-search-api-types';

import SaveDocButton from '../../components/SaveDocButton';

interface SearchResultCardProps {
	doc: OpenLibrarySearchDoc;
}

export default function SearchResultCard({ doc }: SearchResultCardProps) {
	return (
		<Card sx={{ display: 'flex', alignItems: 'center' }}>
			<CardActionArea
				component={Link}
				to={`/doc/${encodeURIComponent(doc.key)}`}
				sx={{ flex: 1, p: 2 }}
			>
				<Typography variant="h4">{doc.title}</Typography>
				<Typography variant="body1">{doc.author_name?.join(', ')}</Typography>
			</CardActionArea>
			<SaveDocButton workKey={doc.key} />
		</Card>
	);
}
