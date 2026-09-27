import{a as o,c as t}from"../../nitro/nitro.mjs";import{f as s}from"../../_/devto.mjs";const a=o(async o=>{try{return await s(o)}catch(o){throw console.error("[blog] failed to fetch posts from dev.to",o),t({statusCode:502,statusMessage:"Could not load blog posts"})}},{name:"blog-posts",maxAge:3600,staleMaxAge:86400,swr:!0});export{a as default};
//# sourceMappingURL=index.get.mjs.map
