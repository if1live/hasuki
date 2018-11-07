import { app } from './app';

if (!process.env.LAMBDA_TASK_ROOT) {
  const port = 3100;
  app.listen(port, () => {
    console.log(`listening: ${port}`);
  });
}

