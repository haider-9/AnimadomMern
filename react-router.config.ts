import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  
  // Handle system requests that shouldn't reach React Router
  async buildEnd() {
    // This runs after the build completes
    console.log("Build completed - error handling configured");
  },
  
  // Configure how routes are processed
  routes(defineRoutes) {
    return defineRoutes((route) => {
      // Let React Router handle all routes normally
      // The splat route will catch unmatched paths
    });
  },
} satisfies Config;
