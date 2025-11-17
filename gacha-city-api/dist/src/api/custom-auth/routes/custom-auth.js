"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: "POST",
            path: "/gc-auth/send-otp",
            handler: "custom-auth.sendOtp",
            config: {
                auth: false,
            },
        },
        {
            method: "POST",
            path: "/gc-auth/register-with-otp",
            handler: "custom-auth.registerWithOtp",
            config: {
                auth: false,
            },
        },
    ],
};
