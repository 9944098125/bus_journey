import React from 'react';
import type { CountryData } from 'react-phone-input-2';

import type { useLoginForm } from '../hooks/use-login-form';
import { LoginEmailField } from './login-email-field';
import { LoginFormHeader } from './login-form-header';
import { LoginMethodToggle } from './login-method-toggle';
import { LoginPasswordField } from './login-password-field';
import { LoginPhoneField } from './login-phone-field';
import { LoginRememberMeField } from './login-remember-me-field';
import { LoginSubmitSection } from './login-submit-section';

type LoginFormProps = ReturnType<typeof useLoginForm>;

export function LoginForm({
  form,
  showPassword,
  setShowPassword,
  phoneCountry,
  setPhoneCountry,
  isBusy,
  onSubmit,
  activationStatus,
  showActivationForm,
  isVerifyingLink,
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
      <div className="rounded-3xl border border-[#90e0ef] bg-white/95 p-6 shadow-xl shadow-[#0077b6]/12 backdrop-blur-sm sm:p-8 md:p-10 lg:flex lg:min-h-full lg:flex-1 lg:flex-col lg:justify-center lg:overflow-y-auto lg:rounded-2xl lg:border lg:border-[#90e0ef] lg:shadow-lg lg:p-10 xl:p-14">
        <LoginFormHeader />

        {isVerifyingLink && (
          <p className="mb-6 rounded-xl border border-[#90e0ef] bg-[#e8f6fc] px-4 py-3 text-sm text-[#023047]">
            Activating your account from the email link…
          </p>
        )}

        {activationStatus === 'already_active' && (
          <p className="mb-6 rounded-xl border border-[#90e0ef] bg-[#e8f6fc] px-4 py-3 text-sm text-[#023047]">
            Your account is already active. Sign in with your password below.
          </p>
        )}

        {activationStatus === 'failed' && (
          <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Activation link is invalid or expired. Request a new link or contact
            support.
          </p>
        )}

        {showActivationForm && (
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
        )}
      </div>
    </section>
  );
}
