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

// react-player onError 로 받은 에러 예제
// error: "150", data: undefined, hlsInstance: undefined, hlsGlobal: undefined
// error가 문자열인 경우도 대응해야한다
const fromStringError = (error: string): ErrorModel => {
  return {
    name: error,
    message: "",
    stack: undefined,
    cause: undefined,
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

const from = (error: unknown): ErrorModel => {
  if (typeof error === "string") {
    return fromStringError(error);
  }

  if (error instanceof Error) {
    return fromNativeError(error);
  }

  return fromUnknownError(error);
};

export const ErrorModel = {
  from,
};
