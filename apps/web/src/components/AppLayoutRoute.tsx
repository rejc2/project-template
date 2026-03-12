import { Outlet } from 'react-router-dom';

import AppLayout from './AppLayout';
import SideBar from './Sidebar';

export default function AppLayoutRoute() {
	return (
		<AppLayout sidebar={<SideBar />}>
			<Outlet />
		</AppLayout>
	);
}
