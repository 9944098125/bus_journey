import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { App } from '../index';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'en',
    },
  }),
}));

jest.mock('../slice', () => ({
  useGlobalSlice: jest.fn(),
}));

jest.mock('../components/ui/toaster', () => ({
  Toaster: () => null,
}));

jest.mock('../components/layout', () => {
  const { Outlet } = require('react-router-dom');
  return { __esModule: true, default: () => <Outlet /> };
});

jest.mock('../components/auth/redirect-if-auth', () => {
  const { Outlet } = require('react-router-dom');
  return { RedirectIfAuth: () => <Outlet /> };
});

jest.mock('../components/auth/require-auth', () => {
  const { Outlet } = require('react-router-dom');
  return { RequireAuth: () => <Outlet /> };
});

jest.mock('../pages/Dashboard/loadable', () => ({
  Dashboard: () => <div data-testid="dashboard-page" />,
}));

jest.mock('../pages/Login/loadable', () => ({
  Login: () => <div data-testid="login-page" />,
}));

jest.mock('../pages/Operators/loadable', () => ({
  Operators: () => <div data-testid="operators-page" />,
}));

jest.mock('../pages/OperatorDetails/loadable', () => ({
  OperatorDetails: () => <div data-testid="operator-details-page" />,
}));

jest.mock('../pages/Buses/loadable', () => ({
  Buses: () => <div data-testid="buses-page" />,
}));

jest.mock('../pages/Routes/loadable', () => ({
  Routes: () => <div data-testid="routes-page" />,
}));

jest.mock('../pages/Journeys/loadable', () => ({
  Journeys: () => <div data-testid="journeys-page" />,
}));

jest.mock('../pages/NotFound/loadable', () => ({
  NotFound: () => <div data-testid="not-found-page" />,
}));

describe('<App />', () => {
  it('should render and match the snapshot', () => {
    const { asFragment } = render(
      <HelmetProvider>
        <App />
      </HelmetProvider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
