import createApp from './app';

const port = process.env.PORT || 4000;
const app = createApp();

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
