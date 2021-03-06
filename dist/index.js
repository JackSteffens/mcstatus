"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
function checkStatus(server) {
    return new Promise((resolve, reject) => {
        const start_time = new Date();
        let ping;
        let data;
        const client = net_1.default.connect(server, () => {
            ping = Math.round(new Date().getMilliseconds() - start_time.getMilliseconds());
            let buff = Buffer.from([0xFE, 0x01]);
            client.write(buff);
        });
        client.on('data', (d) => {
            data = d.toString();
            client.destroy();
        });
        client.on('close', () => {
            let server_info = data === null || data === void 0 ? void 0 : data.split('\x00\x00\x00');
            let res = {
                ping: Number(ping),
                version: (server_info === null || server_info === void 0 ? void 0 : server_info[2].replace(/\u0000/g, '')) || 'Unknown',
                motd: (server_info === null || server_info === void 0 ? void 0 : server_info[3].replace(/\u0000/g, '')) || 'Unknown',
                players: Number((server_info === null || server_info === void 0 ? void 0 : server_info[4].replace(/\u0000/g, '')) || 0),
                max_players: Number((server_info === null || server_info === void 0 ? void 0 : server_info[5].replace(/\u0000/g, '')) || 0),
            };
            resolve(res);
        });
        client.on('error', (err) => reject(err));
    });
}
exports.checkStatus = checkStatus;
//# sourceMappingURL=index.js.map