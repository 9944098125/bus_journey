import React from 'react';
import type { CountryData } from 'react-phone-input-2';

import type { useRegisterForm } from '../hooks/use-register-form';
import { ProfilePictureUpload } from './profile-picture-upload';
import { RegisterFormHeader } from './register-form-header';
import { RegisterNameEmailFields } from './register-name-email-fields';
import { RegisterPasswordFields } from './register-password-fields';
import { RegisterPhoneField } from './register-phone-field';
import { RegisterSubmitSection } from './register-submit-section';

type RegisterFormProps = ReturnType<typeof useRegisterForm>;

export function RegisterForm({
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
  setPhoneCountry,
  isBusy,
  onFileChange,
  onDrop,
  removeImage,
  onSubmit,
}: RegisterFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const handleCountryChange = (country: CountryData) => {
    setPhoneCountry(country);
  };

  return (
    <section className="flex-1 lg:flex lg:min-h-full lg:min-w-0 lg:flex-col">
      <div className="rounded-3xl border border-[#e8d4d6] bg-white/90 p-6 shadow-xl shadow-[#722f37]/10 backdrop-blur-sm sm:p-8 md:p-10 lg:flex lg:min-h-full lg:flex-1 lg:flex-col lg:justify-center lg:overflow-y-auto lg:rounded-none lg:border-0 lg:border-l lg:border-l-[#e8d4d6] lg:shadow-none lg:p-10 xl:p-14">
        <RegisterFormHeader />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <ProfilePictureUpload
            fileInputRef={fileInputRef}
            previewUrl={previewUrl}
            selectedImage={selectedImage}
            imageError={imageError}
            isDragging={isDragging}
            onFileChange={onFileChange}
            onDrop={onDrop}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onRemove={removeImage}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <RegisterNameEmailFields register={register} errors={errors} />
            <RegisterPhoneField
              control={control}
              errors={errors}
              onCountryChange={handleCountryChange}
            />
            <RegisterPasswordFields
              register={register}
              errors={errors}
              watch={watch}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              onTogglePassword={() => setShowPassword(prev => !prev)}
              onToggleConfirmPassword={() =>
                setShowConfirmPassword(prev => !prev)
              }
            />
          </div>

          <RegisterSubmitSection isBusy={isBusy} />
        </form>
      </div>
    </section>
  );
}
