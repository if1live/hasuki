import { Message, MessageHeader } from "semantic-ui-react";
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
    <Message negative>
      <MessageHeader>
        Error: {model.name}, typeof={typeof error}
      </MessageHeader>
      <p>{model.message}</p>
      <pre>{model.stack}</pre>

      <pre>{JSON.stringify(model.cause, null, 2)}</pre>
      <pre>{JSON.stringify(props.data, null, 2)}</pre>
    </Message>
  );
};
