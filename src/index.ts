import createServer from './server'; 

const PORT = parseInt(process.env.PORT || '4000', 10);

const app = createServer();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});