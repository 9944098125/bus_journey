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

import { NotFound } from './pages/NotFound/loadable';
import { Login } from './pages/Login/loadable';
import { Dashboard } from './pages/Dashboard/loadable';
import { useTranslation } from 'react-i18next';
import { useGlobalSlice } from './slice';
import { RedirectIfAuth } from './components/auth/redirect-if-auth';
import { RequireAuth } from './components/auth/require-auth';
import Layout from './components/layout';
import { Toaster } from './components/ui/toaster';

export function App() {
  const { i18n } = useTranslation();
  useGlobalSlice();
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Helmet
          titleTemplate="%s - Bus Journey Admin"
          defaultTitle="Bus Journey Admin"
          htmlAttributes={{ lang: i18n.language }}
        >
          <meta name="description" content="Bus Journey Admin Panel" />
        </Helmet>
        <Routes>
          <Route element={<RedirectIfAuth />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
