export interface ErrorModel {
  name: string;
  message: string;
  stack: string | undefined;
  cause: unknown;
}

const fromNativeError = (error: Error): ErrorModel => {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    cause: error.cause,
  };
};

const fromUnknownError = (error: unknown): ErrorModel => {
  const x = error as any;
  return {
    name: x.name,
    message: x.message,
    stack: x.stack,
    cause: x.cause,
  };
};

const from = (error: Error | unknown): ErrorModel => {
  if (error instanceof Error) {
    return fromNativeError(error);
  }
  return fromUnknownError(error);
};

export const ErrorModel = {
  from,
};
