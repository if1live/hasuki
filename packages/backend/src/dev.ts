import { app } from './app.js';

// 로컬 개발할때는 http 서버로 돌면 편할듯
if (!process.env.LAMBDA_TASK_ROOT) {
  const port = 3000;
  app.listen(port, () => {
    console.log(`server listening on ${port}`);
  });
}
