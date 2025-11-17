// config/admin.ts
export default ({ env }) => ({
  apiToken: {
    salt: env(
      "API_TOKEN_SALT",
      "apiTokenSaltDev",
    ),
  },
  auth: {
    // 👇 SECRET cho JWT của admin
    secret: env(
      "ADMIN_JWT_SECRET",
      "adminJwtSecretDev",
    ),
  },
  transfer: {
    token: {
      salt: env(
        "TRANSFER_TOKEN_SALT",
        "transferTokenSaltDev",
      ),
    },
  },
});
