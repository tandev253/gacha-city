"use strict";
// src/api/custom-auth/controllers/custom-auth.ts
Object.defineProperty(exports, "__esModule", { value: true });
const otpStore = new Map();
exports.default = {
    async sendOtp(ctx) {
        const { email, username, password } = ctx.request.body || {};
        if (!email || !username || !password) {
            return ctx.badRequest("Thiếu email, username hoặc password.");
        }
        // check tồn tại
        const existingUsers = await strapi
            .plugin("users-permissions")
            .service("user")
            .fetchAll({
            filters: {
                $or: [{ email }, { username }],
            },
        });
        if (existingUsers &&
            existingUsers.length > 0) {
            return ctx.badRequest("Email hoặc username đã tồn tại.");
        }
        // Tạo OTP
        const code = String(Math.floor(100000 + Math.random() * 900000));
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 phút
        otpStore.set(email, {
            username,
            password,
            code,
            expiresAt,
        });
        // Gửi email
        try {
            await strapi
                .plugin("email")
                .service("email")
                .send({
                to: email,
                subject: "Mã OTP đăng ký Gacha City",
                text: `Mã OTP của bạn là: ${code}. Mã có hiệu lực trong 10 phút.`,
            });
        }
        catch (err) {
            strapi.log.error("Send OTP error", err);
            return ctx.internalServerError("Không gửi được OTP.");
        }
        return ctx.send({
            ok: true,
            message: "OTP đã được gửi.",
        });
    },
    async registerWithOtp(ctx) {
        const { email, otp } = ctx.request.body || {};
        if (!email || !otp) {
            return ctx.badRequest("Thiếu email hoặc OTP.");
        }
        const entry = otpStore.get(email);
        if (!entry) {
            return ctx.badRequest("Không tìm thấy yêu cầu OTP cho email này.");
        }
        if (Date.now() > entry.expiresAt) {
            otpStore.delete(email);
            return ctx.badRequest("OTP đã hết hạn.");
        }
        if (entry.code !== otp) {
            return ctx.badRequest("OTP không đúng.");
        }
        // Tạo user
        const user = await strapi
            .plugin("users-permissions")
            .service("user")
            .add({
            username: entry.username,
            email,
            password: entry.password,
            confirmed: true,
        });
        const jwt = await strapi
            .plugin("users-permissions")
            .service("jwt")
            .issue({ id: user.id });
        otpStore.delete(email);
        return ctx.send({ jwt, user });
    },
};
