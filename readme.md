# Chat GPT plugin starter

Easily create a serverless chat GPT plugin with OAuth authentication flow

👤 User authentication with a fully implemented OAuth flow
✨ Auto generated OpenAPI spec
✅ Runtime validation of all API input and outputs
🌐 Host in your own AWS account

## Getting started

### Prerequisites

- Node 16
- pnpm
- AWS account with [configured credentials](https://docs.sst.dev/advanced/iam-credentials#loading-from-a-file)

### Adding and removing auth providers

This plugin uses SST Auth to create an OAuth authentication flow. For each provider you will need to configure the secret using the SST CLI. The current code has Github login and requires you to set the github token with the command

```bash
npx sst secrets set GITHUB_CLIENT_ID  <YOUR CLIENT ID>
npx sst secrets set GITHUB_CLIENT_SECRET  <YOUR CLIENT SECRET>
```

## Stack

- AWS infrastructure handled with [SST](https://sst.dev)
- Typesafe API with [tRPC](https://trpc.io)
- Auto generated OpenAPI spec with [tRPC OpenAPI](https://github.com/jlalmes/trpc-OpenAPI)
- Frontend with [solid start](https://start.solidjs.com) and [tailwindcss](https://tailwindcss.com/)
