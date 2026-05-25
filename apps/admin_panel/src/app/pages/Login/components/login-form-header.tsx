import React from 'react';

export function LoginFormHeader() {
  return (
    <>
      <div className="mb-8 lg:hidden">
        <h1 className="text-3xl font-bold text-[#023047]">Admin Login</h1>
        <p className="mt-2 text-[#0077b6]/90">
          Enter your credentials to access the admin console.
        </p>
      </div>

      <div className="mb-8 hidden lg:block">
        <h2 className="text-2xl font-semibold text-[#023047]">Admin Login</h2>
        <p className="mt-1 text-sm text-[#0077b6]/80">
          Use email or phone number with your password.
        </p>
      </div>
    </>
  );
}
