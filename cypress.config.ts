import { defineConfig } from "cypress";

export default defineConfig({
  port: 8080,
  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});
