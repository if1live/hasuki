import { ErrorModel } from "../ErrorModel.js";

// react-player onError
export interface ErrorProps {
  error: unknown;
  data?: unknown;
  hlsInstance?: unknown;
  hlsGlobal?: unknown;
}

export const ErrorView = (props: ErrorProps) => {
  const { error } = props;

  const model = ErrorModel.from(error);
  return (
    <>
      <h2>
        {model.name}
        <small>{model.message}</small>
      </h2>
      <pre>{model.stack}</pre>
      <pre>{JSON.stringify(model.cause, null, 2)}</pre>
    </>
  );
};
