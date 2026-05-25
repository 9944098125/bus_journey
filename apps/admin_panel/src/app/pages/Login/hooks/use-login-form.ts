import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { CountryData } from 'react-phone-input-2';

import { toast } from 'app/components/ui/use-toast';
import { useGlobalSlice } from 'app/slice';
import type { LoginFormValues, LoginMutationArg } from 'types/user';

import { getErrorMessage } from 'utils/errors';
import { parsePhoneFields } from 'utils/phone';

const DEFAULT_PHONE_COUNTRY: CountryData = {
  name: 'India',
  dialCode: '91',
  countryCode: 'in',
  format: '+.. .....-.....',
};

export type ActivationStatus =
  | 'idle'
  | 'activating'
  | 'activated'
  | 'already_active'
  | 'failed';

export function useLoginForm() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activationAttempted = useRef(false);
  const [activationStatus, setActivationStatus] =
    useState<ActivationStatus>('idle');

  const [showPassword, setShowPassword] = useState(false);
  const [phoneCountry, setPhoneCountry] = useState<CountryData>(
    DEFAULT_PHONE_COUNTRY,
  );

  const { useLoginMutation, useVerifyFirstLoginMutation } = useGlobalSlice();
  const [
    loginUser,
    {
      isLoading: isLoggingIn,
      isSuccess: isLoggedIn,
      isError: isLoginError,
      error: loginError,
    },
  ] = useLoginMutation();

  const [
    verifyFirstLogin,
    {
      isLoading: isVerifyingLink,
      isSuccess: isActivated,
      isError: isActivationError,
      error: activationError,
    },
  ] = useVerifyFirstLoginMutation();

  const activationToken = searchParams.get('token')?.trim() || null;

  useEffect(() => {
    if (!activationToken || activationAttempted.current) {
      return;
    }

    activationAttempted.current = true;
    setActivationStatus('activating');
    verifyFirstLogin(activationToken);
  }, [activationToken, verifyFirstLogin]);

  const clearActivationTokenFromUrl = () => {
    if (!searchParams.has('token')) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('token');
    setSearchParams(nextParams, { replace: true });
  };

  useEffect(() => {
    if (!isActivated) {
      return;
    }

    setActivationStatus('activated');
    clearActivationTokenFromUrl();

    toast({
      title: 'Account activated!',
      description: 'You are signed in. You can use this page to log in next time.',
    });
    navigate('/');
  }, [isActivated, navigate, searchParams, setSearchParams]);

  useEffect(() => {
    if (!isActivationError || !activationError) {
      return;
    }

    const message = getErrorMessage(
      activationError,
      'Activation link is invalid or expired.',
    );

    const alreadyActive = message
      .toLowerCase()
      .includes('already activated');

    setActivationStatus(alreadyActive ? 'already_active' : 'failed');
    clearActivationTokenFromUrl();

    toast({
      variant: alreadyActive ? 'default' : 'destructive',
      title: alreadyActive ? 'Account already active' : 'Activation failed',
      description: alreadyActive
        ? 'Sign in below with your email or phone and password.'
        : message,
    });
  }, [isActivationError, activationError, searchParams, setSearchParams]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    toast({
      title: 'Welcome back!',
      description: 'You have logged in successfully.',
    });
    navigate('/');
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (!isLoginError || !loginError) {
      return;
    }

    const message = getErrorMessage(
      loginError,
      'Invalid credentials. Please try again.',
    );

    toast({
      variant: 'destructive',
      title: 'Login failed',
      description: message,
    });
  }, [isLoginError, loginError]);

  const form = useForm<LoginFormValues>({
    defaultValues: {
      loginMethod: 'email',
      email: '',
      phone: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onBlur',
  });

  const isBusy =
    form.formState.isSubmitting || isLoggingIn || isVerifyingLink;

  const showActivationForm =
    !activationToken ||
    activationStatus === 'failed' ||
    activationStatus === 'already_active';

  const onSubmit = async (values: LoginFormValues) => {
    let payload: LoginMutationArg;

    if (values.loginMethod === 'email') {
      payload = {
        email: values.email.trim().toLowerCase(),
        password: values.password,
        rememberMe: values.rememberMe,
      };
    } else {
      const parsed = parsePhoneFields(values.phone, phoneCountry);

      if (!parsed.phone_number || parsed.phone_number.length < 6) {
        form.setError('phone', {
          type: 'validate',
          message: 'Enter a valid phone number',
        });
        return;
      }

      payload = {
        phone_number: parsed.phone_number,
        password: values.password,
        rememberMe: values.rememberMe,
      };
    }

    loginUser(payload);
  };

  return {
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
  };
}
