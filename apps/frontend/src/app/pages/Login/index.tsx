import React from 'react';
import { Helmet } from 'react-helmet-async';
import 'react-phone-input-2/lib/style.css';

import { LoginForm } from './components/login-form';
import { LoginHero } from './components/login-hero';
import { useLoginForm } from './hooks/use-login-form';
import { useGlobalSlice } from 'app/slice';

export function Login() {
  useGlobalSlice();
  const loginForm = useLoginForm();

  return (
    <>
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Login to Bus Journey" />
      </Helmet>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:-m-8 lg:min-h-[calc(100vh-70px)] lg:max-w-none lg:flex-row lg:items-stretch lg:gap-0">
        <LoginHero />
        <LoginForm {...loginForm} />
      </div>
    </>
  );
}
