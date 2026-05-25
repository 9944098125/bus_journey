import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { Button } from 'app/components/ui/button';

type RegisterSubmitSectionProps = {
  isBusy: boolean;
};

export function RegisterSubmitSection({ isBusy }: RegisterSubmitSectionProps) {
  return (
    <>
      <Button
        type="submit"
        variant="primary"
        disabled={isBusy}
        className="h-20 w-full"
      >
        {isBusy ? (
          <>
            <Loader2 className="mr-2 size-5 animate-spin" />
            Registering...
          </>
        ) : (
          'Registration'
        )}
      </Button>

      <p className="text-center text-sm text-[#722f37]/80">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-[#5c0a1a] underline-offset-2 hover:underline"
        >
          Login
        </Link>
      </p>
    </>
  );
}
