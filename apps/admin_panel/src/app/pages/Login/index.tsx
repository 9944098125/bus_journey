import React from 'react';
import { Helmet } from 'react-helmet-async';
import 'react-phone-input-2/lib/style.css';

import { LoginForm } from './components/LoginForm';
import { LoginHero } from './components/LoginHero';
import { useLoginForm } from './hooks/useLoginForm';
import { useGlobalSlice } from 'app/slice';

export function Login() {
  useGlobalSlice();
  const loginForm = useLoginForm();

  return (
    <>
      <Helmet>
        <title>Admin Login</title>
        <meta name="description" content="Sign in to Bus Journey Admin Panel" />
      </Helmet>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:max-w-6xl lg:flex-row lg:items-stretch lg:gap-0 lg:py-10">
        <LoginHero />
        <LoginForm {...loginForm} />
      </div>
    </>
  );
}
