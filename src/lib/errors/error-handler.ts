export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    console.error('Unexpected error:', error);
    return new AppError('INTERNAL_ERROR', error.message, 500);
  }

  console.error('Unknown error:', error);
  return new AppError('INTERNAL_ERROR', 'Internal server error', 500);
}

