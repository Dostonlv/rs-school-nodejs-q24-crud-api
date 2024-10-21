"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const http_1 = __importDefault(require("http"));
const server_1 = __importDefault(require("./server"));
const numCPUs = os_1.default.cpus().length;
const PORT = parseInt(process.env.PORT || '4000', 10);
const users = {};
if (cluster_1.default.isPrimary) {
    console.log(`Master ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
        cluster_1.default.fork();
    }
    let currentWorker = 0;
    const server = http_1.default.createServer((req, res) => {
        const workers = Object.values(cluster_1.default.workers || {});
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
    cluster_1.default.on('message', (worker, message) => {
        if (message.type === 'update-user') {
            const { id, user } = message.data;
            users[id] = user;
            Object.values(cluster_1.default.workers || {}).forEach((w) => {
                if (w) {
                    w.send({ type: 'sync-users', data: users });
                }
            });
        }
    });
    cluster_1.default.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died. Spawning a new one.`);
        cluster_1.default.fork();
    });
}
else {
    const app = (0, server_1.default)(); // Call the imported function
    const workerId = cluster_1.default.worker ? cluster_1.default.worker.id : 1;
    const workerPort = PORT + workerId;
    app.listen(workerPort, () => {
        console.log(`Worker ${process.pid} is listening on port ${workerPort}`);
    });
    process.on('message', (message, socket) => {
        if (typeof message === 'string' && message === 'sticky-session') {
            app.emit('connection', socket);
        }
        else if (typeof message === 'object' && message !== null && 'type' in message) {
            if (message.type === 'sync-users') {
                Object.assign(users, message.data);
            }
        }
    });
}
