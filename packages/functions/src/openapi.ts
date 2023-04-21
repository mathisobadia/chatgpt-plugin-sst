import { respond } from "@chatgpt-plugin-starter/core/io-utils";
import { ApiHandler } from "sst/node/api";
import { generateOpenApiDocument } from "trpc-openapi";
import YAML from "yaml";
import { appRouter } from "./trpc";

export const handler = ApiHandler(async (evt) => {
  const APIUrl = `https://${evt.headers.host}`;
  const openApiDocument = generateOpenApiDocument(appRouter, {
    title: "TODO Plugin",
    version: "v1",
    description:
      "A plugin that allows the user to create and manage a TODO list using ChatGPT",
    baseUrl: APIUrl,
  });
  const yaml = YAML.stringify(openApiDocument);
  return respond.yaml(yaml);
});
