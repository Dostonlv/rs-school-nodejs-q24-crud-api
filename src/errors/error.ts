// src/errors/error.ts

import { ServerResponse } from 'http';

export const handleInvalidUUIDError = (res: ServerResponse) => {
  res.statusCode = 400;
  res.end('Invalid UUID');
};

export const handleNotFoundError = (res: ServerResponse) => {
  res.statusCode = 404;
  res.end('User not found');
};

export const handleMissingFieldsError = (res: ServerResponse) => {
  res.statusCode = 400;
  res.end('Missing required fields');
};

export const handleServerError = (res: ServerResponse, err: Error) => {
  console.error(err.stack);
  res.statusCode = 500;
  res.end('Server error');
};

export const handleEndpointNotFound = (res: ServerResponse) => {
  res.statusCode = 404;
  res.end('Endpoint not found');
};