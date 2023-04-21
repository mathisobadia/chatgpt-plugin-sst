import { Config } from "sst/node/config";
import { AuthHandler, GithubAdapter } from "sst/node/future/auth";

type User = {
  userId: string;
};
declare module "sst/node/future/auth" {
  export interface SessionTypes {
    user: User;
  }
}

export const handler = AuthHandler({
  clients: async () => ({
    // This allows local clients to redirect back to localhost
    local: "http://localhost:3000",
    openai: `https//chat.openai.com/aip/${Config.OPENAI_PLUGIN_ID}/oauth/callback`,
  }),
  providers: {
    github: GithubAdapter({
      scope: "read:user user:email",
      clientID: Config.GITHUB_CLIENT_ID,
      clientSecret: Config.GITHUB_CLIENT_SECRET,
      mode: "oauth",
    }),
  },
  async onAuthorize(event) {
    console.log("AUTHORIZE", event.queryStringParameters);
    console.log("TEST", {
      scope: "read:user user:email",
      clientID: Config.GITHUB_CLIENT_ID,
      clientSecret: Config.GITHUB_CLIENT_SECRET,
    });
    // any code you want to run when auth begins
  },
  async onSuccess(input) {
    console.log("SUCCESS", input);
    if (input.provider === "github") {
      console.log("SUCCESS");
      const user = { userId: "test" }; // lookup or create user
      return {
        type: "user",
        properties: {
          userId: user.userId,
        },
      };
    }

    throw new Error("Unknown provider");
  },
  // This callback needs some work, not spec compliant currently
  async onError() {
    console.log("ERROR");
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "text/plain",
      },
      body: "Auth failed",
    };
  },
});
