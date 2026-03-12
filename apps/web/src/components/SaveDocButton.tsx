import { Button } from '@mui/material';

import { useSavedDocs } from '@/state/SavedDocs';

interface SaveDocButtonProps {
	workKey: string;
}

export default function SaveDocButton({ workKey }: SaveDocButtonProps) {
	const save = useSavedDocs((s) => s.save);
	const remove = useSavedDocs((s) => s.remove);
	const isSaved = useSavedDocs((s) => s.isSaved(workKey));

	return (
		<Button
			variant={isSaved ? 'contained' : 'outlined'}
			size="small"
			sx={{ m: 2 }}
			onClick={() => (isSaved ? remove(workKey) : save(workKey))}
		>
			{isSaved ? 'Saved' : 'Save'}
		</Button>
	);
}
