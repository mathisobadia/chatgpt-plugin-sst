import { SSTConfig } from "sst";
import { API } from "./stacks/Stack";

export default {
  config(_input) {
    return {
      name: "chatgpt-plugin-starter",
      region: "us-west-2",
    };
  },
  stacks(app) {
    app.stack(API);
  },
} satisfies SSTConfig;
