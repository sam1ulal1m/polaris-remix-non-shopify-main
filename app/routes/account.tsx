import { Outlet } from 'react-router';
import AppFrame from '~/components/AppFrame';

export default function Account() {
  return (
    <AppFrame>
      <Outlet />
    </AppFrame>
  );
}
