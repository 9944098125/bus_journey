import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useGlobalSlice } from 'app/slice';
import { selectToken, selectUser } from 'app/slice/selectors';
import { hasStoredAuth } from 'utils/authStorage';

export function RequireAuth() {
  useGlobalSlice();
  const location = useLocation();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const isAuthenticated = Boolean(user && token) && hasStoredAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
