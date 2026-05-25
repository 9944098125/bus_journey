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

import { NotFound } from './pages/NotFound/Loadable';
import { Login } from './pages/Login/Loadable';
import { Register } from './pages/Register/Loadable';
import { useTranslation } from 'react-i18next';
import { useGlobalSlice } from './slice';
import { RedirectIfAuth } from './components/auth/RedirectIfAuth';
import { RequireAuth } from './components/auth/RequireAuth';
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
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
