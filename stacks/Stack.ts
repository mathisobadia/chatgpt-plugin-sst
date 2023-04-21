import { StackContext, Api, Config, SolidStartSite } from "sst/constructs";
import { Auth } from "sst/constructs/future";
import { Table } from "sst/constructs";

export function API({ stack }: StackContext) {
  // Secrets
  const secrets = Config.Secret.create(
    stack,
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
    "OPENAI_VERIFICATION_TOKEN",
    "OPENAI_PLUGIN_ID"
  );

  // Auth
  const auth = new Auth(stack, "auth", {
    authenticator: {
      handler: "packages/functions/src/auth.handler",
      bind: [secrets.GITHUB_CLIENT_ID, secrets.GITHUB_CLIENT_SECRET],
    },
  });

  // WEB
  const site = new SolidStartSite(stack, "Site", {
    path: "web/",
    environment: {
      VITE_AUTH_URL: auth.url,
    },
  });

  // DB
  const todoTable = new Table(stack, "Todos", {
    fields: {
      userId: "string",
      todoId: "string",
    },
    primaryIndex: { partitionKey: "userId", sortKey: "todoId" },
  });

  // API
  const api = new Api(stack, "api", {
    routes: {
      "GET /{proxy+}": {
        function: {
          handler: "packages/functions/src/trpc.handler",
        },
      },
      "POST /{proxy+}": {
        function: {
          handler: "packages/functions/src/trpc.handler",
        },
      },
      "DELETE /{proxy+}": {
        function: {
          handler: "packages/functions/src/trpc.handler",
        },
      },
      "GET /.well-known/ai-plugin.json":
        "packages/functions/src/ai-plugin.handler",
      "GET /.well-known/openapi.yaml": "packages/functions/src/openapi.handler",
    },
    defaults: {
      function: {
        bind: [auth, secrets.OPENAI_VERIFICATION_TOKEN, site, todoTable],
      },
    },
  });

  // Stack outputs
  stack.addOutputs({
    ApiEndpoint: api.url,
    AuthEndpoint: auth.url,
    URL: site.url || "http://localhost:3000",
  });
}
