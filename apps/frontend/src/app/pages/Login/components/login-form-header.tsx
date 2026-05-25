import React from 'react';

export function LoginFormHeader() {
  return (
    <>
      <div className="mb-8 lg:hidden">
        <h1 className="font-playWrite text-3xl font-semibold text-[#5c0a1a]">
          Login
        </h1>
        <p className="mt-2 text-[#722f37]/80">
          Enter your credentials to access your account.
        </p>
      </div>

      <div className="mb-8 hidden lg:block">
        <h2 className="text-2xl font-semibold text-[#5c0a1a]">Login</h2>
        <p className="mt-1 text-sm text-[#722f37]/75">
          Use email or phone number with your password.
        </p>
      </div>
    </>
  );
}
