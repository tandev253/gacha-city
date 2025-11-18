// Strapi v5 - TypeScript ESM

// Tạo type đơn giản cho route (đủ dùng, không cần @strapi/types)
type RouteConfig = {
  method: string;
  path: string;
  handler: string;
  config: {
    auth: boolean;
    policies: any[];
    middlewares: any[];
  };
};

export default {
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
  ] as RouteConfig[],
};
