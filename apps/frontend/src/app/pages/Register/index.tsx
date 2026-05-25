import React from 'react';
import { Helmet } from 'react-helmet-async';
import 'react-phone-input-2/lib/style.css';

import { RegisterForm } from './components/register-form';
import { RegisterHero } from './components/register-hero';
import { useRegisterForm } from './hooks/use-register-form';
import { useRegisterSlice } from './slice';

export function Register() {
  useRegisterSlice();
  const registerForm = useRegisterForm();

  return (
    <>
      <Helmet>
        <title>Registration</title>
        <meta name="description" content="Registration for Bus Journey" />
      </Helmet>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:-m-8 lg:min-h-[calc(100vh-70px)] lg:max-w-none lg:flex-row lg:items-stretch lg:gap-0">
        <RegisterHero />
        <RegisterForm {...registerForm} />
      </div>
    </>
  );
}
