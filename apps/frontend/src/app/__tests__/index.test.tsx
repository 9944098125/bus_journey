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

jest.mock('../pages/Home/loadable', () => ({
  Home: () => <div data-testid="home-page" />,
}));

jest.mock('../pages/Login/loadable', () => ({
  Login: () => <div data-testid="login-page" />,
}));

jest.mock('../pages/Register/loadable', () => ({
  Register: () => <div data-testid="register-page" />,
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
