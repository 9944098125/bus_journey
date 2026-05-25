import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { CountryData } from 'react-phone-input-2';

import { toast } from 'app/components/ui/use-toast';
import { useRegisterSlice } from '../slice';
import type { RegisterFormValues, RegisterPayload } from 'types/user';

import { getErrorMessage } from 'utils/errors';
import { parsePhoneFields } from 'utils/phone';

import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '../components/constants';

const DEFAULT_PHONE_COUNTRY: CountryData = {
  name: 'India',
  dialCode: '91',
  countryCode: 'in',
  format: '+.. .....-.....',
};

export function useRegisterForm() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null,
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const uploadSeqRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [phoneCountry, setPhoneCountry] = useState<CountryData>(
    DEFAULT_PHONE_COUNTRY,
  );

  const { useRegisterMutation, useUploadProfilePictureMutation } =
    useRegisterSlice();

  const [
    registerUser,
    {
      isLoading: isRegistering,
      isSuccess: isRegistered,
      isError: isRegistrationError,
      error: registrationError,
    },
  ] = useRegisterMutation();
  const [
    uploadProfilePicture,
    { isLoading: isUploading, isError: isUploadError, error: uploadError },
  ] = useUploadProfilePictureMutation();

  useEffect(() => {
    if (!isRegistered) {
      return;
    }

    toast({
      title: 'Welcome aboard!',
      description:
        'Check your email for the activation link. After that, you can sign in here with your password.',
    });
    navigate('/login');
  }, [isRegistered, navigate]);

  useEffect(() => {
    if (!isRegistrationError || !registrationError) {
      return;
    }

    toast({
      variant: 'destructive',
      title: 'Registration failed',
      description: getErrorMessage(
        registrationError,
        'Registration failed. Please try again.',
      ),
    });
  }, [isRegistrationError, registrationError]);

  useEffect(() => {
    if (!isUploadError || !uploadError) {
      return;
    }

    toast({
      variant: 'destructive',
      title: 'Upload failed',
      description: getErrorMessage(
        uploadError,
        'Failed to upload profile picture. Please try again.',
      ),
    });
  }, [isUploadError, uploadError]);

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const revokePreview = useCallback((url: string | null) => {
    if (url) {
      URL.revokeObjectURL(url);
    }
  }, []);

  const applyImageFile = useCallback(
    async (file: File | undefined) => {
      if (!file) {
        return;
      }

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setImageError('Use JPG, PNG, WebP, or GIF');
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setImageError('Image must be under 5 MB');
        return;
      }

      const uploadSeq = ++uploadSeqRef.current;

      setImageError(null);
      setProfilePictureUrl(null);
      setSelectedImage(file);
      setPreviewUrl(prev => {
        revokePreview(prev);
        return URL.createObjectURL(file);
      });

      try {
        const uploadResult = await uploadProfilePicture(file).unwrap();

        if (uploadSeq !== uploadSeqRef.current) {
          return;
        }

        const imageUrl = uploadResult.imageUrl;

        if (!imageUrl) {
          setImageError('Failed to upload profile picture');
          return;
        }

        setProfilePictureUrl(imageUrl);
      } catch {
        if (uploadSeq !== uploadSeqRef.current) {
          return;
        }

        setImageError('Failed to upload profile picture');
      }
    },
    [revokePreview, uploadProfilePicture],
  );

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyImageFile(event.target.files?.[0]);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    applyImageFile(event.dataTransfer.files?.[0]);
  };

  const removeImage = () => {
    uploadSeqRef.current += 1;
    setSelectedImage(null);
    setProfilePictureUrl(null);
    setImageError(null);
    setPreviewUrl(prev => {
      revokePreview(prev);
      return null;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isBusy = form.formState.isSubmitting || isRegistering || isUploading;

  const onSubmit = async (values: RegisterFormValues) => {
    if (selectedImage && !profilePictureUrl) {
      toast({
        variant: 'destructive',
        title: 'Upload in progress',
        description: isUploading
          ? 'Please wait for your profile picture to finish uploading.'
          : 'Profile picture upload failed. Please try again or remove the image.',
      });
      return;
    }

    const parsed = parsePhoneFields(values.phone, phoneCountry);

    if (!parsed.phone_number || parsed.phone_number.length < 6) {
      form.setError('phone', {
        type: 'validate',
        message: 'Enter a valid phone number',
      });
      return;
    }

    const payload: RegisterPayload = {
      full_name: values.full_name.trim(),
      email: values.email.trim().toLowerCase(),
      country_code: parsed.country_code,
      phone_number: parsed.phone_number,
      password: values.password,
      role: 'USER',
      ...(profilePictureUrl ? { profile_picture: profilePictureUrl } : {}),
    };

    registerUser(payload);
  };

  return {
    form,
    fileInputRef,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    previewUrl,
    selectedImage,
    imageError,
    isDragging,
    setIsDragging,
    phoneCountry,
    setPhoneCountry,
    isBusy,
    onFileChange,
    onDrop,
    removeImage,
    onSubmit,
  };
}
