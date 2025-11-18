// Strapi v5 - TypeScript ESM

// Kiểu dữ liệu cho OTP lưu RAM
interface OtpRecord {
  username: string;
  email: string;
  password: string;
  otp: string;
  expiresAt: number;
}

// Lưu OTP tạm trong RAM
const otpStore: Map<string, OtpRecord> =
  new Map();

function generateOtp(): string {
  return Math.floor(
    100000 + Math.random() * 900000,
  ).toString();
}

export default {
  /** ======= GỬI OTP ======= */
  async sendOtp(ctx: any) {
    try {
      const { username, email, password } =
        ctx.request.body ?? {};

      strapi.log.info(
        ">>> sendOtp body:",
        ctx.request.body,
      );

      if (!username || !email || !password) {
        return ctx.badRequest({
          error: {
            message:
              "Thiếu username, email hoặc password.",
          },
        });
      }

      const emailLower =
        String(email).toLowerCase();

      // Kiểm tra username/email tồn tại
      const existedUsers =
        await strapi.entityService.findMany(
          "plugin::users-permissions.user",
          {
            filters: {
              $or: [
                { username },
                { email: emailLower },
              ],
            },
            limit: 1,
          },
        );

      if (existedUsers?.length > 0) {
        return ctx.badRequest({
          error: {
            message:
              "Username hoặc Email đã tồn tại.",
          },
        });
      }

      // Tạo và lưu OTP
      const otp = generateOtp();

      otpStore.set(emailLower, {
        username,
        email: emailLower,
        password,
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000,
      });

      strapi.log.info(
        `OTP đăng ký cho ${emailLower}: ${otp}`,
      );

      return ctx.send({
        ok: true,
        message:
          "Đã tạo OTP (dev). Xem mã trong log server.",
      });
    } catch (err) {
      strapi.log.error(
        "custom-auth.sendOtp error:",
        err,
      );
      return ctx.internalServerError({
        error: {
          message: "Lỗi server khi gửi OTP.",
        },
      });
    }
  },

  /** ======= XÁC NHẬN OTP & TẠO USER ======= */
  async registerWithOtp(ctx: any) {
    try {
      const { email, otp } =
        ctx.request.body ?? {};

      if (!email || !otp) {
        return ctx.badRequest({
          error: {
            message: "Thiếu email hoặc otp.",
          },
        });
      }

      const emailLower =
        String(email).toLowerCase();
      const record = otpStore.get(emailLower);

      if (!record) {
        return ctx.badRequest({
          error: {
            message:
              "Không tìm thấy yêu cầu đăng ký với email này.",
          },
        });
      }

      if (Date.now() > record.expiresAt) {
        otpStore.delete(emailLower);
        return ctx.badRequest({
          error: {
            message:
              "OTP đã hết hạn. Vui lòng đăng ký lại.",
          },
        });
      }

      if (String(otp) !== record.otp) {
        return ctx.badRequest({
          error: {
            message: "OTP không chính xác.",
          },
        });
      }

      // Tạo user trong Strapi
      const user =
        await strapi.entityService.create(
          "plugin::users-permissions.user",
          {
            data: {
              username: record.username,
              email: record.email,
              password: record.password,
              confirmed: true,
              blocked: false,
            },
          },
        );

      otpStore.delete(emailLower);

      if (user?.password) delete user.password;

      return ctx.send({
        ok: true,
        message: "Đăng ký thành công.",
        user,
      });
    } catch (err) {
      strapi.log.error(
        "custom-auth.registerWithOtp error:",
        err,
      );
      return ctx.internalServerError({
        error: {
          message: "Lỗi server khi xác nhận OTP.",
        },
      });
    }
  },
};
