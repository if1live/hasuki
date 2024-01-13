export interface ErrorModel {
  type: string;
  name: string;
  message: string;
  stack: string | undefined;
  cause: unknown;
}

const fromNativeError = (error: Error): ErrorModel => {
  return {
    type: "Error",
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
    type: "string",
    name: error,
    message: "",
    stack: undefined,
    cause: undefined,
  };
};

/**
 * ytdl-core로 뜯은 url로 재생시도 했을떄 403 발생할때가 있다.
 * 이런 경우에는 Event로 에러가 들어온다
 */
const fromEventError = (error: Event): ErrorModel => {
  if (error.target instanceof HTMLAudioElement) {
    const { target } = error;
    return {
      type: "Event_HTMLAudioElement",
      name: error.target.constructor.name,
      message: target.currentSrc,
      stack: undefined,
      cause: error.target,
    };
  }

  // unknwon
  return {
    type: "Event",
    name: error.target?.constructor.name ?? "[unknown]",
    message: "",
    stack: undefined,
    cause: error.target,
  };
};

const fromUnknownError = (error: unknown): ErrorModel => {
  const x = error as any;
  return {
    type: typeof error,
    name: x.name,
    message: x.message,
    stack: x.stack,
    cause: x.cause,
  };
};

const from = (error: unknown): ErrorModel => {
  (window as any).g_error = error;

  if (typeof error === "string") {
    return fromStringError(error);
  }

  if (error instanceof Event) {
    return fromEventError(error);
  }

  if (error instanceof Error) {
    return fromNativeError(error);
  }

  return fromUnknownError(error);
};

export const ErrorModel = {
  from,
};
