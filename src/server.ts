import http from 'http';
import { parse } from 'url';
import { IncomingMessage, ServerResponse } from 'http';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from './models/user'; // CRUD metodlarini import qilish

const createServer = () => {
  const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
    const { method, url } = req;
    const parsedUrl = parse(url || '', true);
    const userId = parsedUrl.pathname?.split('/')[3];

    const sendJson = (data: any, statusCode: number) => {
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    };

    if (method === 'GET' && parsedUrl.pathname === '/api/users') {
      // Get all users
      sendJson(getAllUsers(), 200);
    } else if (method === 'GET' && userId) {
      // Get a user by ID
      const user = getUserById(userId);
      if (user) {
        sendJson(user, 200);
      } else {
        sendJson({ message: 'User not found' }, 404);
      }
    } else if (method === 'POST' && parsedUrl.pathname === '/api/users') {
      // Create a new user
      let body: string = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const { username, age, hobbies } = JSON.parse(body);
        if (username && age !== undefined && hobbies !== undefined) {
          const newUser = createUser(username, age, hobbies);
          sendJson(newUser, 201);
        } else {
          sendJson({ message: 'Invalid data' }, 400);
        }
      });
    } else if (method === 'PUT' && userId) {
      // Update a user by ID
      let body: string = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const updatedData = JSON.parse(body);
        const updatedUser = updateUser(userId, updatedData.username, updatedData.age, updatedData.hobbies);
        if (updatedUser) {
          sendJson(updatedUser, 200);
        } else {
          sendJson({ message: 'User not found' }, 404);
        }
      });
    } else if (method === 'DELETE' && userId) {
      // Delete a user by ID
      if (deleteUser(userId)) {
        sendJson({}, 204); // No content
      } else {
        sendJson({ message: 'User not found' }, 404);
      }
    } else {
      sendJson({ message: 'Not Found' }, 404);
    }
  };

  const server = http.createServer(requestHandler);
  return server;
};

export default createServer;
