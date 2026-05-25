import React from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from 'app/components/ui/button';

type LoginSubmitSectionProps = {
  isBusy: boolean;
};

export function LoginSubmitSection({ isBusy }: LoginSubmitSectionProps) {
  return (
    <Button
      type="submit"
      variant="primary"
      disabled={isBusy}
      className="h-20 w-full"
    >
      {isBusy ? (
        <>
          <Loader2 className="mr-2 size-5 animate-spin" />
          Signing in...
        </>
      ) : (
        'Sign in to Admin'
      )}
    </Button>
  );
}
