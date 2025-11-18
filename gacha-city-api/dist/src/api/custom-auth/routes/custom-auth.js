"use strict";
// Strapi v5 - TypeScript ESM
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: "POST",
            path: "/gc-auth/send-otp",
            handler: "custom-auth.sendOtp",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "POST",
            path: "/gc-auth/register-with-otp",
            handler: "custom-auth.registerWithOtp",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
};
