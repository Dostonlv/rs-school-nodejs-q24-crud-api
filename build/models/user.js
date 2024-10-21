"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
// src/models/user.ts
const uuid_1 = require("uuid");
let users = [];
const getAllUsers = () => users;
exports.getAllUsers = getAllUsers;
const getUserById = (id) => users.find(user => user.id === id);
exports.getUserById = getUserById;
const createUser = (username, age, hobbies) => {
    const newUser = { id: (0, uuid_1.v4)(), username, age, hobbies };
    users.push(newUser);
    return newUser;
};
exports.createUser = createUser;
const updateUser = (id, username, age, hobbies) => {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1)
        return null;
    users[userIndex] = { id, username, age, hobbies };
    return users[userIndex];
};
exports.updateUser = updateUser;
const deleteUser = (id) => {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1)
        return false;
    users.splice(userIndex, 1);
    return true;
};
exports.deleteUser = deleteUser;
