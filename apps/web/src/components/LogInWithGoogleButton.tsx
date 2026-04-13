import { Button, Card } from '@mui/material';

import { authClient } from '@/auth/authClient';

// Your configured client

export default function LogInWithGoogleButton() {
	const { data: session, isPending, error } = authClient.useSession();

	const handleGoogleLogin = async () => {
		await authClient.signIn.social({
			provider: 'google',
			callbackURL: '/dashboard', // Where to go after success
		});
	};

	if (isPending) return <p>Checking session...</p>;
	if (error) return <p>Error: {error.message}</p>;

	if (session) {
		return <Card>Logged in as {session.user.name}</Card>;
	}

	return <Button onClick={handleGoogleLogin}>Sign in with Google</Button>;
}
