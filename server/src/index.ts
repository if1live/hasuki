import { app } from './app';
const port = 3100;

app.listen(port, () => {
  console.log(`listening: ${port}`);
});
