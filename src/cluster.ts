import cluster from 'cluster';
import os from 'os';
import http from 'http';
import createServer from './server'; 

const numCPUs = os.cpus().length;
const PORT = parseInt(process.env.PORT || '4000', 10);

const users: Record<string, any> = {};

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  let currentWorker = 0;

  const server = http.createServer((req, res) => {
    const workers = Object.values(cluster.workers || {});

    if (workers.length) {
      currentWorker = (currentWorker + 1) % workers.length;
      const worker = workers[currentWorker];

      if (worker) {
        worker.send('sticky-session', req.socket);
      }
    }
  });

  server.listen(PORT, () => {
    console.log(`Load Balancer listening on port ${PORT}`);
  });

  cluster.on('message', (worker, message: any) => {
    if (message.type === 'update-user') {
      const { id, user } = message.data;
      users[id] = user;

      Object.values(cluster.workers || {}).forEach((w) => {
        if (w) {
          w.send({ type: 'sync-users', data: users });
        }
      });
    }
  });

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Spawning a new one.`);
    cluster.fork();
  });
} else {
  const app = createServer(); // Call the imported function

  const workerId = cluster.worker ? cluster.worker.id : 1;
  const workerPort = PORT + workerId;

  app.listen(workerPort, () => {
    console.log(`Worker ${process.pid} is listening on port ${workerPort}`);
  });

  process.on('message', (message: any, socket) => {
    if (typeof message === 'string' && message === 'sticky-session') {
      app.emit('connection', socket);
    } else if (typeof message === 'object' && message !== null && 'type' in message) {
      if (message.type === 'sync-users') {
        Object.assign(users, message.data);
      }
    }
  });
}