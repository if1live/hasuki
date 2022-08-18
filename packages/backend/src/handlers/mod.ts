import { app } from '../app.js';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import serverless from 'serverless-http';

let handler_app: serverless.Handler;
export const handle_http: APIGatewayProxyHandlerV2 = async (event, context) => {
  if (!handler_app) {
    handler_app = serverless(app.handler.bind(app), {
      request: (request: any) => {
        request.serverless = { event, context };
      }
    });
  }

  const result = await handler_app(event, context);
  return result;
};
