/** @type {import('@remix-run/dev').AppConfig} */
export default {
  serverBuildTarget: "cloudflare-pages",
  serverModuleFormat: "esm",
  serverPlatform: "neutral",

  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",

  ignoredRouteFiles: ["**/.*"],
};
