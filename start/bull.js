"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const Bull_1 = __importDefault(global[Symbol.for('ioc.use')]("Rocketseat/Bull"));
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const PORT = 9999;
const server = net_1.default.createServer();
server.once('error', async (error) => {
    if (error.code === 'EADDRINUSE') {
        await Bull_1.default.shutdown();
    }
});
server.once('listening', () => {
    server.close();
    Bull_1.default.process();
    if (Application_1.default.inDev) {
        Bull_1.default.ui(PORT);
    }
});
server.listen(PORT);
//# sourceMappingURL=bull.js.map