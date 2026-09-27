// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: [
    "/*"
  ],
  exclude: [
    "/_nuxt/*",
    "/about",
    "/favicon.ico",
    "/og-image.png",
    "/projects",
    "/resume.pdf",
    "/robots.txt",
    "/work",
    "/about/_payload.json",
    "/favicon/about.txt",
    "/favicon/android-chrome-192x192.png",
    "/favicon/android-chrome-512x512.png",
    "/favicon/apple-touch-icon.png",
    "/favicon/favicon-16x16.png",
    "/favicon/favicon-32x32.png",
    "/favicon/favicon.ico",
    "/projects/_payload.json",
    "/work/_payload.json",
    "/img/work/creative.svg",
    "/img/work/parexons.webp",
    "/img/work/tilemountain.png",
    "/img/projects/bathroommountain/image.webp",
    "/img/projects/billfolda/image.webp",
    "/img/projects/esic/esic_directory.webp",
    "/img/projects/madcore/madcore_social.svg",
    "/img/projects/tilemountain/tilemountain.webp",
    "/img/projects/tiles247/tiles247.webp",
    "/img/projects/waf/waf.webp"
  ]
};

// ../../../tmp/claude-0/-home-user-me2/65c80f17-48c5-5ab7-affc-a4f10f34c2f8/scratchpad/wr/node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "/home/user/me2/.wrangler/tmp/pages-vLqY00/bundledWorker-0.08017721111152376.mjs";
import { isRoutingRuleMatch } from "/tmp/claude-0/-home-user-me2/65c80f17-48c5-5ab7-affc-a4f10f34c2f8/scratchpad/wr/node_modules/wrangler/templates/pages-dev-util.ts";
export * from "/home/user/me2/.wrangler/tmp/pages-vLqY00/bundledWorker-0.08017721111152376.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = worker;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=yc51wrh3019.js.map
