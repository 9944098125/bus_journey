import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { Button } from 'app/components/ui/button';

type LoginSubmitSectionProps = {
  isBusy: boolean;
};

export function LoginSubmitSection({ isBusy }: LoginSubmitSectionProps) {
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
            Logging in...
          </>
        ) : (
          'Login'
        )}
      </Button>

      <p className="text-center text-sm text-[#722f37]/80">
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          className="font-semibold text-[#5c0a1a] underline-offset-2 hover:underline"
        >
          Registration
        </Link>
      </p>
    </>
  );
}
