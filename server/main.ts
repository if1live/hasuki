import serverless from 'serverless-http';
import { app } from './src/app';

// https://serverless.com/blog/serverless-express-rest-api/
// Deploy a REST API using Serverless, Express and Node.js
export const handler = serverless(app);
