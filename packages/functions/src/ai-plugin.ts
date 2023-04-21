import { ApiHandler } from "sst/node/api";
import { respond } from "@chatgpt-plugin-starter/core/io-utils";
import { Config } from "sst/node/config";
import { Auth } from "sst/node/future/auth";
import { SolidStartSite } from "sst/node/site";

export const handler = ApiHandler(async (evt) => {
  const authUrl = Auth.auth.url;
  console.log(authUrl);
  const APIUrl = `https://${evt.headers.host}`;
  const siteUrl = SolidStartSite.Site.url;
  const plugin = {
    schema_version: "v1",
    name_for_model: "Starter Plugin",
    name_for_human: "Starter Plugin",
    description_for_model:
      "Plugin for searching through the user's documents (such as files, emails, and more) to find answers to questions and retrieve relevant information. Use it whenever a user asks something that might be found in their personal information.",
    description_for_human: "Search through your documents.",
    auth: {
      type: "oauth",
      client_url: `${authUrl}/authorize`,
      authorization_url: `${authUrl}/token`,
      scope: "",
      authorization_content_type: "application/x-www-form-urlencoded",
      verification_tokens: {
        openai: Config.OPENAI_VERIFICATION_TOKEN,
      },
    },
    api: {
      url: `${APIUrl}/.well-known/openapi.yaml`,
      has_user_authentication: true,
      type: "openapi",
    },
    logo_url: `${siteUrl}/.well-known/logo.png`,
    contact_email: "hello@contact.com",
    legal_info_url: `${siteUrl}/legal`,
  };
  return respond.json(plugin);
});
