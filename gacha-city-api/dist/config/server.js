"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// config/server.ts
exports.default = ({ env }) => ({
    host: env("HOST", "0.0.0.0"),
    port: env.int("PORT", 1337),
    url: env("PUBLIC_URL", "http://localhost:1337"),
    app: {
        // dùng APP_KEYS trong .env, hoặc fallback sang mảng mặc định
        keys: env.array("APP_KEYS", [
            "gachaKeyA",
            "gachaKeyB",
            "gachaKeyC",
            "gachaKeyD",
        ]),
    },
});
