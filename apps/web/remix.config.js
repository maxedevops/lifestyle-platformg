/** @type {import('@remix-run/dev').AppConfig} */
export default {
  serverBuildTarget: "cloudflare-pages",
  serverModuleFormat: "esm",

  appDirectory: "app",
  assetsBuildDirectory: "build/client",
  publicPath: "/build/",

  ignoredRouteFiles: ["**/.*"],
};
