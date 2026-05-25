import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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

export function useLoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [phoneCountry, setPhoneCountry] = useState<CountryData>(
    DEFAULT_PHONE_COUNTRY,
  );

  const { useLoginMutation } = useGlobalSlice();
  const [
    loginUser,
    {
      isLoading: isLoggingIn,
      isSuccess: isLoggedIn,
      isError: isLoginError,
      error: loginError,
    },
  ] = useLoginMutation();

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

    toast({
      variant: 'destructive',
      title: 'Login failed',
      description: getErrorMessage(
        loginError,
        'Invalid credentials. Please try again.',
      ),
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

  const isBusy = form.formState.isSubmitting || isLoggingIn;

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
  };
}
