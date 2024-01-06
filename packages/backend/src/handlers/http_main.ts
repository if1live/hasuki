import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import serverless from "serverless-http";
import { app } from "../app.js";

const handler = serverless(app);

export const dispatch: APIGatewayProxyHandlerV2 = async (event, context) => {
  const result = await handler(event, context);
  return result;
};
