"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const PORT = parseInt(process.env.PORT || '4000', 10);
const app = (0, server_1.default)();
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
