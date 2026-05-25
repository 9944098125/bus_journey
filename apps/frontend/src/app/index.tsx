/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import { GlobalStyle } from 'styles/global-styles';

import { NotFound } from './pages/NotFound/loadable';
import { Home } from './pages/Home/loadable';
import { Login } from './pages/Login/loadable';
import { Register } from './pages/Register/loadable';
import { useTranslation } from 'react-i18next';
import { useGlobalSlice } from './slice';
import { RedirectIfAuth } from './components/auth/redirect-if-auth';
import { RequireAuth } from './components/auth/require-auth';
import Layout from './components/layout';
import { sidebarProtectedHrefs } from './components/layout/sidebar/sidebar-routes';
import { Toaster } from './components/ui/toaster';

export function App() {
  const { i18n } = useTranslation();
  useGlobalSlice();
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Helmet
          titleTemplate="%s - Bus Journey App"
          defaultTitle="Bus Journey App"
          htmlAttributes={{ lang: i18n.language }}
        >
          <meta name="description" content="Bus Journey App" />
        </Helmet>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<RedirectIfAuth />}>
            <Route element={<Layout />}>
              <Route path="/login" element={<Login />} />
            </Route>
          </Route>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route element={<RequireAuth />}>
              {sidebarProtectedHrefs.map(href => (
                <Route key={href} path={href} element={<NotFound />} />
              ))}
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
