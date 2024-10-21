"use strict";
// src/errors/error.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEndpointNotFound = exports.handleServerError = exports.handleMissingFieldsError = exports.handleNotFoundError = exports.handleInvalidUUIDError = void 0;
const handleInvalidUUIDError = (res) => {
    res.statusCode = 400;
    res.end('Invalid UUID');
};
exports.handleInvalidUUIDError = handleInvalidUUIDError;
const handleNotFoundError = (res) => {
    res.statusCode = 404;
    res.end('User not found');
};
exports.handleNotFoundError = handleNotFoundError;
const handleMissingFieldsError = (res) => {
    res.statusCode = 400;
    res.end('Missing required fields');
};
exports.handleMissingFieldsError = handleMissingFieldsError;
const handleServerError = (res, err) => {
    console.error(err.stack);
    res.statusCode = 500;
    res.end('Server error');
};
exports.handleServerError = handleServerError;
const handleEndpointNotFound = (res) => {
    res.statusCode = 404;
    res.end('Endpoint not found');
};
exports.handleEndpointNotFound = handleEndpointNotFound;
