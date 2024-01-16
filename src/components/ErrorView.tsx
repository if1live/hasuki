import { CSSProperties } from "react";
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

  const style: CSSProperties = {
    wordBreak: "break-word",
  };

  return (
    <Message negative>
      <MessageHeader>
        <span style={style}>
          Error: {model.name}, type={model.type}
        </span>
      </MessageHeader>
      <p style={style}>{model.message}</p>
      <p style={style}>{model.stack}</p>

      {/* <pre>{JSON.stringify(model.cause, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(props.data, null, 2)}</pre> */}
    </Message>
  );
};
