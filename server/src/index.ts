import serverless from 'serverless-http';
import { app } from './app';

// https://serverless.com/blog/serverless-express-rest-api/
// Deploy a REST API using Serverless, Express and Node.js
export const handler = serverless(app);

if (!process.env.LAMBDA_TASK_ROOT) {
  const port = 3100;
  app.listen(port, () => {
    console.log(`listening: ${port}`);
  });
}

