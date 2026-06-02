type ErrorLike = {
  data?: string | { message?: string; error?: string };
  message?: string;
  error?: string;
};

export const getErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong',
): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (!error || typeof error !== 'object') {
    return fallback;
  }

  const err = error as ErrorLike;

  if (typeof err.data === 'string') {
    return err.data;
  }

  if (err.data && typeof err.data === 'object') {
    // If there is a nested envelope: err.data.data.message
    const nestedData = (err.data as any).data;
    if (nestedData && nestedData.message) {
      return nestedData.message;
    }
    return err.data.message || err.data.error || fallback;
  }

  return err.message || err.error || fallback;
};
