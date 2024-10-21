"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const url_1 = require("url");
const user_1 = require("./models/user"); // CRUD metodlarini import qilish
const createServer = () => {
    const requestHandler = (req, res) => {
        var _a;
        const { method, url } = req;
        const parsedUrl = (0, url_1.parse)(url || '', true);
        const userId = (_a = parsedUrl.pathname) === null || _a === void 0 ? void 0 : _a.split('/')[3];
        const sendJson = (data, statusCode) => {
            res.writeHead(statusCode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        };
        if (method === 'GET' && parsedUrl.pathname === '/api/users') {
            // Get all users
            sendJson((0, user_1.getAllUsers)(), 200);
        }
        else if (method === 'GET' && userId) {
            // Get a user by ID
            const user = (0, user_1.getUserById)(userId);
            if (user) {
                sendJson(user, 200);
            }
            else {
                sendJson({ message: 'User not found' }, 404);
            }
        }
        else if (method === 'POST' && parsedUrl.pathname === '/api/users') {
            // Create a new user
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const { username, age, hobbies } = JSON.parse(body);
                if (username && age !== undefined && hobbies !== undefined) {
                    const newUser = (0, user_1.createUser)(username, age, hobbies);
                    sendJson(newUser, 201);
                }
                else {
                    sendJson({ message: 'Invalid data' }, 400);
                }
            });
        }
        else if (method === 'PUT' && userId) {
            // Update a user by ID
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const updatedData = JSON.parse(body);
                const updatedUser = (0, user_1.updateUser)(userId, updatedData.username, updatedData.age, updatedData.hobbies);
                if (updatedUser) {
                    sendJson(updatedUser, 200);
                }
                else {
                    sendJson({ message: 'User not found' }, 404);
                }
            });
        }
        else if (method === 'DELETE' && userId) {
            // Delete a user by ID
            if ((0, user_1.deleteUser)(userId)) {
                sendJson({}, 204); // No content
            }
            else {
                sendJson({ message: 'User not found' }, 404);
            }
        }
        else {
            sendJson({ message: 'Not Found' }, 404);
        }
    };
    const server = http_1.default.createServer(requestHandler);
    return server;
};
exports.default = createServer;
