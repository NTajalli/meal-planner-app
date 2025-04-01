import { defineAuth, secret } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret("GoogleClientId"),
        clientSecret: secret("GoogleClientSecret"),
        scopes: ["email"],
        attributeMapping: {
          email: "email",
        },
      },
      callbackUrls: ["myapp://callback/"],
      logoutUrls: ["myapp://signout/"],
    },
  },
  userAttributes: {
    // specify a "birthdate" attribute
    birthdate: {
      mutable: true,
      required: false,
    },
  },
});
