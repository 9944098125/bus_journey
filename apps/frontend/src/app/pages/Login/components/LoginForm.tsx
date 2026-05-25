import React from 'react';
import type { CountryData } from 'react-phone-input-2';

import type { useLoginForm } from '../hooks/useLoginForm';
import { LoginEmailField } from './LoginEmailField';
import { LoginFormHeader } from './LoginFormHeader';
import { LoginMethodToggle } from './LoginMethodToggle';
import { LoginPasswordField } from './LoginPasswordField';
import { LoginPhoneField } from './LoginPhoneField';
import { LoginRememberMeField } from './LoginRememberMeField';
import { LoginSubmitSection } from './LoginSubmitSection';

type LoginFormProps = ReturnType<typeof useLoginForm>;

export function LoginForm({
  form,
  showPassword,
  setShowPassword,
  phoneCountry,
  setPhoneCountry,
  isBusy,
  onSubmit,
}: LoginFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = form;

  const loginMethod = watch('loginMethod');

  const handleMethodChange = (method: 'email' | 'phone') => {
    setValue('loginMethod', method);
    clearErrors(['email', 'phone']);
  };

  const handleCountryChange = (country: CountryData) => {
    setPhoneCountry(country);
  };

  return (
    <section className="flex-1 lg:flex lg:min-h-full lg:min-w-0 lg:flex-col">
      <div className="rounded-3xl border border-[#e8d4d6] bg-white/90 p-6 shadow-xl shadow-[#722f37]/10 backdrop-blur-sm sm:p-8 md:p-10 lg:flex lg:min-h-full lg:flex-1 lg:flex-col lg:justify-center lg:overflow-y-auto lg:rounded-none lg:border-0 lg:border-l lg:border-l-[#e8d4d6] lg:shadow-none lg:p-10 xl:p-14">
        <LoginFormHeader />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <LoginMethodToggle
            value={loginMethod}
            onChange={handleMethodChange}
          />

          {loginMethod === 'email' ? (
            <LoginEmailField
              register={register}
              errors={errors}
              isActive
            />
          ) : (
            <LoginPhoneField
              control={control}
              errors={errors}
              isActive
              onCountryChange={handleCountryChange}
            />
          )}

          <LoginPasswordField
            register={register}
            errors={errors}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(prev => !prev)}
          />

          <LoginRememberMeField register={register} />

          <LoginSubmitSection isBusy={isBusy} />
        </form>
      </div>
    </section>
  );
}
